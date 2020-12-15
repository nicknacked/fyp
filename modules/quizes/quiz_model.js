const db = require ('../../config/db_config');

const quiz = db.sequelize.define('quizes', {
  id: {
    type: db.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: db.DataTypes.STRING,
    required: true,
    unique: true
  },
  total_marks: {
    type: db.DataTypes.DOUBLE
  },
  submission_date: {
    type: db.DataTypes.DATE
  },
  class_id: {
    type: db.DataTypes.INTEGER,
    required: true
  },
  is_deleted: {
    type: db.DataTypes.BOOLEAN,
    required: true,
    defaultValue: false
  }
}, { underscored: true, timestamp: true, tableName: 'quizes' });

module.exports = quiz;
