const annoucementsModel = require ('./annoucements_model');

class Annoucement {
  
    constructor() { }

    createAnnoucement() {
        return async (req, res) => { 
            
            const { title, class_id, description } = req.body;
            
            if (!req.body || !title ||!description) {
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                let annoucement = { title, description, class_id };
                const result = await annoucementsModel.create(annoucement);
                return res.status(200).json({ msg: 'Annoucement Created Successfully' });
            } catch (err) {
                console.log('Error in creating annoucement: ', err);
                return  res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }
    
    listAnnoucement() {
        return async (req, res) => { 
            
            let { id } = req.params;
            
            if (!id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await annoucementsModel.findAndCountAll({ where: { is_deleted: false, class_id: id } });
                const { count, rows } = result;
                return res.status(200).send({ count, data: rows });
            } catch (err) {
                console.log('Error in listing annoucements from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    deleteAnnoucement() {
        return async (req, res) => {

            const { annoucement_id } = req.body;

            if (!req.body || !annoucement_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await annoucementsModel.update({ is_deleted: true }, { where: { id: annoucement_id } });
                return res.status(200).json({ msg: 'Annoucement Deleted Successfully' });
            } catch (err) {
                console.log('Error in deleting annoucement from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }
}

module.exports = new Annoucement();
