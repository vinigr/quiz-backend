const {
  Quiz, QuestionQuiz, TfQuestion, MeQuestion,
} = require('../models');

const createQuiz = async (req, res) => {
  const {
    name,
    releasedDate,
    expirationDate,
    selectedQuestionsME,
    selectedQuestionsTF,
    subjectId,
  } = req.body;

  let expirationAt = null;

  if (!new Date(releasedDate).toISOString()) return res.status(400).send({ message: 'Data inválida!' });

  const releasedAt = new Date(releasedDate).toISOString();

  if (expirationDate && new Date(expirationDate).toISOString()) {
    expirationAt = new Date(expirationDate).toISOString();
  }

  const questions = [];

  try {
    const quiz = await Quiz.create({
      name,
      subjectId,
      releasedAt,
      expirationAt,
      blocked: false,
    });

    selectedQuestionsME.map(question => questions.push({
      quiz_id: quiz.id,
      meQuestionId: question,
      tfQuestionId: null,
    }));

    selectedQuestionsTF.map(question => questions.push({
      quiz_id: quiz.id,
      meQuestionId: null,
      tfQuestionId: question,
    }));

    await QuestionQuiz.bulkCreate(questions);

    return res.status(201).send(quiz);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error });
  }
};

const subjectsQuizList = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).send({ message: 'Disciplina não informada!' });

  try {
    const listQuiz = await Quiz.findAll({
      where: { subjectId: id },
    });

    const available = listQuiz.filter(item => item.expirationAt > new Date() || !item.expirationAt);
    const notAvailable = listQuiz.filter(item => item.expirationAt < new Date() && item.expirationAt);

    return res.status(201).send({ available, notAvailable });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const questionsInQuiz = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).send({ message: 'Quiz não informado!' });

  try {
    const listQuiz = await QuestionQuiz.findAll({
      where: { quiz_id: id },
      attributes: { include: ['id'] },
      include: [{
        model: TfQuestion, as: 'tfQuestion',
      }, {
        model: MeQuestion, as: 'meQuestion',
      }],
    });

    return res.status(201).send(listQuiz);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

module.exports = {
  createQuiz,
  subjectsQuizList,
  questionsInQuiz,
};
