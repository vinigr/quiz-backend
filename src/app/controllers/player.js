const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Op } = require('sequelize');
const addMinutes = require('date-fns/add_minutes');
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


const signIn = async (req, res) => {
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
      .send({ message: 'Invalid credentials' });
  }

  userLocal.password = undefined;

  const user = await User.findOne({ where: { local_auth: userLocal.id } });

  const token = Helper.generateToken(user.id);
  return res.status(201).send({ token });
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400)
      .send({ message: 'Required email' });
  }

  const transport = nodemailer.createTransport({
    host: process.env.MAILHOG_HOST,
    port: '1025',
    auth: null,
  });

  try {
    const userLocal = await LocalAuth.findOne({ where: { email } });
    const token = crypto.randomBytes(20).toString('hex');
    await userLocal.update({
      reset_passwordToken: token,
      reset_passwordExpires: addMinutes(new Date(), 10),
    });

    transport.sendMail({
      from: 'Eu mesmo <vinyirun4@hotmail.com>',
      to: `${userLocal.name} <${userLocal.email}>`,
      subject: 'Link to reset password',
      text:
        'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
        + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
        + `http://localhost:3000/resetPassword/${token}\n\n`
        + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    });

    return res.status(201).json(userLocal);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  // const { Op } = Sequelize;
  try {
    const userLocal = await LocalAuth.findOne({
      where: {
        reset_passwordToken: token,
        reset_passwordExpires: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!userLocal) return res.status(403).send({ message: 'Password reset link is invalid or has expired' });

    return res.status(201).json({ id: userLocal.id });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const updatePassword = async (req, res) => {
  const { id, password } = req.body;

  try {
    const userLocal = await LocalAuth.findOne({
      where: { id },
    });

    if (!userLocal) return res.status(403).send({ message: 'User not found' });

    const hashPassword = Helper.hashPassword(password);

    await userLocal.update({
      password: hashPassword,
    });

    return res.status(200).send(userLocal);
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  updatePassword,
};