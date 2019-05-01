const router = require('express').Router();
const player = require('./controller/player');

router
  .post('/player/signup', player.signUp);

module.exports = router;
