// require('dotenv').config();
require('module-alias/register');

const app = require('./app');

const port = process.env.PORT || 3333;

const { sequelize } = require('./app/models');

const boot = () => {
  console.clear();
  app.listen(port, () => {
    console.log(`Rodando na porta http://localhost:${port}`);
  });
};

sequelize.authenticate().then(() => {
  console.log('Banco conectado!');
  boot();
}).catch((err) => {
  console.log(`Erro ao conectar banco ${err}`);
});
