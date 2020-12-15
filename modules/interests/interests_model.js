const db = require ('../../config/db_config');

const interests = db.sequelize.define('interests', {
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
  is_deleted: {
    type: db.DataTypes.BOOLEAN,
    required: true,
    defaultValue: false
  }
}, { underscored: true, timestamp: true, tableName: 'interests' });

module.exports = interests;
