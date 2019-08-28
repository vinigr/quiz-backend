const { Op, fn, col } = require('sequelize');
const differenceInHours = require('date-fns/difference_in_hours');
const {
  Quiz,
  QuestionQuiz,
  TfQuestion,
  MeQuestion,
  UserSubject,
  Subject,
  Dispute,
  UserQuestion,
} = require('../models');

const createQuiz = async (req, res) => {
  const {
    name,
    releasedDate,
    expirationDate,
    selectedQuestionsME,
    selectedQuestionsTF,
    feedbackAnswer,
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
      feedbackAnswer,
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

const allQuizTeacher = async (req, res) => {
  const { userId } = req;

  try {
    const subjects = await Subject.findAll({
      where: {
        userId,
      },
    });

    const subjectsRegistered = subjects.map(subject => subject.id);

    const listQuiz = await Quiz.findAll({
      where: {
        subjectId: {
          [Op.or]: subjectsRegistered,
        },
      },
      include: [{
        model: Subject, as: 'subject',
      }],
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


const findQuizzes = async (req, res) => {
  const { userId } = req;

  try {
    const subjects = await UserSubject.findAll({
      where: {
        user_id: userId,
      },
    });

    if (!subjects || subjects.length === 0) return res.status(400).send({ message: 'Nenhum quiz disponível' });

    const disputes = await Dispute.findAll({
      where: {
        userId,
      },
    });

    const subjectsRegistered = subjects.length !== 0 ? subjects.map(subject => subject.subject_id) : [];
    const disputesRegistered = disputes.length !== 0 ? disputes.map(dispute => dispute.quizId) : [];

    const listQuiz = await Quiz.findAll({
      where: {
        id: {
          [Op.notIn]: disputesRegistered,
        },
        subjectId: {
          [Op.or]: subjectsRegistered,
        },
      },
      include: [{
        model: Subject, as: 'subject',
      }],
    });

    const listNext = listQuiz.filter(item => differenceInHours(item.expirationAt, new Date()) > 0
      && differenceInHours(item.expirationAt, new Date()) <= 168);

    const listOthers = listQuiz.filter(item => differenceInHours(item.expirationAt, new Date()) > 168
    || !item.expirationAt);

    return res.status(200).send({ listNext, listOthers });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const startQuiz = async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).send({ message: 'Quiz não informado!' });

  try {
    const existsDispute = await Dispute.findOne({
      where: {
        userId: req.userId,
        quizId: id,
      },
    });

    if (existsDispute) return res.status(400).send({ message: 'Este quiz já foi disputado!' });

    const listQuiz = await QuestionQuiz.findAll({
      where: { quiz_id: id },
      attributes: { include: ['id'] },
      include: [{
        model: TfQuestion, as: 'tfQuestion',
      }, {
        model: MeQuestion, as: 'meQuestion',
      }],
    });

    const dispute = await Dispute.create({
      quizId: id,
      userId: req.userId,
      status: 'started',
      score: 0,
    });

    return res.status(201).send({ listQuiz, dispute });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const answerQuestion = async (req, res) => {
  const { disputeId, questionId, answer } = req.body;

  if (!disputeId) return res.status(400).send({ message: 'Quiz não informado!' });

  if (!questionId) return res.status(400).send({ message: 'Questão não informada!' });

  if (answer === null || answer === undefined) return res.status(400).send({ message: 'Resposta não informada!' });

  try {
    const userQuestion = await UserQuestion.findOne({
      where: {
        questionId,
        userId: req.userId,
      },
    });

    if (userQuestion) {
      return res.status(400)
        .send({ message: 'Questão já respondida!' });
    }

    const question = await QuestionQuiz.findOne({
      where: { id: questionId },
      include: [{
        model: TfQuestion, as: 'tfQuestion',
      }, {
        model: MeQuestion, as: 'meQuestion',
      }],
    });

    const answerCurrent = question.meQuestion
      ? question.meQuestion.answer : question.tfQuestion.answer;

    if (answer === 'skip') {
      await UserQuestion.create({
        questionId,
        userId: req.userId,
        selectedAnswer: 'skip',
        result: 'skip',
      });

      return res.status(201).send({ answer: answerCurrent });
    }

    let result;
    if (question.tfQuestion) {
      question.tfQuestion.answer === answer ? result = 'hit' : result = 'error';
    }

    if (question.meQuestion) {
      question.meQuestion.answer === answer ? result = 'hit' : result = 'error';
    }

    if (result === 'hit') {
      await Dispute.increment({
        score: 1,
      }, {
        where: { id: disputeId },
      });
    }

    if (result === 'error') {
      await Dispute.decrement({
        score: 1,
      }, {
        where: { id: disputeId },
      });
    }

    await UserQuestion.create({
      questionId,
      userId: req.userId,
      selectedAnswer: answer,
      result,
    });

    return res.status(201).send({ answer: answerCurrent });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const quizStatus = async (req, res) => {
  const { quizId } = req.params;

  if (!quizId) return res.status(400).send({ message: 'Quiz não informado!' });

  try {
    const disputes = await Dispute.count({
      where: {
        quizId,
      },
    });

    const questions = await QuestionQuiz.findAll({
      where: {
        quiz_id: quizId,
      },
      attributes: { include: ['id'] },
      include: [{
        model: TfQuestion, as: 'tfQuestion',
      }, {
        model: MeQuestion, as: 'meQuestion',
      }],
    });

    const questionsId = questions.map(question => question.id);

    const questionsAnswered = await UserQuestion.findAll({
      attributes: ['question_id', [fn('COUNT', col('question_id')), 'total'], 'result', 'selectedAnswer'],
      group: ['question_id', 'result', 'selectedAnswer'],
      where: {
        questionId: {
          [Op.or]: questionsId,
        },
      },
    });

    return res.status(201).send({
      disputes, questions, questionsAnswered,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error });
  }
};

module.exports = {
  createQuiz,
  subjectsQuizList,
  allQuizTeacher,
  questionsInQuiz,
  findQuizzes,
  startQuiz,
  answerQuestion,
  quizStatus,
};
