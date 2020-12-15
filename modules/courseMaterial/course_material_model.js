const db = require ('../../config/db_config');

const courseMaterial = db.sequelize.define('course_material', {
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
  file: {
    type: db.DataTypes.STRING,
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
}, { underscored: true, timestamp: true, tableName: 'course_material' });

module.exports = courseMaterial;
