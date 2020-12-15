const db = require ('../../config/db_config');

const assignment = db.sequelize.define('assignments', {
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
  description: {
    type: db.DataTypes.TEXT,
    required: true
  },
  file: {
    type: db.DataTypes.STRING,
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
}, { underscored: true, timestamp: true, tableName: 'assignments' });

module.exports = assignment;
