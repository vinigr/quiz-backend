const { User } = require('../models');
const Helper = require('../helper');

const signUp = async (req, res) => {
  const {
    name, email, password, groupUser = 1,
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ message: 'Some values are missing' });
  }

  if (!Helper.isValidEmail(email)) {
    return res.status(400).send({ message: 'Please enter a valid email address' });
  }

  const hashPassword = Helper.hashPassword(password);

  try {
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      groupUser,
      isActive: true,
    });
    console.log(user.id);
    const token = Helper.generateToken(user.id);
    return res.status(201).send({ token });
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(400).send({ message: 'User with that EMAIL already exist' });
    }
    return res.status(400).send(error);
  }
};


const SignIn = async (req, res) => {
  const { email, senha } = req.body;

  const createQuery = 'SELECT * FROM aluno where email = $1';

  const { rows } = await client.query(createQuery, [email]);

  if (!rows) {
    return res
      .status(404)
      .send({ message: 'Usuário não encontrado.' });
  }

  const compareSenha = Helper.comparePassword(rows[0].senha, senha);

  if (!compareSenha) {
    return res
      .status(400)
      .send({ message: 'Credenciais inválidas.' });
  }

  rows[0].senha = undefined;

  const token = Helper.generateToken(rows[0].id);
  return res.status(201).send({ token });
};

module.exports = {
  signUp,
  SignIn,
};
