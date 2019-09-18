const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const crypto = require('crypto');
const { Op } = require('sequelize');
const addMinutes = require('date-fns/add_minutes');
const { User, LocalAuth, DeviceNotification } = require('../models');
const Helper = require('../helper');

const signUp = async (req, res) => {
  const auth = {
    auth: {
      api_key: process.env.API_KEY_MAILGUN,
      domain: process.env.DOMAIN_MAILGUN,
    },
  };

  const nodemailerMailgun = nodemailer.createTransport(mg(auth));

  const {
    name, email, password, groupUser = 1, userNotification,
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ message: 'Some values are missing' });
  }

  if (!Helper.isValidEmail(email)) {
    return res.status(400).send({ message: 'Please enter a valid email address' });
  }

  const groupNum = parseFloat(groupUser);

  if (groupNum !== 1 && groupNum !== 2) {
    return res.status(400).send({ message: 'Grupo de usuário não reconhecido!' });
  }

  const hashPassword = Helper.hashPassword(password);

  try {
    const userExists = await LocalAuth.findOne({ where: { email } });

    if (userExists) return res.status(400).send({ message: 'User with that EMAIL already exist' });

    const userLocal = await LocalAuth.create({
      email,
      password: hashPassword,
    });

    const user = await User.create({
      name,
      active: false,
      local_auth: userLocal.id,
      group_user: groupUser,
    });

    const token = Helper.generateToken(user.id, user.group_user);
    const confirmCode = Helper.generateConfirmationToken(user.id);

    nodemailerMailgun.sendMail({
      from: 'Quest On App <queston@app.com>',
      to: `<${userLocal.email}>`,
      subject: `Bem vindo ${user.name}`,
      text:
        'You are receiving this because you (or someone else) have requested the create a account in we application.\n\n'
        + 'Please click on the following link, or paste this into your browser to complete the process within two days of receiving it:\n\n'
        + `http://queston.netlify.com/confirmation/${confirmCode}\n\n`
        + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    });

    if (userNotification) {
      await DeviceNotification.create({
        deviceUuid: userNotification,
        userId: user.id,
      });
    }

    return res.status(201).send({ token });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const confirmAccount = async (req, res) => {
  const { token } = req.params;

  const userConfirm = Helper.verifyConfirmation(token);

  if (!userConfirm) return res.status(400).send({ message: 'Invalid confirmation code' });

  try {
    const user = await User.findByPk(userConfirm);

    if (!user) return res.status(403).send({ message: 'User not found' });

    if (user.active === true) return res.status(400).send({ message: 'Account has already been confirmed previously' });

    await user.update({
      active: true,
    });

    return res.status(201).json({ message: 'user' });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).send({ message: 'Email não informado!' });

  if (!password) return res.status(400).send({ message: 'Senha não informada!' });

  const userLocal = await LocalAuth.findOne({ where: { email } });

  if (!userLocal) {
    return res.status(404).send({ message: 'Usuário não encontrado.' });
  }

  const compareSenha = Helper.comparePassword(userLocal.password, password);

  if (!compareSenha) {
    return res.status(400).send({ message: 'Invalid credentials' });
  }

  userLocal.password = undefined;

  const user = await User.findOne({ where: { local_auth: userLocal.id } });

  const token = Helper.generateToken(user.id, user.group_user);
  return res.status(201).send({ token });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).send({ message: 'Required email' });
  }

  const transport = nodemailer.createTransport({
    host: process.env.MAILHOG_HOST,
    port: '1025',
    auth: null,
  });

  try {
    const userLocal = await LocalAuth.findOne({ where: { email } });

    if (!userLocal) return res.status(403).send({ message: 'E-mail não está associado a uma conta!' });

    const token = crypto.randomBytes(20).toString('hex');
    await userLocal.update({
      reset_passwordToken: token,
      reset_passwordExpires: addMinutes(new Date(), 10),
    });

    transport.sendMail({
      from: 'Eu mesmo <vinyirun4@hotmail.com>',
      to: `<${userLocal.email}>`,
      subject: 'Link to reset password',
      text:
        'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
        + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
        + `http://localhost:3000/reset-password/${token}\n\n`
        + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    });

    return res.status(201).json({
      message:
        'Aguarde...\n O E-mail de recuperação será enviado em instantes e é válido por 10 minutos.',
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;

  try {
    const userLocal = await LocalAuth.findOne({
      where: {
        reset_passwordToken: token,
        reset_passwordExpires: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!userLocal) {
      return res
        .status(403)
        .send({ message: 'O link de redefinição de senha é inválido ou expirou!' });
    }

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

    return res.status(200).send({ message: 'Senha alterada com sucesso!' });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) return res.status(403).send({ message: 'Dados insuficientes!' });

  if (currentPassword === newPassword) return res.status(403).send({ message: 'Senhas iguais!' });

  try {
    const user = await User.findOne({
      where: { id: req.userId },
      include: {
        model: LocalAuth,
        as: 'l_auth',
      },
    });

    if (!user) return res.status(403).send({ message: 'Usuário inválido!' });

    const comparePassword = Helper.comparePassword(user.l_auth.password, currentPassword);
    if (!comparePassword) return res.status(403).send({ message: 'Senha atual incorreta!' });

    const hashPassword = Helper.hashPassword(newPassword);

    await LocalAuth.update(
      {
        password: hashPassword,
      },
      {
        where: {
          id: user.local_auth,
        },
      },
    );

    return res.status(201).json({ message: 'Senha alterada com sucesso!' });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const getUser = async (req, res) => {
  const { userId } = req;

  try {
    const user = await User.findOne({
      where: { id: userId },
      include: {
        model: LocalAuth,
        as: 'l_auth',
      },
    });

    if (!user) return res.status(403).send({ message: 'User not found' });

    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const logout = async (req, res) => {
  const { userId } = req;
  const { userNotification } = req.body;

  try {
    const device = await DeviceNotification.findOne({
      where: {
        userId,
        deviceUuid: userNotification,
      },
    });

    if (!device) return res.status(403).send({ message: 'Dispositivo não encontrado!' });

    device.destroy();

    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error });
  }
};

module.exports = {
  signUp,
  confirmAccount,
  signIn,
  forgotPassword,
  resetPassword,
  updatePassword,
  changePassword,
  getUser,
  logout,
};
