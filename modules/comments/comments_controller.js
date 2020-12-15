const commentModel = require ('./comments_model');

class Comments {
  
    constructor() { }

    createComment() {
        return async (req, res) => { 
            
            const { comment, topic_id, user_id } = req.body;
            
            if (!topic_id || !comment ||!user_id) {
                return res.status(400).send({ msg: 'Bad Request' });
            }
            
            try {
                let newComment = { comment, topic_id, user_id };
                const result = await commentModel.create(newComment);
                return res.status(200).send({ msg: 'Comment Created Successfully' });
            } catch (err) {
                console.log('Error in creating comment: ', err);
                return  res.status(500).json({ msg: 'Internal Server Error', error: err });
            }
        }
    }    
}

module.exports = new Comments();
