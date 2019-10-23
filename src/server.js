// require('dotenv').config();
require('module-alias/register');

const server = require('./app');

const config = require('./config');

const { port } = config.app;

const { sequelize } = require('./app/models');

const boot = () => {
  console.clear();
  server.listen(port, () => {
    console.log(`Rodando na porta http://localhost:${port}`);
  });
};

sequelize
  .authenticate()
  .then(() => {
    console.log('Banco conectado!');
    boot();
  })
  .catch(err => {
    console.log(`Erro ao conectar banco ${err}`);
  });
