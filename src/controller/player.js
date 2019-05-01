const client = require('../database');
const Helper = require('../helper');

const signUp = async (req, res) => {
  const {
    nome, email, username, senha, curso, semestre = null,
  } = req.body;

  if (!nome || !email || !senha || !username || !curso) {
    return res.status(400).send({ message: 'Some values are missing' });
  }

  if (!Helper.isValidEmail(email)) {
    return res.status(400).send({ message: 'Please enter a valid email address' });
  }

  const hashPassword = Helper.hashPassword(senha);

  const createQuery = 'INSERT INTO aluno(nome, username, email, senha, curso, semestre)VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [nome, username, email, hashPassword, curso, semestre];

  try {
    const { rows } = await client.query(createQuery, values);
    const token = Helper.generateToken(rows[0].id);
    return res.status(201).send({ token });
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(400).send({ message: 'User with that EMAIL already exist' });
    }
    return res.status(400).send(error);
  }
};

module.exports = {
  signUp,
};
