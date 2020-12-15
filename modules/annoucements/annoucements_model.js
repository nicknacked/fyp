const db = require ('../../config/db_config');

const annoucements = db.sequelize.define('annoucements', {
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
  class_id: {
    type: db.DataTypes.INTEGER,
    required: true
  },
  is_deleted: {
    type: db.DataTypes.BOOLEAN,
    required: true,
    defaultValue: false
  }
}, { underscored: true, timestamp: true, tableName: 'annoucements' });

module.exports = annoucements;
