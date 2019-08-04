const { Op } = require('sequelize');
const { Subject, User, UserSubject } = require('../models');
const Helper = require('../helper');

const create = async (req, res) => {
  const { name, topic, accessCode = Helper.accessCodeGererate() } = req.body;
  if (!name || !topic) return res.status(400).send({ message: 'Some values are missing' });

  try {
    const subject = await Subject.create({
      name,
      topic,
      accessCode,
      userId: req.userId,
      active: true,
    });

    return res.status(201).send({ subject });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const find = async (req, res) => {
  const { code } = req.params;
  if (!code) return res.status(400).send({ message: 'Some values are missing' });

  try {
    const subjects = await Subject.findAll({
      where: {
        accessCode: {
          [Op.like]: `%${code}%`,
        },
      },
      include: [{
        model: User, as: 'user',
      }],
    });

    return res.status(201).send({ subjects });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const registrationInSubject = async (req, res) => {
  const { accessCode } = req.body;
  const { userId } = req;

  if (!accessCode || accessCode === '' || !userId) return res.status(400).send({ message: 'Some values are missing' });

  try {
    const subject = await Subject.findOne({
      where: {
        accessCode,
      },
    });

    if (!subject) return res.status(400).send({ message: 'Código inválido' });

    const existsUserSubject = await UserSubject.findOne({
      where: {
        user_id: userId,
        subject_id: subject.id,
      },
    });

    if (existsUserSubject) res.status(400).send({ message: 'Já registrado!' });

    await UserSubject.create({
      user_id: userId,
      subject_id: subject.id,
      active: true,
    });

    return res.status(201).send({ subject });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const findUsersInSubject = async (req, res) => {
  const { id } = req.params;
  // const { userId } = req;

  if (!id) return res.status(400).send({ message: 'Some values are missing' });

  try {
    const usersSubject = await UserSubject.findAll({
      where: {
        subject_id: id,
      },
      include: [{
        model: User, as: 'user',
      }],
    });

    return res.status(201).send({ usersSubject });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const subjectsTeacher = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      where: {
        user_id: req.userId,
        active: true,
      },
    });

    return res.status(201).send({ subjects });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const disableSubjects = async (req, res) => {
  const { id } = req.params;

  try {
    const subject = await Subject.findOne({
      where: {
        id,
        user_id: req.userId,
        active: true,
      },
    });

    if (!subject) return res.status(403).send({ message: 'Disciplina não encontrada!' });

    subject.update({
      active: false,
    });

    return res.status(201).send({ id: subject.id });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

module.exports = {
  create,
  find,
  registrationInSubject,
  findUsersInSubject,
  subjectsTeacher,
  disableSubjects,
};
