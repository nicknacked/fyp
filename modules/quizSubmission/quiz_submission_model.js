const db = require ('../../config/db_config');

const quizSubmission = db.sequelize.define('quiz_submission', {
  id: {
    type: db.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: db.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      },
      required: true
  },
  submission: {
    type: db.DataTypes.TEXT,
    required: true
  },
  quize_id: {
    type: db.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "quizes",
      key: "id"
    },
    required: true
  },
  obtained_marks: {
    type: db.DataTypes.DOUBLE
  },
  is_deleted: {
    type: db.DataTypes.BOOLEAN,
    required: true,
    defaultValue: false
  }
}, { underscored: true, timestamp: true, tableName: 'quiz_submission' });

module.exports = quizSubmission;
