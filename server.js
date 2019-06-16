require('dotenv').config();
require('module-alias/register');
const Config = require('./src/config');

const app = require('@app/');

const { port } = Config;

const db = require('./src/models');

const boot = () => {
  console.clear();
  app.listen(port, () => {
    console.log(`Rodando na porta http://localhost:${port}`);
  });
};

db.sequelize.sync({ force: true }).then(() => {
  console.log('Banco conectado!');
  boot();
}).catch((err) => {
  console.log(`Erro ao conectar banco ${err}`);
});
