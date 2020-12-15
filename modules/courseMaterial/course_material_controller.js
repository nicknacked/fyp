const courseMaterialModel = require ('./course_material_model');
const fs = require('fs');

class CourseMaterial {
  
    constructor() { }

    createCourseMaterial() {
        return async (req, res) => { 
            
            const { title, class_id } = req.body;
            const file = req.file;
            if (!req.body || !title ||!class_id ||!file) {
                this.removeImage(file.filename).then().catch();
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                const result = await courseMaterialModel.create({ title, class_id, file: file.filename });
                return res.status(200).json({ msg: 'Course Material Created Successfully' });
            } catch (err) {
                console.log('Error in creating course material: ', err);
                this.removeImage(file.filename).then().catch();
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }
    
    listCourseMaterial() {
        return async (req, res) => { 
            
            let { id } = req.params;
            
            if (!id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const result = await courseMaterialModel.findAndCountAll({ where: { is_deleted: false, class_id: id } });
                const { count, rows } = result;
                return res.status(200).send({ count, data: rows });
            } catch (err) {
                console.log('Error in listing course material from db', err);
                return res.status(500).json({ msg: 'Internal Server Error', error: err });
            }   
        }
    }

    deleteCourseMaterial() {
        return async (req, res) => {

            const { material_id } = req.body;

            if (!req.body || !material_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }

            try {
                const material = await courseMaterialModel.findOne({ where: { id: material_id } });
                if (material) {
                    const result = await courseMaterialModel.destroy({ where: { id: material.id } });
                    this.removeImage(material.file).then().catch();
                    return res.status(200).json({ msg: 'Course Material Deleted Successfully' });
                } else {
                    return res.status(404).send({ msg: 'Course Material not found.' });
                }
            } catch (err) {
                console.log('Error in deleting course material from db', err);
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

module.exports = new CourseMaterial();
