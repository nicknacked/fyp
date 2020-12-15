const lectureModel = require ('./lectures_model');
const fs = require('fs');

class Lectures {
  
    constructor() { }

    createLecture() {
        return async (req, res) => { 
            
            const { name, class_id, description } = req.body;
            const file = req.file;
            if (!req.body || !name ||!class_id ||!description ||!file) {
                this.removeImage(file.filename).then().catch();
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                const result = await lectureModel.create({ name, class_id, description, file: file.filename });
                return res.status(200).json({ msg: 'Lecture Created Successfully' });
            } catch (err) {
                console.log('Error in creating lecture: ', err);
                this.removeImage(file.filename).then().catch();
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }
    
    listLectures() {
        return async (req, res) => { 
            
            let { id } = req.params;
            
            if (!id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await lectureModel.findAndCountAll({ where: { is_deleted: false, class_id: id } });
                const { count, rows } = result;
                return res.status(200).send({ count, data: rows });
            } catch (err) {
                console.log('Error in listing lectures from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    deleteLecture() {
        return async (req, res) => {

            const { lecture_id } = req.body;

            if (!req.body || !lecture_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const lecture = await lectureModel.findOne({ where: { id: lecture_id } });
                if (lecture) {
                    const result = await lectureModel.destroy({ where: { id: lecture.id } });
                    this.removeImage(lecture.file).then().catch();
                    return res.status(200).json({ msg: 'Lecture Deleted Successfully' });
                } else {
                    return res.status(404).send({ msg: 'Lecuture not found.' });
                }
            } catch (err) {
                console.log('Error in deleting class from db', err);
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

module.exports = new Lectures();
