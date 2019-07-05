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
  const { subjectId } = req.body;
  const { userId } = req;

  if (!subjectId || !userId) return res.status(400).send({ message: 'Some values are missing' });

  try {
    const existsUserSubject = await UserSubject.findOne({
      where: {
        user_id: userId,
        subject_id: subjectId,
      },
    });

    if (existsUserSubject) res.status(400).send({ message: 'Already registered' });

    const userSubject = await UserSubject.create({
      user_id: userId,
      subject_id: subjectId,
    });

    return res.status(201).send({ userSubject });
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
      },
    });


    return res.status(201).send({ subjects });
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = {
  create,
  find,
  registrationInSubject,
  findUsersInSubject,
  subjectsTeacher,
};
