const interestsModel = require ('./user_interest_model');
const interests = require('../interests/interests_model');

class UserInterests {
  
    constructor() { }

    createInterest() {
        return async (req, res) => { 
            
            const { user_id, interest_id } = req.body;
            
            if (!req.body || !user_id ||!interest_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                const result = await interestsModel.create({ user_id, interest_id });
                return res.status(200).json({ msg: 'Interest Created Successfully' });
            } catch (err) {
                console.log('Error in finding interest: ', err);
                return  res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }
    
    listInterests() {
        return async (req, res) => { 
            const { user_id } = req.params;
            try {
                const result = await interestsModel.findAndCountAll({ where: { user_id }, include: [interests] });
                const { count, rows } = result;
                return res.status(200).send({ count, data: rows });
            } catch (err) {
                console.log('Error in listing interests from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    deleteInterest() {
        return async (req, res) => {

            const { interest_id } = req.body;

            if (!req.body || !interest_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await interestsModel.destroy({ where: { id: interest_id } });
                console.log(result);
                return res.status(200).json({ msg: 'Interest Deleted Successfully' });
            } catch (err) {
                console.log('Error in deleting interest from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }
}

module.exports = new UserInterests();
