require('dotenv').config();

module.exports = {
  app: {
    secret: process.env.SECRET,
    port: process.env.PORT || 3333,
  },
};
