const db = require ('../../config/db_config');

const topics = db.sequelize.define('topics', {
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
  type: {
    type: db.DataTypes.BOOLEAN,
    required: true
  },
  class_id: {
    type: db.DataTypes.INTEGER,
    required: true 
  },
  user_id: {
    type: db.DataTypes.INTEGER,
    required: true 
  },
  is_deleted: {
    type: db.DataTypes.BOOLEAN,
    required: true,
    defaultValue: false
  }
}, { underscored: true, timestamp: true, tableName: 'topics' });

module.exports = topics;
