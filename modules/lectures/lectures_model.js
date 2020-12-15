const db = require ('../../config/db_config');

const lectures = db.sequelize.define('lectures', {
  id: {
    type: db.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: db.DataTypes.STRING,
    required: true,
    unique: true
  },
  description: {
    type: db.DataTypes.TEXT,
    required: true
  },
  file: {
    type: db.DataTypes.TEXT,
    required: true
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
}, { underscored: true, timestamp: true, tableName: 'lectures' });

module.exports = lectures;
