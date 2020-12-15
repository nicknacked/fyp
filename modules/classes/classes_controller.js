const classesModel = require ('./classes_model');
const userModel = require('../users/users_model');
const studentEnrollModel = require('../studentsEnrolled/students_enrolled_model');
const db = require('../../config/db_config');

class Classes {
  
    constructor() { }

    createClasses() {
        return async (req, res) => { 
            
            const { name, user_id, description } = req.body;
            
            if (!req.body || !name ||!user_id ||!description) {
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                const result = await classesModel.create({ name, faculty_id :user_id, description });
                return res.status(200).json({ msg: 'Class Created Successfully' });
            } catch (err) {
                console.log('Error in creating class: ', err);
                return  res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }
    
    listClasses() {
        return async (req, res) => { 
            
            let { user } = req.params;
            
            if (!user) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await classesModel.findAndCountAll({ where: { is_deleted: false, faculty_id: user } });
                const { count, rows } = result;
                return res.status(200).send({ count, data: rows });
            } catch (err) {
                console.log('Error in listing classes from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    listUserClasses() {
        return async (req, res) => {
            const { user_id } = req.params;
            if (!user_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await db.sequelize.query(`SELECT classes.id, classes.name, classes.created_at, classes.updated_at, classes.description, classes.is_deleted, classes.faculty_id, users.first_name, users.last_name
                FROM classes INNER JOIN users ON classes.faculty_id=users.id  WHERE classes.is_deleted = 0`, { type: db.sequelize.QueryTypes.SELECT });
                const result2 = await userModel.findOne({ where: { is_deleted: false, id: user_id }, include: [ classesModel ] });
                let dataToReturn = [];
                if (result2.classes.length) {
                    result.forEach(elem => {
                        if (!result2.classes.some(x => x.id === elem.id)) {
                            dataToReturn.push(elem);
                        }
                    });   
                } else {
                    dataToReturn = result;
                }
                return res.status(200).send({ data: dataToReturn });
            } catch (err) {
                console.log('Error in listing user classes from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }
   

    listUserJoinedClasses() {
        return async (req, res) => {
            
            const { user_id } = req.params;
            if (!user_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result2 = await userModel.findOne({ where: { is_deleted: false, id: user_id }, include: [ classesModel ] });
                return res.status(200).send({ data: result2 });
            } catch (err) {
                console.log('Error in listing user joined classes from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    enrollStudent() {
        return async (req, res) => { 
            
            let { userid, classid } = req.body;
            
            if (!userid ||!classid) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result1 = await studentEnrollModel.findOne({ where: { userid, classid } });
                if (!result1) {
                    const result = await studentEnrollModel.create({ userid, classid });
                }
                return res.status(200).send({ msg: 'Student Enrolled Successfully' });
            } catch (err) {
                console.log('Error in student enroll', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    listClassesStudent() {
        return async (req, res) => { 
            
            let { class_id } = req.params;
            
            if (!class_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await classesModel.findOne({ where: { is_deleted: false, id: class_id }, include: [ userModel ] });
                return res.status(200).send({ data: result });
            } catch (err) {
                console.log('Error in listing classes from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    deleteClass() {
        return async (req, res) => {

            const { class_id } = req.body;

            if (!req.body || !class_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await classesModel.update({ is_deleted: true }, { where: { id: class_id } });
                return res.status(200).json({ msg: 'Class Deleted Successfully' });
            } catch (err) {
                console.log('Error in deleting class from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }
}

module.exports = new Classes();
