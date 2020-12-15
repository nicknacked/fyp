const quizModel = require ('./quiz_model');
const submissionModel = require('../quizSubmission/quiz_submission_model');
const userModel = require('../users/users_model');
const quizOptionModel = require('../quizOptions/quiz_options_model');
const db = require('../../config/db_config');

class Quiz {
  
    constructor() { }

    createQuiz() {
        return async (req, res) => { 
            
            const { title, class_id, total_marks, submission_date, options } = req.body;
            let quizOptions = JSON.parse(options);
            if (!req.body || !title ||!class_id ||!total_marks ||!submission_date ||!quizOptions.length) {
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            let transaction;
            try {
                transaction = await db.sequelize.transaction();
                const newQuiz = await quizModel.create({ title, class_id, submission_date, total_marks }, { transaction });
                
                let promiseArray = [];
                quizOptions.forEach(elem => {
                    promiseArray.push(quizOptionModel.create({ 
                        question: elem.question,
                        op1: elem.op1,
                        op2: elem.op2,
                        op3: elem.op3,
                        op4: elem.op4,
                        correct_option: elem.correct,
                        quize_id: newQuiz.id
                    }, { transaction }));
                });

                let reuslt = await Promise.all(promiseArray);
                await transaction.commit();
                
                return res.status(200).json({ msg: 'Quiz Created Successfully' });
            } catch (err) {
                console.log('Error in creating quiz: ', err);
                this.removeImage(file.filename).then().catch();
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }
    
    listQuiz() {
        return async (req, res) => { 
            
            let { id } = req.params;
            
            if (!id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await quizModel.findAndCountAll({ where: { is_deleted: false, class_id: id } });
                const { count, rows } = result;
                return res.status(200).send({ count, data: rows });
            } catch (err) {
                console.log('Error in listing quiz from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    getUserQuiz() {
        return async (req, res) => {
            let { quiz_id, class_id } = req.params;
            
            if (!quiz_id ||!class_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                let result = await quizModel.findOne({ where: { is_deleted: false, class_id: class_id, id: quiz_id }, include: [ submissionModel, quizOptionModel ] });
                result = JSON.parse(JSON.stringify(result));
                result && result.quiz_options ? result.quiz_options.forEach(elem => {
                    delete elem.correct_option;
                    elem.correct_option = { op1: false, op2: false, op3: false, op4: false };
                    elem.correct = null;
                }) : null;
                result && result.quiz_submissions ? result.quiz_submissions.forEach(elem => {
                    let filtered = elem.quiz_submissions.filter(x => x.user_id == user_id);
                    result.quiz_submissions = filtered.length ? filtered[0] : {};
                }) : null;
                return res.status(200).send({ data: result });
            } catch (err) {
                console.log('Error in user quiz from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    submitQuiz() {
        return async (req, res) => {
            let { quiz_id, class_id, options, user_id } = req.body;
            
            if (!quiz_id ||!class_id ||!options ||!user_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                let newOptions = JSON.parse(options);
                let result = await quizModel.findOne({ where: { is_deleted: false, class_id: class_id, id: quiz_id }, include: [ submissionModel, quizOptionModel ] });
                result = JSON.parse(JSON.stringify(result));
                result && result.quiz_submissions ? result.quiz_submissions.forEach(elem => {
                    let filtered = elem.quiz_submissions.filter(x => x.user_id == user_id);
                    result.quiz_submissions = filtered.length ? filtered[0] : {};
                }) : null;
                
                if (Object.keys(result.quiz_submissions).length) {
                    return res.status(400).send({ msg: 'Quiz already submitted' });
                }

                if (result) {
                    let total_marks = result.total_marks;
                    let obtained_marks = 0;
                    let marksPerOption = total_marks / result.quiz_options.length;

                    result.quiz_options.forEach(elem => {
                        let filtered = newOptions.filter(x => x.id == elem.id);
                        if (filtered.length) {
                            let qoption = filtered[0];
                            if (qoption.correct == elem.correct_option) {
                                obtained_marks = obtained_marks + marksPerOption;
                            }
                        } 
                    });

                    if (Object.keys(result.quiz_submissions).length) {
                        const submissionResult = await submissionModel.update({ obtained_marks, submission: options }, { where: { id: result.quiz_submissions.id } });
                        return res.status(200).send({ msg: 'Quiz Submitted' });
                    } else {
                        const submissionResult = await submissionModel.create({ user_id: user_id, submission: options, quize_id: quiz_id, obtained_marks });
                        return res.status(200).send({ msg: 'Quiz Submitted' });
                    }
                }
               
            } catch (err) {
                console.log('Error in user quiz from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    deleteQuiz() {
        return async (req, res) => {

            const { quiz_id } = req.body;

            if (!req.body || !quiz_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const resultOption = await quizOptionModel.destroy({ where: { quize_id: quiz_id } });
                const resultSubmission = await submissionModel.destroy({ where: { quize_id: quiz_id } });
                const result = await quizModel.destroy({ where: { id: quiz_id } });
                return res.status(200).json({ msg: 'Quiz Deleted Successfully' });
            } catch (err) {
                console.log('Error in deleting class from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }

    listUserQuiz() {
        return async (req, res) => { 
            
            let { id, user_id } = req.params;
            
            if (!id ||!user_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await quizModel.findAndCountAll({ where: { is_deleted: false, class_id: id }, include: [ submissionModel ] });
                let { count, rows } = result;
                rows = JSON.parse(JSON.stringify(rows));
                let newRows = [];
                rows.forEach(elem => {
                    let filtered = elem.quiz_submissions.filter(x => x.user_id == user_id);
                    newRows.push({...elem, quiz_submissions : filtered.length ? filtered[0] : {} });
                });
                return res.status(200).send({ count, data: newRows });
            } catch (err) {
                console.log('Error in listing user quiz from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    submissionList() {
        return async (req, res) => {

            let { id } = req.params;
            
            if (!id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await submissionModel.findAndCountAll({ where: { is_deleted: false, quize_id: id }, include: [ quizModel, userModel ] });
                const { count, rows } = result;
                return res.status(200).send({ count, data: rows });
            } catch (err) {
                console.log('Error in listing submission quiz from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    
    submissionUpdate() {
        return async (req, res) => {

            let { submission_id, obtained_marks } = req.body;
            
            if (!submission_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await submissionModel.update({ obtained_marks }, { where: { id: submission_id } });
                return res.status(200).send({ msg: 'Marks added successfully' });
            } catch (err) {
                console.log('Error in update submission quiz from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

}

module.exports = new Quiz();
