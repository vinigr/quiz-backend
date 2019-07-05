const router = require('express').Router();
const verifyHelper = require('./app/helper/verifyJwtToken');
const player = require('./app/controllers/player');
const subject = require('./app/controllers/subject');
const userSubject = require('./app/controllers/userSubject');

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
  .get('/subject/:id/users/', subject.findUsersInSubject);

router
  .get('/user/subjects', [verifyHelper.verifyToken], userSubject.userSubjects);

router
  .get('/teacher/subjects', [verifyHelper.verifyToken, verifyHelper.isTeacher], subject.subjectsTeacher);

module.exports = router;
