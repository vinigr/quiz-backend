const router = require('express').Router();
const player = require('./controller/player');

router
  .post('/player/signup', player.signUp)
  .post('/player/signin', player.SignIn);

module.exports = router;
