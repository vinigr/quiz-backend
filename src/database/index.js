const { Client } = require('pg');
const config = require('@config/');

console.log(config.db);
const client = new Client({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
});

// client.query('SELECT NOW()', (err, res) => {
// console.log(err, res)
// client.end()
// })

module.exports = client;
