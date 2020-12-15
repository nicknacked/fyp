const interestsModel = require ('./interests_model');

class Interests {
  
    constructor() { }

    createInterest() {
        return async (req, res) => { 
            
            const { name } = req.body;
            
            if (!req.body || !name) {
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                const result = await interestsModel.create({ name });
                return res.status(200).json({ msg: 'Interest Created Successfully' });
            } catch (err) {
                console.log('Error in finding interest: ', err);
                return  res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }
    
    listInterests() {
        return async (req, res) => { 
            try {
                const result = await interestsModel.findAndCountAll({ });
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
                return res.status(200).json({ msg: 'Interest Deleted Successfully' });
            } catch (err) {
                console.log('Error in deleting interest from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }
}

module.exports = new Interests();
