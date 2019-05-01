const client = require('../database');
const Helper = require('./helper');

const signUp = async (req, res) => {
  const {
    email, username, senha, curso, semestre = null,
  } = req.body;

  if (!email || !senha || !username || !curso) {
    return res.status(400).send({ message: 'Some values are missing' });
  }

  if (!Helper.isValidEmail(email)) {
    return res.status(400).send({ message: 'Please enter a valid email address' });
  }

  const hashPassword = Helper.hashPassword(senha);

  const createQuery = 'INSERT INTO aluno(nome, username, email, senha, curso, semestre)VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [email, username, hashPassword, curso, semestre];

  const usuario = await client.query(createQuery, values);

  res.json('Concluído');
};

module.exports = {
  signUp,
};
