import React from 'react';
import $ from 'jquery';
import RequireAuth from './RequireAuth';

window.jQuery = $;
window.$ = $;
global.jQuery = $;


const VerifyIdentity = React.lazy(()=> import('./Demo/Authentication/verify/verfiyIdentity'));
const Dashboard = React.lazy(() => import("./Demo/dashboard/dashboard"));
const FacultyDashboard = React.lazy(() => import("./Demo/dashboard/dashboard"));

//Admin
const AdminDashboard = React.lazy(() => import("./Demo/Admin/history/history"));
const Interest = React.lazy(() => import("./Demo/Admin/interests/interests"));
const Students = React.lazy(() => import("./Demo/Admin/students/students"));
const Teachers = React.lazy(() => import("./Demo/Admin/teachers/teachers"));
const Clustering = React.lazy(() => import("./Demo/Admin/clustering/clustering"));

//Faculty
const Classes = React.lazy(() => import("./Demo/Faculty/Classes/Classes"));
const CreateClass = React.lazy(() => import("./Demo/Faculty/Classes/CreateClass"));
const AddVideoLecture = React.lazy(() => import("./Demo/Faculty/CourseContent/AddVideoLecture"));
const ListVideoLecture = React.lazy(() => import("./Demo/Faculty/CourseContent/ListVideoLectures"));
const AddTopic = React.lazy(() => import("./Demo/Faculty/CourseContent/AddTopic"));
const AddGeneralTopic = React.lazy(() => import("./Demo/Faculty/GeneralTopics/AddTopic"));
const AddAnnoucements = React.lazy(() => import("./Demo/Faculty/Annoucements/AddAnnoucements"));
const ListAnnoucements = React.lazy(() => import("./Demo/Faculty/Annoucements/ListAnnoucement"));
const AddAssignment = React.lazy(() => import("./Demo/Faculty/Assignments/AddAssignments"));
const ListAssignment = React.lazy(() => import("./Demo/Faculty/Assignments/ListAssignments"));
const ListAssignmentSubmission = React.lazy(() => import("./Demo/Faculty/Assignments/SubmissionList"));
const AddCourseMaterial = React.lazy(() => import("./Demo/Faculty/CourseMaterial/AddCourseMaterial"));
const ListCourseMaterial = React.lazy(() => import("./Demo/Faculty/CourseMaterial/ListCourseMaterial"));
const ListGeneralTopics = React.lazy(() => import("./Demo/Faculty/GeneralTopics/ListTopics"));
const ListTopic = React.lazy(() => import("./Demo/Faculty/CourseContent/ListTopic"));
const AddQuiz = React.lazy(() => import("./Demo/Faculty/Quizes/AddQuiz"));
const ListQuiz = React.lazy(() => import("./Demo/Faculty/Quizes/ListQuiz"));
const QuizSubmissionList = React.lazy(() => import("./Demo/Faculty/Quizes/SubmissionList"));
const StudentsEnrolled = React.lazy(() => import("./Demo/Faculty/CourseContent/ListStudentsEnrolled"));
const StudentsHistory = React.lazy(() => import("./Demo/Faculty/History/studentHistory"));
const StudentProgress = React.lazy(() => import("./Demo/Faculty/Progress/StudentProgress"));
const ClassClustering = React.lazy(() => import("./Demo/Faculty/Clustering/Clustering"));

//Users
const UeserInterests = React.lazy(() => import("./Demo/Users/Interests/Interests"));
const UserClasses = React.lazy(() => import("./Demo/Users/Classes/ListClasses"));
const EnrolledClassList = React.lazy(() => import("./Demo/Users/Classes/ListJoinedClasses"));
const UserLectures = React.lazy(() => import("./Demo/Users/Classes/ListLectures"));
const UserAnnoucements = React.lazy(() => import("./Demo/Users/Classes/ListAnnoucements"));
const UserAssignments = React.lazy(() => import("./Demo/Users/Classes/ListAssignments"));
const UserCourseMaterial = React.lazy(() => import("./Demo/Users/Classes/ListCourseMaterial"));
const UserPrivateTopics = React.lazy(() => import("./Demo/Users/Classes/ListTopics"));
const UserGeneralTopics = React.lazy(() => import("./Demo/Users/GeneralTopics/ListGeneralTopics"));
const UserQuizes = React.lazy(() => import("./Demo/Users/Classes/ListQuiz"));
const UserPrivateDiscussion = React.lazy(() => import("./Demo/Users/Classes/DiscusionForum"));
const UserGeneralDiscussion = React.lazy(() => import("./Demo/Users/GeneralTopics/DiscussionForm"));
const UserQuiz = React.lazy(() => import("./Demo/Users/Classes/Quiz"));

