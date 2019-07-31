const router = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const verifyHelper = require('./app/helper/verifyJwtToken');
const player = require('./app/controllers/player');
const subject = require('./app/controllers/subject');
const userSubject = require('./app/controllers/userSubject');
const question = require('./app/controllers/question');

router
  .post('/signup', player.signUp)
  .get('/confirmation/:token', player.confirmAccount)
  .post('/signin', player.signIn)
  .post('/verify', [verifyHelper.verifyTokenMobile])
  .put('/forgotPassword', player.forgotPassword)
  .get('/resetPassword/:token', player.resetPassword)
  .put('/updatePassword', player.updatePassword);

router
  .post('/subject/create', [verifyHelper.verifyToken, verifyHelper.isTeacher], subject.create)
  .get('/subject/:code', subject.find)
  .post('/subject/registrationUser', [verifyHelper.verifyToken], subject.registrationInSubject)
  .get('/subject/:id/users', [verifyHelper.verifyToken, verifyHelper.isTeacher], subject.findUsersInSubject)
  .delete('/subject/:id', [verifyHelper.verifyToken, verifyHelper.isTeacher], subject.disableSubjects);

router
  .get('/user/subjects', [verifyHelper.verifyToken], userSubject.userSubjects)
  .delete('/subject/subscribe', [verifyHelper.verifyToken], userSubject.unsubscribe);

router
  .get('/teacher/subjects', [verifyHelper.verifyToken, verifyHelper.isTeacher], subject.subjectsTeacher);

router
  .post('/questionMe', [verifyHelper.verifyToken, verifyHelper.isTeacher], multer(multerConfig).single('image'), question.createQuestionME);

module.exports = router;
