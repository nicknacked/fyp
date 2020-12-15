const db = require ('../../config/db_config');

const assignmentSubmission = db.sequelize.define('assignment_submission', {
  id: {
    type: db.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  assignment_id: {
    type: db.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "assignments",
      key: "id"
    },
    required: true
  },
  file: {
    type: db.DataTypes.STRING,
  },
  obtained_marks: {
    type: db.DataTypes.DOUBLE
  },
  is_deleted: {
    type: db.DataTypes.BOOLEAN,
    required: true,
    defaultValue: false
  }
}, { underscored: true, timestamp: true, tableName: 'assignment_submission' });

module.exports = assignmentSubmission;
