require('dotenv').config();
require('module-alias/register');
const Config = require('./src/config');

const app = require('@app/');

const { port } = Config;

const client = require('./src/database');

const boot = () => {
  console.clear();
  app.listen(port, () => {
    console.log(`Rodando na porta http://localhost:${port}`);
  });
};

client.connect().then(() => {
  console.log('Banco conectado!');
  boot();
}).catch((err) => {
  console.log(`Erro ao conectar banco ${err}`);
});
