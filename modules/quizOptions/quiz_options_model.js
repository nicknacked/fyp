const db = require ('../../config/db_config');

const quizOption = db.sequelize.define('quiz_options', {
  id: {
    type: db.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: db.DataTypes.STRING
  },
  op1: {
    type: db.DataTypes.STRING
  },
  op2: {
    type: db.DataTypes.STRING
  },
  op3: {
    type: db.DataTypes.STRING
  },
  op4: {
    type: db.DataTypes.STRING
  },
  correct_option: {
    type: db.DataTypes.STRING
  },
  quize_id: {
    type: db.DataTypes.INTEGER
  },
  is_deleted: {
    type: db.DataTypes.BOOLEAN,
    required: true,
    defaultValue: false
  }
}, { underscored: true, timestamp: true, tableName: 'quiz_options' });

module.exports = quizOption;
