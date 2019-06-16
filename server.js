require('dotenv').config();
require('module-alias/register');
const Config = require('./src/config');
const { GroupUser } = require('./src/models');

const app = require('@app/');

const { port } = Config;

const db = require('./src/models');

const boot = () => {
  console.clear();
  app.listen(port, () => {
    console.log(`Rodando na porta http://localhost:${port}`);
  });
};

db.sequelize.sync({ force: false }).then(() => {
  console.log('Banco conectado!');
  boot();
}).catch((err) => {
  console.log(`Erro ao conectar banco ${err}`);
});

const initial = () => {
  GroupUser.create({
    id: 1,
    name: 'USER',
  });

  GroupUser.create({
    id: 2,
    name: 'TEACHER',
  });

  GroupUser.create({
    id: 3,
    name: 'ADMIN',
  });
};
