const db = require ('../../config/db_config');

const history = db.sequelize.define('history', {
  id: {
    type: db.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  page_name: {
    type: db.DataTypes.STRING,
    required: true
  },
  no_views: {
    type: db.DataTypes.INTEGER
  },
  time_spent: {
    type: db.DataTypes.DOUBLE
  },
  user_id: {
    type: db.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id"
    },
    required: true
  },
  class_id: {
    type: db.DataTypes.INTEGER,
    references: {
      model: "classes",
      key: "id"
    }
  },
  is_deleted: {
    type: db.DataTypes.BOOLEAN,
    required: true,
    defaultValue: false
  }
}, { underscored: true, timestamp: true, tableName: 'history' });

module.exports = history;
