const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./config/db_config.js");
const app = express();
const path = require('path');

app.use(cors({}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(express.static(path.join(__dirname, 'public', 'uploads')));

require("./routes/routes.js")(app);
app.use('/',require('./routes/facebookroutes'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client', 'build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
});

//DB Models
const users = require("./modules/users/users_model");
const socialLogins = require("./modules/social_logins/social_logins_model");
const interests = require("./modules/interests/interests_model");
const classes = require("./modules/classes/classes_model");
const Lectures = require("./modules/lectures/lectures_model");
const Topics = require("./modules/topics/topics_model");
const UserInterest = require("./modules/usersInerests/user_interest_model");
const Annoucements = require("./modules/annoucements/annoucements_model");
const Assignments = require("./modules/assignments/assignments_model");
const AssignmentSubmission = require("./modules/studentFacultyAssignments/student_faculty_assignment_model");
const assignmentSubmission = require("./modules/studentFacultyAssignments/student_faculty_assignment_model");
const studentsEnrolled = require("./modules/studentsEnrolled/students_enrolled_model");
const courseMaterial = require("./modules/courseMaterial/course_material_model");
const Quiz = require("./modules/quizes/quiz_model");
const quizOption = require("./modules/quizOptions/quiz_options_model.js");
const quizSubmission = require("./modules/quizSubmission/quiz_submission_model");
const comment = require("./modules/comments/comments_model");
const history = require("./modules/history/history_model");

let promiseArray = [];
// // sync db models
promiseArray.push(users.sync());
promiseArray.push(interests.sync());

Promise.all(promiseArray)
  .then(() => {
    socialLogins.belongsTo(users);
    history.belongsTo(users);
    users.hasOne(socialLogins);
    let proc = [];
    proc.push(socialLogins.sync());
    proc.push(classes.sync());

    Promise.all(proc)
      .then(() => {

        history.belongsTo(classes);
        Lectures.belongsTo(classes);
        Annoucements.belongsTo(classes);
        Topics.belongsTo(classes);
        Topics.belongsTo(users);
        Assignments.belongsTo(classes);

        Quiz.belongsTo(classes);
        courseMaterial.belongsTo(classes);
        UserInterest.belongsTo(users);
        UserInterest.belongsTo(interests);
                       
        let promises = [];
        promises.push(history.sync());
        promises.push(Lectures.sync());
        promises.push(Annoucements.sync());
        promises.push(Topics.sync());
        promises.push(Assignments.sync());
        promises.push(Quiz.sync());
        promises.push(courseMaterial.sync());
        promises.push(UserInterest.sync());
        promises.push(studentsEnrolled.sync());

        Promise.all(promises)
          .then(() => {

            classes.belongsToMany(users, { through: 'students_enrolled', foreignKey: "classid" });
            users.belongsToMany(classes, { through: 'students_enrolled', foreignKey: "userid" });

            AssignmentSubmission.belongsTo(users);
            AssignmentSubmission.belongsTo(Assignments);
            Assignments.hasMany(AssignmentSubmission);
            quizOption.belongsTo(Quiz);
            Quiz.hasMany(quizOption);
            quizSubmission.belongsTo(users);
            quizSubmission.belongsTo(Quiz);
            Quiz.hasMany(quizSubmission);
            
            comment.belongsTo(Topics);
            comment.belongsTo(users);
            Topics.hasMany(comment);

            let prom = [];
            prom.push(assignmentSubmission.sync());
            prom.push(quizOption.sync());
            prom.push(quizSubmission.sync());
            prom.push(comment.sync());


            Promise.all(prom)
              .then(() => {
                console.log('Tables synced successfully');
              })
              .catch(err => {
                console.log("Table Sync Error prom: ", err);
              });
          })
          .catch(err => {
            console.log("Table Sync Error Promises: ", err);
          })
      })
      .catch(err => {
        console.log("Table Sync Error Classes: ", err);
      });
  })
  .catch(err => {
    console.log("Table Sync Error: ", err);
  });

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`server runnning on http://localhost:${PORT}`);
});