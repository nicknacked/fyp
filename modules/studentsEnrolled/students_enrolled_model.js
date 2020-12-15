const db = require ('../../config/db_config');

const studentsEnrolled = db.sequelize.define('students_enrolled', {
  userid: {
    type: db.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      },
      required: true
  },
  classid: {
    type: db.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "classes",
      key: "id"
    },
    required: true
  }
}, { timestamp: true, tableName: 'students_enrolled' });

module.exports = studentsEnrolled;
