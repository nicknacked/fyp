const assignmentModel = require ('./assignments_model');
const fs = require('fs');
const submissionModel = require('../studentFacultyAssignments/student_faculty_assignment_model');
const userModel = require('../users/users_model');
const quizModel = require('../quizes/quiz_model');
const quizSubmissionModel = require('../quizSubmission/quiz_submission_model');

class Assignment {
  
    constructor() { }

    createAssignment() {
        return async (req, res) => { 
            
            const { title, class_id, description, total_marks, submission_date } = req.body;
            const file = req.file;
            if (!req.body || !title ||!class_id ||!description ||!total_marks ||!file ||!submission_date) {
                this.removeImage(file.filename).then().catch();
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                const result = await assignmentModel.create({ title, class_id, submission_date, description, file: file.filename, total_marks });
                return res.status(200).json({ msg: 'Assignment Created Successfully' });
            } catch (err) {
                console.log('Error in creating assignment: ', err);
                this.removeImage(file.filename).then().catch();
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }

    submitAssignment() {
        return async (req, res) => { 
            
            const { user_id, assign_id, } = req.body;
            const file = req.file;
            if (!req.body || !user_id ||!assign_id ||!file) {
                this.removeImage(file.filename).then().catch();
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                const result = await submissionModel.create({ user_id, assignment_id: assign_id, file: file.filename });
                return res.status(200).json({ msg: 'Assignment Submitted Successfully' });
            } catch (err) {
                console.log('Error in creating assignment: ', err);
                this.removeImage(file.filename).then().catch();
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }

    resubmitAssignment() {
        return async (req, res) => { 
            
            const { user_id, assign_id, } = req.body;
            const file = req.file;
            if (!req.body || !user_id ||!assign_id ||!file) {
                this.removeImage(file.filename).then().catch();
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                const result = await submissionModel.findOne({ where: { user_id, assignment_id: assign_id } });
                if (result) {
                    this.removeImage(result.file).then().catch();
                    const result1 = await result.update({ file: file.filename });
                    return res.status(200).json({ msg: 'Assignment ReSubmitted Successfully' });
                } else {
                    this.removeImage(file.filename).then().catch();
                    return res.status(404).json({ msg: 'Assignment Not found' });
                }
            } catch (err) {
                console.log('Error in updating resubmit assignment: ', err);
                this.removeImage(file.filename).then().catch();
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }

    listAssignment() {
        return async (req, res) => { 
            
            let { id } = req.params;
            
            if (!id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await assignmentModel.findAndCountAll({ where: { is_deleted: false, class_id: id } });
                const { count, rows } = result;
                return res.status(200).send({ count, data: rows });
            } catch (err) {
                console.log('Error in listing assignments from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    listUserAssignment() {
        return async (req, res) => { 
            
            let { id, user_id } = req.params;
            
            if (!id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await assignmentModel.findAndCountAll({ where: { is_deleted: false, class_id: id }, include: [ submissionModel ] });
                let { count, rows } = result;
                rows = JSON.parse(JSON.stringify(rows));
                let newRows = [];
                rows.forEach(elem => {
                    let filtered = elem.assignment_submissions.filter(x => x.user_id == user_id);
                    newRows.push({...elem, assignment_submissions : filtered.length ? filtered[0] : {} });
                });
                return res.status(200).send({ count, data: newRows });
            } catch (err) {
                console.log('Error in listing user assignments from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    userProgress() {
        return async (req, res) => { 
            
            let { class_id, user_id } = req.params;
            
            if (!class_id || !user_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const userResult = await userModel.findOne({ where: { id: user_id } });
                const result = await assignmentModel.findAndCountAll({ where: { is_deleted: false, class_id }, include: [ submissionModel ] });
                const result1 = await quizModel.findAndCountAll({ where: { is_deleted: false, class_id }, include: [ quizSubmissionModel ] });
               
                let { rows } = result;
                rows = JSON.parse(JSON.stringify(rows));
                let newRows = [];
                rows.forEach(elem => {
                    let filtered = elem.assignment_submissions.filter(x => x.user_id == user_id);
                    newRows.push({...elem, assignment_submissions : filtered.length ? filtered[0] : {} });
                });

                let quizRows = result1.rows;
                quizRows = JSON.parse(JSON.stringify(quizRows));
                let newQuizRows = [];
                quizRows.forEach(elem => {
                    let filtered = elem.quiz_submissions.filter(x => x.user_id == user_id);
                    newQuizRows.push({...elem, quiz_submissions : filtered.length ? filtered[0] : {} });
                });

                let progressData = { assignments: newRows, quizes: newQuizRows, user: userResult }; 
                return res.status(200).send({ data: progressData });
            } catch (err) {
                console.log('Error in listing user progress from db', err);
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
                const result = await submissionModel.findAndCountAll({ where: { is_deleted: false, assignment_id: id }, include: [ assignmentModel, userModel ] });
                const { count, rows } = result;
                return res.status(200).send({ count, data: rows });
            } catch (err) {
                console.log('Error in listing submission assignments from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    deleteAssignment() {
        return async (req, res) => {

            const { assign_id } = req.body;

            if (!req.body || !assign_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const assignment = await assignmentModel.findOne({ where: { id: assign_id }, include: [ submissionModel ] });
                if (assignment) {
                    assignment.assignment_submissions.forEach(elem => {
                        this.removeImage(elem.file).then().catch();
                    });
                    const resultSubmission = await submissionModel.destroy({ where: { assignment_id: assignment.id } });
                    const result = await assignmentModel.destroy({ where: { id: assignment.id } });
                    this.removeImage(assignment.file).then().catch();
                    return res.status(200).json({ msg: 'Assignment Deleted Successfully' });
                } else {
                    return res.status(404).send({ msg: 'Assignment not found.' });
                }
            } catch (err) {
                console.log('Error in deleting assignment from db', err);
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
                console.log('Error in update submission assignments from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    removeImage(path) {
        return new Promise((rsv, rej) => {
            fs.unlink(`public/uploads/${path}`, (err) => {
                if (err) {
                  console.error(err);
                  return rej(err); 
                }
                return rsv({ msg: 'unlinked successfully' });
              })
        });
    }
}

module.exports = new Assignment();
