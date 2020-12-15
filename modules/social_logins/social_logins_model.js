const db = require ('../../config/db_config');

const socialLogins = db.sequelize.define('social_logins', {
  id: {
    type: db.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: db.DataTypes.STRING
  },
  tokenType: {
    type: db.DataTypes.STRING
  },
  fb_id: {
    type: db.DataTypes.STRING
  },
  user_id: {
    type: db.DataTypes.INTEGER,
  },
  is_deleted: {
    type: db.DataTypes.BOOLEAN,
    required: true,
    defaultValue: false
  }
}, { underscored: true, timestamp: true, tableName: 'social_logins' });

module.exports = socialLogins;
