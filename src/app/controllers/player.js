const nodemailer = require('nodemailer');
const { User, LocalAuth } = require('../models');
const Helper = require('../helper');

const signUp = async (req, res) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAILHOG_HOST,
    port: '1025',
    auth: null,
  });

  const {
    name, email, password, group_user = 1,
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ message: 'Some values are missing' });
  }

  if (!Helper.isValidEmail(email)) {
    return res.status(400).send({ message: 'Please enter a valid email address' });
  }

  const hashPassword = Helper.hashPassword(password);

  try {
    const userLocal = await LocalAuth.create({
      name,
      email,
      password: hashPassword,
    });

    const user = await User.create({
      active: false,
      local_auth: userLocal.id,
      group_user,
    });

    const token = Helper.generateToken(user.id);

    transport.sendMail({
      from: 'Eu mesmo <vinyirun4@hotmail.com>',
      to: `${userLocal.name} <${userLocal.email}>`,
      subject: `Bem vindo ${userLocal.name}`,
      html: '<h1>Funcionou!</h1>',
    });

    return res.status(201).send({ token });
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(400).send({ message: 'User with that EMAIL already exist' });
    }
    return res.status(400).send(error);
  }
};


const SignIn = async (req, res) => {
  const { email, password } = req.body;

  const userLocal = await LocalAuth.findOne({ where: { email } });

  if (!userLocal) {
    return res
      .status(404)
      .send({ message: 'Usuário não encontrado.' });
  }

  const compareSenha = Helper.comparePassword(userLocal.password, password);

  if (!compareSenha) {
    return res
      .status(400)
      .send({ message: 'Credenciais inválidas.' });
  }

  userLocal.password = undefined;

  const user = await User.findOne({ where: { local_auth: userLocal.id } });
  // console.log(user);

  const token = Helper.generateToken(user.id);
  return res.status(201).send({ token });
};

module.exports = {
  signUp,
  SignIn,
};
