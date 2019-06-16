const Sequelize = require('sequelize');
const config = require('@config/');

const sequelize = new Sequelize(config.db.user, config.db.user, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect,
});

module.exports = sequelize;
