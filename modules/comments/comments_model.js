const db = require ('../../config/db_config');

const comments = db.sequelize.define('comments', {
  id: {
    type: db.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  comment: {
    type: db.DataTypes.TEXT,
    required: true
  },
  topic_id: {
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
}, { underscored: true, timestamp: true, tableName: 'comment' });

module.exports = comments;
