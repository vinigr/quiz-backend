const { Op, fn, col, literal } = require('sequelize');
const { Subject, User, UserSubject, Quiz, Dispute } = require('../models');
const Helper = require('../helper');

const create = async (req, res) => {
  const { name, topic, accessCode = Helper.accessCodeGererate() } = req.body;
  if (!name || !topic) {
    return res.status(400).send({ message: 'Some values are missing' });
  }

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
  if (!code) {
    return res.status(400).send({ message: 'Some values are missing' });
  }

  try {
    const subjects = await Subject.findAll({
      where: {
        accessCode: {
          [Op.like]: `%${code}%`,
        },
      },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });

    return res.status(201).send({ subjects });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const registrationInSubject = async (req, res) => {
  const { accessCode } = req.body;
  const { userId } = req;

  if (!accessCode || accessCode === '' || !userId) {
    return res.status(400).send({ message: 'Some values are missing' });
  }

  try {
    const subject = await Subject.findOne({
      where: {
        accessCode: accessCode.toUpperCase(),
      },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });

    if (!subject) {
      return res.status(400).send({ message: 'Código inválido' });
    }

    const existsUserSubject = await UserSubject.findOne({
      where: {
        user_id: userId,
        subject_id: subject.id,
      },
    });

    if (existsUserSubject) {
      return res.status(400).send({ message: 'Já registrado!' });
    }

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

  if (!id) {
    return res.status(400).send({ message: 'Some values are missing' });
  }

  try {
    const usersSubject = await UserSubject.findAll({
      where: {
        subject_id: id,
      },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });

    return res.status(201).send({ usersSubject });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const usersInSubject = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({ message: 'Some values are missing' });
  }

  try {
    const subject = await Subject.findOne({
      where: {
        id,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      attributes: [],
    });

    const usersSubject = await UserSubject.findAll({
      where: {
        subject_id: id,
      },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });

    return res.status(201).send({ subject, usersSubject });
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

    if (!subject) {
      return res.status(403).send({ message: 'Disciplina não encontrada!' });
    }

    subject.update({
      active: false,
    });

    return res.status(201).send({ id: subject.id });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const update = async (req, res) => {
  const { name, topic, id } = req.body;
  if (!name || !topic || !id) {
    return res.status(400).send({ message: 'Some values are missing' });
  }

  try {
    await Subject.update(
      {
        name,
        topic,
      },
      {
        where: { id },
      }
    );
    return res.status(201).send();
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

const statistics = async (req, res) => {
  const { id } = req.params;

  try {
    const quizzes = await Quiz.findAll({
      where: {
        subjectId: id,
      },
      attributes: ['id'],
    });

    const quizzesId = quizzes.length !== 0 && quizzes.map(quiz => quiz.id);

    const disputes = await Dispute.findAll({
      where: {
        quizId: {
          [Op.or]: quizzesId,
        },
      },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
      attributes: ['user_id', [fn('sum', col('score')), 'scoreAll']],
      group: ['user_id', 'User.id', 'score'],
    });

    return res.status(201).send(disputes);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

module.exports = {
  create,
  find,
  registrationInSubject,
  findUsersInSubject,
  usersInSubject,
  subjectsTeacher,
  disableSubjects,
  update,
  statistics,
};
