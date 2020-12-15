const db = require ('../../config/db_config');

const users = db.sequelize.define('users', {
  id: {
    type: db.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: db.DataTypes.STRING(150),
  },
  last_name: {
    type: db.DataTypes.STRING(150),
  },
  email: {
    type: db.DataTypes.STRING(256),
    required: true,
    unique: true
  },
  password: {
    type: db.DataTypes.STRING,
  },
  u_id: {
    type: db.DataTypes.STRING,
    unique: true,
    required: true
  },
  role: {
    type: db.DataTypes.STRING,
    required: true
  },
  status: {
    type: db.DataTypes.BOOLEAN,
    required: true,
    defaultValue: 0
  },
  is_deleted: {
    type: db.DataTypes.BOOLEAN,
    required: true,
    defaultValue: 0
  },
  createdAt: db.DataTypes.DATE,
  updatedAt: db.DataTypes.DATE,
});

module.exports = users;
