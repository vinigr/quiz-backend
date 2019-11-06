const { Op, fn, col } = require('sequelize');
const {
  Subject,
  User,
  UserSubject,
  Quiz,
  Dispute,
  QuestionQuiz,
  UserQuestion,
} = require('../models');

const statistics = async (req, res) => {
  const { userId } = req;

  try {
    const subjects = await Subject.findAll({
      where: {
        userId,
      },
      attributes: ['id'],
    });

    const subjectsId =
      subjects.length !== 0 && subjects.map(subject => subject.id);

    const quizzes = await Quiz.findAll({
      where: {
        subjectId: {
          [Op.or]: subjectsId,
        },
      },
      attributes: ['id'],
    });

    const quizzesId = quizzes.length !== 0 && quizzes.map(quiz => quiz.id);

    const tops = await Dispute.findAll({
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
      group: ['user_id', 'User.id'],
      order: [[fn('sum', col('score')), 'DESC']],
      limit: 5,
    });

    res.status(201).send({ tops, usersRegistered });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

module.exports = {
  statistics,
};