const routes = [
    { path: '/verify/identity', exact: true, user: true, faculty: true, component: RequireAuth(VerifyIdentity) },
    { path: '/home', exact: true, user: false, faculty: true, component: RequireAuth(FacultyDashboard) },
    { path: '/admin/dashboard', exact: true, admin: true, component: RequireAuth(AdminDashboard) },
    { path: '/admin/dashboard/clustering', exact: true, admin: true, component: RequireAuth(Clustering) },
    { path: '/admin/interest', exact: true, admin: true, component: RequireAuth(Interest) },
    { path: '/admin/student/list', exact: true, admin: true, component: RequireAuth(Students) },
    { path: '/admin/teacher/list', exact: true, admin: true, component: RequireAuth(Teachers) },
    { path: '/faculty/class/list', exact: true, faculty: true, component: RequireAuth(Classes) },
    { path: '/faculty/class/create', exact: true, faculty: true, component: RequireAuth(CreateClass) },
    { path: '/faculty/class/:id/clustering', exact: true, faculty: true, component: RequireAuth(ClassClustering) },
    { path: '/faculty/class/:id/course/create', exact: true, faculty: true, component: RequireAuth(AddVideoLecture) },
    { path: '/faculty/class/:id/course/list', exact: true, faculty: true, component: RequireAuth(ListVideoLecture) },
    { path: '/faculty/class/:id/topic/create', exact: true, faculty: true, component: RequireAuth(AddTopic) },
    { path: '/faculty/topic/general/create', exact: true, faculty: true, component: RequireAuth(AddGeneralTopic) },
    { path: '/faculty/class/:id/annoucement/create', exact: true, faculty: true, component: RequireAuth(AddAnnoucements) },
    { path: '/faculty/class/:id/annoucement/list', exact: true, faculty: true, component: RequireAuth(ListAnnoucements) },
    { path: '/faculty/class/:id/assignment/create', exact: true, faculty: true, component: RequireAuth(AddAssignment) },
    { path: '/faculty/class/:id/assignment/list', exact: true, faculty: true, component: RequireAuth(ListAssignment) },
    { path: '/faculty/class/:id/assignment/:assign_id/submissions', exact: true, faculty: true, component: RequireAuth(ListAssignmentSubmission) },
    { path: '/faculty/class/:id/course/material/create', exact: true, faculty: true, component: RequireAuth(AddCourseMaterial) },
    { path: '/faculty/class/:id/course/material/list', exact: true, faculty: true, component: RequireAuth(ListCourseMaterial) },
    { path: '/faculty/topic/general/list', exact: true, faculty: true, component: RequireAuth(ListGeneralTopics) },
    { path: '/faculty/class/:id/topic/list', exact: true, faculty: true, component: RequireAuth(ListTopic) },
    { path: '/faculty/class/:id/quiz/create', exact: true, faculty: true, component: RequireAuth(AddQuiz) },
    { path: '/faculty/class/:id/quiz/list', exact: true, faculty: true, component: RequireAuth(ListQuiz) },
    { path: '/faculty/class/:id/quiz/:assign_id/submissions', exact: true, faculty: true, component: RequireAuth(QuizSubmissionList) },
    { path: '/faculty/class/:id/students/list', exact: true, faculty: true, component: RequireAuth(StudentsEnrolled) },
    { path: '/faculty/class/:class_id/topic/:id/discussion', exact: true, faculty: true, component: RequireAuth(UserPrivateDiscussion) },
    { path: '/faculty/general/topic/:id/discussion', exact: true, faculty: true, component: RequireAuth(UserGeneralDiscussion) },
    { path: '/faculty/class/:id/user/:user_id/history', exact: true, faculty: true, component: RequireAuth(StudentsHistory) },
    { path: '/faculty/class/:id/user/:user_id/progress', exact: true, faculty: true, component: RequireAuth(StudentProgress) },
    
    //users routes
    { path: '/dashboard', exact: true, user: true, faculty: false, component: RequireAuth(Dashboard) },
    { path: '/interests', exact: true, user: true, component: RequireAuth(UeserInterests) },
    { path: '/class/list', exact: true, user: true, component: RequireAuth(UserClasses) },
    { path: '/enrolled/class/list', exact: true, user: true, component: RequireAuth(EnrolledClassList) },
    { path: '/user/class/:id/lectures/list', exact: true, user: true, component: RequireAuth(UserLectures) },
    { path: '/user/class/:id/annoucements/list', exact: true, user: true, component: RequireAuth(UserAnnoucements) },
    { path: '/user/class/:id/assignments/list', exact: true, user: true, component: RequireAuth(UserAssignments) },
    { path: '/user/class/:id/course/material/list', exact: true, user: true, component: RequireAuth(UserCourseMaterial) },
    { path: '/user/class/:id/topics/list', exact: true, user: true, component: RequireAuth(UserPrivateTopics) },
    { path: '/user/general/topics/list', exact: true, user: true, component: RequireAuth(UserGeneralTopics) },
    { path: '/user/class/:id/quiz/list', exact: true, user: true, component: RequireAuth(UserQuizes) },
    { path: '/user/class/:class_id/topic/:id/discussion', exact: true, user: true, component: RequireAuth(UserPrivateDiscussion) },
    { path: '/user/general/topic/:id/discussion', exact: true, user: true, component: RequireAuth(UserGeneralDiscussion) },
    { path: '/user/class/:class_id/quiz/:id/submission', exact: true, user: true, component: RequireAuth(UserQuiz) },
];

export default routes;