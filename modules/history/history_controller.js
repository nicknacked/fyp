const historyModel = require('./history_model');
const userModel = require('../users/users_model');
const db = require('../../config/db_config');

class UserHistory {
  
    constructor() { }

    createUserHistory() {
        return async (req, res) => { 
            
            const { user_id, page_name, class_id } = req.body;
            
            if (!req.body || !user_id ||!page_name) {
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                let condition = { user_id, page_name, is_deleted: false };
                if (class_id) {
                    condition.class_id = class_id
                }
                const result = await historyModel.findOne({ where: condition });
                if (result) {
                    result.update({ no_views: result.no_views + 1 });
                } else {
                    let history = { user_id, page_name, no_views: 1 };
                    if (class_id) {
                        history.class_id = class_id;
                    }
                    const result1 = await historyModel.create(history);
                }

                return res.status(200).json({ msg: 'History Created Successfully' });
            } catch (err) {
                console.log('Error in finding history: ', err);
                return  res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }

    resetUserHistory() {
        return async (req, res) => { 
            
            const { date } = req.body;
            
            if (!req.body || !date) {
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                const result = await historyModel.update({ is_deleted: true }, { where: {  updatedAt: { [db.DataTypes.Op.lte]: new Date(date) } } });
                return res.status(200).json({ msg: 'History Reset Successfully' });
            } catch (err) {
                console.log('Error in finding history: ', err);
                return  res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }

    createUserTimeHistory() {
        return async (req, res) => { 
            
            const { user_id, page_name, class_id, time_spent } = req.body;
            
            if (!req.body || !user_id ||!page_name) {
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                let condition = { user_id, page_name, is_deleted: false };
                if (class_id) {
                    condition.class_id = class_id
                }
                const result = await historyModel.findOne({ where: condition });
                if (result) {
                    result.update({ time_spent: result.time_spent + time_spent });
                } else {
                    let history = { user_id, page_name, time_spent };
                    if (class_id) {
                        history.class_id = class_id;
                    }
                    const result1 = await historyModel.create(history);
                }

                return res.status(200).json({ msg: 'History Time Spent Created Successfully' });
            } catch (err) {
                console.log('Error in finding history: ', err);
                return  res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }

    listUserHistory() {
        return async (req, res) => { 
            const { user_id, class_id } = req.params;
            
            if (!user_id || !class_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await historyModel.findAndCountAll({ where: { user_id, class_id, is_deleted: false }, include: [ userModel ] });
                const { count, rows } = result;
                return res.status(200).send({ count, data: rows });
            } catch (err) {
                console.log('Error in listing user history from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    listHistory()  {
        return async (req, res) => { 
           
            try {
                const result = await historyModel.findAndCountAll({ where: { is_deleted: false } });
                let { count, rows } = result;
                rows = JSON.parse(JSON.stringify(rows));
                let dView = { 
                    interests: 0, classes: 0, enrolledClasses: 0, generalTopics: 0, lectures: 0, 
                    topics: 0, annoucements: 0, assignments: 0, quizes: 0, couresMaterial: 0,
                    interests_time_spent: 0, classes_time_spent: 0, enrolledClasses_time_spent: 0, generalTopics_time_spent: 0, lectures_time_spent: 0, 
                    topics_time_spent: 0, annoucements_time_spent: 0, assignments_time_spent: 0, quizes_time_spent: 0, couresMaterial_time_spent: 0  
                };
         
                rows.forEach(elem => {
                    if (elem.page_name === "list lectures") {
                        dView.lectures = dView.lectures + elem.no_views;
                        dView.lectures_time_spent = dView.lectures_time_spent + elem.time_spent;
                    }
                    if (elem.page_name === 'list Private Topics') {
                        dView.topics = dView.topics + elem.no_views;
                        dView.topics_time_spent = dView.topics_time_spent + elem.time_spent;
                    }
                    if (elem.page_name === 'list annoucements') {
                        dView.annoucements = dView.annoucements + elem.no_views;
                        dView.annoucements_time_spent = dView.annoucements_time_spent + elem.time_spent;
                    }
                    if (elem.page_name === 'list assignments') {
                        dView.assignments = dView.assignments + elem.no_views;
                        dView.assignments_time_spent = dView.assignments_time_spent + elem.time_spent;
                    }
                    if (elem.page_name === 'list Quiz') {
                        dView.quizes = dView.quizes + elem.no_views;
                        dView.quizes_time_spent = dView.quizes_time_spent + elem.time_spent;
                    }
                    if (elem.page_name === 'list course material') {
                        dView.couresMaterial = dView.couresMaterial + elem.no_views;
                        dView.couresMaterial_time_spent = dView.couresMaterial_time_spent + elem.time_spent;
                    }
                    if (elem.page_name === "Interests") {
                        dView.interests = dView.interests + elem.no_views;
                        dView.interests_time_spent = dView.interests_time_spent + elem.time_spent;
                    }
                    if (elem.page_name === "list Classes") {
                        dView.classes = dView.classes + elem.no_views;
                        dView.classes_time_spent = dView.classes_time_spent + elem.time_spent;
                    }
                    if (elem.page_name === "list enrolled classes") {
                        dView.enrolledClasses = dView.enrolledClasses + elem.no_views;
                        dView.enrolledClasses_time_spent = dView.enrolledClasses_time_spent + elem.time_spent;
                    }
                    if (elem.page_name === "List General Topics") {
                        dView.generalTopics = dView.generalTopics + elem.no_views;
                        dView.generalTopics_time_spent = dView.generalTopics_time_spent + elem.time_spent;
                    }
                });
                return res.status(200).send({ count, data: dView });
            } catch (err) {
                console.log('Error in listing user history from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    // deleteUserHistory() {
    //     return async (req, res) => {

    //         const { interest_id } = req.body;

    //         if (!req.body || !interest_id) {
    //             return res.status(400).send({ msg: 'Bad Request' });
    //         }

    //         try {
    //             const result = await interestsModel.destroy({ where: { id: interest_id } });
    //             console.log(result);
    //             return res.status(200).json({ msg: 'Interest Deleted Successfully' });
    //         } catch (err) {
    //             console.log('Error in deleting interest from db', err);
    //             return res.status(500).json({ msg: 'Internal Server Error', error: err });
    //         }
    //     }
    // }
}

module.exports = new UserHistory();
