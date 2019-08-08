const { Quiz, QuestionQuiz } = require('../models');

const createQuiz = async (req, res) => {
  const {
    name, date, selectedQuestionsME, selectedQuestionsTF, subjectId,
  } = req.body;

  const releasedAt = new Date(date).toISOString();

  const questions = [];

  try {
    const quiz = await Quiz.create({
      name,
      subjectId,
      released_at: releasedAt,
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

    const questionQuiz = await QuestionQuiz.bulkCreate(questions, { returning: true });

    return res.status(201).send({ questionQuiz });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const subjectsQuizList = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).send({ message: 'Disciplina não informada!' });

  try {
    const listQuiz = await Quiz.findAll({ where: { subjectId: id } });

    return res.status(201).send(listQuiz);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

module.exports = {
  createQuiz,
  subjectsQuizList,
};
