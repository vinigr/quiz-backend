const router = require('express').Router();
const verifyHelper = require('./app/helper/verifyJwtToken');
const player = require('./app/controllers/player');
const subject = require('./app/controllers/subject');

router
  .post('/player/signup', player.signUp)
  .post('/player/signin', player.signIn)
  .put('/player/forgotPassword', player.forgotPassword)
  .get('/resetPassword/:token', player.resetPassword)
  .put('/player/updatePassword', player.updatePassword)
  .post('/subject/create', [verifyHelper.verifyToken, verifyHelper.isTeacher], subject.create);

module.exports = router;
