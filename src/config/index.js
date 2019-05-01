const Config = {
  port: process.env.PORT || 8080,
  db: {
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT_DB,
  },
};

module.exports = Config;
