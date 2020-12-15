const config = require("./config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.RDS_DB_NAME ? process.env.RDS_DB_NAME : config.database,
  process.env.RDS_USERNAME ? process.env.RDS_USERNAME : config.username,
  process.env.RDS_PASSWORD ? process.env.RDS_PASSWORD : config.password,
  {
    host: process.env.RDS_HOSTNAME ? process.env.RDS_HOSTNAME : config.host,
    dialect: config.dialect,
    operatorsAliases: 0,
    timeout: 60000,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};
db.DataTypes = Sequelize;
db.sequelize = sequelize;

module.exports = db;
