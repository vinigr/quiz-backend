const router = require('express').Router();
const player = require('./app/controllers/player');

router
  .post('/player/signup', player.signUp)
  .post('/player/signin', player.signIn)
  .put('/player/forgotPassword', player.forgotPassword)
  .get('/resetPassword/:token', player.resetPassword)
  .put('/player/updatePassword', player.updatePassword);

module.exports = router;
