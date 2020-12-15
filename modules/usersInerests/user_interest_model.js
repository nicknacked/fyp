const db = require ('../../config/db_config');

const userInterests = db.sequelize.define('user_interests', {
  id: {
    type: db.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: db.DataTypes.INTEGER,
    required: true
  },
  interest_id: {
    type: db.DataTypes.INTEGER,
    required: true
  }
}, { underscored: true, timestamp: true, tableName: 'user_interests' });

module.exports = userInterests;
