const { Op, fn, col } = require('sequelize');
const OneSignal = require('onesignal-node');
const differenceInHours = require('date-fns/difference_in_hours');
const {
  User,
  Quiz,
  QuestionQuiz,
  TfQuestion,
  MeQuestion,
  UserSubject,
  Subject,
  Dispute,
  UserQuestion,
  DeviceNotification,
  UnloggedUser,
} = require('../models');

const Helper = require('../helper');
const generateColor = require('../helper/generatorColor');

const createQuiz = async (req, res) => {
  const {
    name,
    releasedDate,
    expirationDate,
    selectedQuestionsME,
    selectedQuestionsTF,
    feedbackAnswer,
    subjectId,
    hasCode,
  } = req.body;

  let expirationAt = null;

  if (!new Date(releasedDate).toISOString())
    return res.status(400).send({
      message: 'Data inválida!',
    });

  const releasedAt = new Date(releasedDate).toISOString();

  if (expirationDate && new Date(expirationDate).toISOString()) {
    expirationAt = new Date(expirationDate).toISOString();
  }

  let accessCode = null;

  if (hasCode) {
    accessCode = Helper.accessCodeGererate();
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
      accessCode,
    });

    selectedQuestionsME.map(question =>
      questions.push({
        quiz_id: quiz.id,
        meQuestionId: question,
        tfQuestionId: null,
      })
    );

    selectedQuestionsTF.map(question =>
      questions.push({
        quiz_id: quiz.id,
        meQuestionId: null,
        tfQuestionId: question,
      })
    );

    await QuestionQuiz.bulkCreate(questions);

    const usersRegistered = await UserSubject.findAll({
      where: {
        subject_id: subjectId,
      },
      attributes: ['user_id'],
    });

    const users = usersRegistered.map(user => user.user_id);

    if (usersRegistered.length > 0) {
      const devices = await DeviceNotification.findAll({
        where: {
          userId: {
            [Op.or]: users,
          },
        },
        attributes: ['deviceUuid'],
      });

      const playerIncludeNotification = devices.map(
        device => device.deviceUuid
      );

      const subject = await Subject.findOne({
        where: {
          id: subjectId,
        },
        attributes: ['name'],
      });

      const myClient = new OneSignal.Client({
        userAuthKey: process.env.ONESIGNAL_USER_AUTH_KEY,
        app: {
          appAuthKey: process.env.ONESIGNAL_APP_AUTH_KEY,
          appId: '861ffbdb-a413-413d-a0e9-dc4ff86072f9',
        },
      });

      const notification = new OneSignal.Notification({
        headings: {
          en: `${subject.name}`,
          pt: `${subject.name}`,
        },
        contents: {
          en: `New quiz: ${quiz.name}`,
          pt: `Novo quiz: ${quiz.name}`,
        },
        include_player_ids: playerIncludeNotification,
        send_after: releasedAt > new Date().toISOString() ? releasedAt : null,
      });

      myClient.sendNotification(notification);
    }

    return res.status(201).send(quiz);
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

const subjectsQuizList = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).send({
      message: 'Disciplina não informada!',
    });

  try {
    const listQuiz = await Quiz.findAll({
      where: {
        subjectId: id,
        releasedAt: {
          [Op.lte]: new Date(),
        },
        blocked: false,
      },
    });

    let disputes;
    if (listQuiz.length > 0) {
      const quizIds = listQuiz.map(quiz => quiz.id);

      const disputesList = await Dispute.findAll({
        where: {
          quizId: {
            [Op.or]: quizIds,
          },
          userId: req.userId,
        },
        attributes: ['quizId'],
      });

      disputes = disputesList.map(dispute => dispute.quizId);
    }

    const available = listQuiz.filter(
      item => item.expirationAt > new Date() || !item.expirationAt
    );
    const notAvailable = listQuiz.filter(
      item => item.expirationAt < new Date() && item.expirationAt
    );

    return res.status(201).send({
      available,
      notAvailable,
      disputes,
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

const allQuizSubjectTeacher = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).send({
      message: 'Disciplina não informada!',
    });

  try {
    const listQuiz = await Quiz.findAll({
      where: {
        subjectId: id,
      },
    });

    const available = listQuiz.filter(
      item => item.expirationAt > new Date() || !item.expirationAt
    );
    const notAvailable = listQuiz.filter(
      item => item.expirationAt < new Date() && item.expirationAt
    );

    return res.status(201).send({
      available,
      notAvailable,
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
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
      include: [
        {
          model: Subject,
          as: 'subject',
        },
      ],
    });

    const available = listQuiz.filter(
      item => item.expirationAt > new Date() || !item.expirationAt
    );
    const notAvailable = listQuiz.filter(
      item => item.expirationAt < new Date() && item.expirationAt
    );

    return res.status(201).send({
      available,
      notAvailable,
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

const questionsInQuiz = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).send({
      message: 'Quiz não informado!',
    });

  try {
    const listQuiz = await QuestionQuiz.findAll({
      where: {
        quiz_id: id,
      },
      attributes: {
        include: ['id'],
      },
      include: [
        {
          model: TfQuestion,
          as: 'tfQuestion',
        },
        {
          model: MeQuestion,
          as: 'meQuestion',
        },
      ],
    });

    return res.status(201).send(listQuiz);
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
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

    if (!subjects || subjects.length === 0)
      return res.status(400).send({
        message: 'Nenhum quiz disponível',
      });

    const disputes = await Dispute.findAll({
      where: {
        userId,
      },
    });

    const subjectsRegistered =
      subjects.length !== 0 ? subjects.map(subject => subject.subject_id) : [];
    const disputesRegistered =
      disputes.length !== 0 ? disputes.map(dispute => dispute.quizId) : [];

    const listQuiz = await Quiz.findAll({
      where: {
        id: {
          [Op.notIn]: disputesRegistered,
        },
        subjectId: {
          [Op.or]: subjectsRegistered,
        },
        releasedAt: {
          [Op.lte]: new Date(),
        },
        blocked: false,
      },
      include: [
        {
          model: Subject,
          as: 'subject',
        },
      ],
    });

    const listNext = listQuiz.filter(
      item =>
        differenceInHours(item.expirationAt, new Date()) > 0 &&
        differenceInHours(item.expirationAt, new Date()) <= 168
    );

    const listOthers = listQuiz.filter(
      item =>
        differenceInHours(item.expirationAt, new Date()) > 168 ||
        !item.expirationAt
    );

    return res.status(200).send({
      listNext,
      listOthers,
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

const startQuiz = async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res.status(400).send({
      message: 'Quiz não informado!',
    });

  try {
    const existsDispute = await Dispute.findOne({
      where: {
        userId: req.userId,
        quizId: id,
      },
    });

    if (existsDispute)
      return res.status(400).send({
        message: 'Este quiz já foi disputado!',
      });

    const listQuiz = await QuestionQuiz.findAll({
      where: {
        quiz_id: id,
      },
      attributes: {
        include: ['id'],
      },
      include: [
        {
          model: TfQuestion,
          as: 'tfQuestion',
        },
        {
          model: MeQuestion,
          as: 'meQuestion',
        },
      ],
    });

    const color = generateColor();

    const disputeCreated = await Dispute.create({
      quizId: id,
      userId: req.userId,
      status: 'started',
      score: 0,
      color,
    });

    const dispute = await Dispute.findOne({
      where: {
        id: disputeCreated.id,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
      ],
      attributes: ['id', 'score', 'quizId', 'color'],
    });

    req.io.emit(`quiz${id}`, dispute);

    return res.status(201).send({
      listQuiz,
      dispute,
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

const answerQuestion = async (req, res) => {
  const { disputeId, questionId, answer } = req.body;

  if (!disputeId)
    return res.status(400).send({
      message: 'Quiz não informado!',
    });

  if (!questionId)
    return res.status(400).send({
      message: 'Questão não informada!',
    });

  if (answer === null || answer === undefined)
    return res.status(400).send({
      message: 'Resposta não informada!',
    });

  try {
    const userQuestion = await UserQuestion.findOne({
      where: {
        questionId,
        userId: req.userId,
      },
    });

    if (userQuestion) {
      return res.status(400).send({
        message: 'Questão já respondida!',
      });
    }

    const question = await QuestionQuiz.findOne({
      where: {
        id: questionId,
      },
      include: [
        {
          model: TfQuestion,
          as: 'tfQuestion',
        },
        {
          model: MeQuestion,
          as: 'meQuestion',
        },
      ],
    });

    const answerCurrent = question.meQuestion
      ? question.meQuestion.answer
      : question.tfQuestion.answer;

    if (answer === 'skip') {
      await UserQuestion.create({
        questionId,
        userId: req.userId,
        selectedAnswer: 'skip',
        result: 'skip',
      });

      return res.status(201).send({
        answer: answerCurrent,
      });
    }

    let result;
    if (question.tfQuestion) {
      question.tfQuestion.answer === answer
        ? (result = 'hit')
        : (result = 'error');
    }

    if (question.meQuestion) {
      question.meQuestion.answer === answer
        ? (result = 'hit')
        : (result = 'error');
    }

    if (result === 'hit') {
      await Dispute.increment(
        {
          score: 1,
        },
        {
          where: {
            id: disputeId,
          },
        }
      );
    }

    if (result === 'error') {
      await Dispute.decrement(
        {
          score: 1,
        },
        {
          where: {
            id: disputeId,
            score: {
              [Op.gt]: 0,
            },
          },
        }
      );
    }

    const dispute = await Dispute.findOne({
      where: {
        id: disputeId,
      },
      attributes: ['id', 'score', 'quizId'],
    });

    req.io.emit(`quiz${dispute.quizId}`, dispute);

    await UserQuestion.create({
      questionId,
      userId: req.userId,
      selectedAnswer: answer,
      result,
    });

    return res.status(201).send({
      answer: answerCurrent,
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

const answerQuestionUnloggedUser = async (req, res) => {
  const { disputeId, questionId, answer, userId } = req.body;

  if (!disputeId)
    return res.status(400).send({
      message: 'Quiz não informado!',
    });

  if (!questionId)
    return res.status(400).send({
      message: 'Questão não informada!',
    });

  if (answer === null || answer === undefined)
    return res.status(400).send({
      message: 'Resposta não informada!',
    });

  try {
    const userQuestion = await UserQuestion.findOne({
      where: {
        questionId,
        unloggedUserId: userId,
      },
    });

    if (userQuestion) {
      return res.status(400).send({
        message: 'Questão já respondida!',
      });
    }

    const question = await QuestionQuiz.findOne({
      where: {
        id: questionId,
      },
      include: [
        {
          model: TfQuestion,
          as: 'tfQuestion',
        },
        {
          model: MeQuestion,
          as: 'meQuestion',
        },
      ],
    });

    const answerCurrent = question.meQuestion
      ? question.meQuestion.answer
      : question.tfQuestion.answer;

    if (answer === 'skip') {
      await UserQuestion.create({
        questionId,
        unloggedUserId: userId,
        selectedAnswer: 'skip',
        result: 'skip',
      });

      return res.status(201).send({
        answer: answerCurrent,
      });
    }

    let result;
    if (question.tfQuestion) {
      question.tfQuestion.answer === answer
        ? (result = 'hit')
        : (result = 'error');
    }

    if (question.meQuestion) {
      question.meQuestion.answer === answer
        ? (result = 'hit')
        : (result = 'error');
    }

    if (result === 'hit') {
      await Dispute.increment(
        {
          score: 1,
        },
        {
          where: {
            id: disputeId,
          },
        }
      );
    }

    if (result === 'error') {
      await Dispute.decrement(
        {
          score: 1,
        },
        {
          where: {
            id: disputeId,
            score: {
              [Op.gt]: 0,
            },
          },
        }
      );
    }

    const dispute = await Dispute.findOne({
      where: {
        id: disputeId,
      },
      attributes: ['id', 'score', 'quizId'],
    });

    req.io.emit(`quiz${dispute.quizId}`, dispute);

    await UserQuestion.create({
      questionId,
      unloggedUserId: userId,
      selectedAnswer: answer,
      result,
    });

    return res.status(201).send({
      answer: answerCurrent,
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

const quizStatus = async (req, res) => {
  const { quizId } = req.params;

  if (!quizId)
    return res.status(400).send({
      message: 'Quiz não informado!',
    });

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
      attributes: {
        include: ['id'],
      },
      include: [
        {
          model: TfQuestion,
          as: 'tfQuestion',
        },
        {
          model: MeQuestion,
          as: 'meQuestion',
        },
      ],
    });

    const questionsId = questions.map(question => question.id);

    const questionsAnswered = await UserQuestion.findAll({
      attributes: [
        'question_id',
        [fn('COUNT', col('question_id')), 'total'],
        'result',
        'selectedAnswer',
      ],
      group: ['question_id', 'result', 'selectedAnswer'],
      where: {
        questionId: {
          [Op.or]: questionsId,
        },
      },
    });

    return res.status(201).send({
      disputes,
      questions,
      questionsAnswered,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: error,
    });
  }
};

const allDisputesPlayer = async (req, res) => {
  const { userId } = req;

  try {
    const disputes = await Dispute.findAll({
      where: {
        userId,
      },
      attributes: {
        include: ['id'],
      },
      include: [
        {
          model: Quiz,
          as: 'Quiz',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!disputes || disputes.length === 0)
      return res.status(200).send({
        message: 'Nenhum quiz disputado!',
      });

    return res.status(201).send({
      disputes,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: error,
    });
  }
};

const statusDisputePlayer = async (req, res) => {
  const { id } = req.params;

  try {
    const disputes = await Dispute.findAll({
      where: {
        quizId: id,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
        {
          model: UnloggedUser,
          attributes: ['name'],
        },
      ],
      attributes: {
        include: ['id'],
      },
      order: [['score', 'DESC']],
    });

    if (!disputes || disputes.length === 0)
      return res.status(400).send({
        message: 'Nenhum quiz disputado!',
      });

    const questions = await QuestionQuiz.findAll({
      where: {
        quiz_id: id,
      },
      attributes: {
        include: ['id'],
      },
      include: [
        {
          model: TfQuestion,
          as: 'tfQuestion',
        },
        {
          model: MeQuestion,
          as: 'meQuestion',
        },
      ],
    });

    const questionsId = questions.map(question => question.id);

    const answers = await UserQuestion.findAll({
      where: {
        questionId: {
          [Op.or]: questionsId,
        },
        userId: req.userId,
      },
      attributes: ['id', 'questionId', 'selectedAnswer'],
    });

    return res.status(201).send({
      disputes,
      questions,
      answers,
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

const statusDisputePlayerUnlogged = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  console.log(userId);
  try {
    const disputes = await Dispute.findAll({
      where: {
        quizId: id,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
        {
          model: UnloggedUser,
          attributes: ['name'],
        },
      ],
      attributes: {
        include: ['id'],
      },
      order: [['score', 'DESC']],
    });

    if (!disputes || disputes.length === 0)
      return res.status(400).send({
        message: 'Nenhum quiz disputado!',
      });

    const questions = await QuestionQuiz.findAll({
      where: {
        quiz_id: id,
      },
      attributes: {
        include: ['id'],
      },
      include: [
        {
          model: TfQuestion,
          as: 'tfQuestion',
        },
        {
          model: MeQuestion,
          as: 'meQuestion',
        },
      ],
    });

    const questionsId = questions.map(question => question.id);

    const answers = await UserQuestion.findAll({
      where: {
        questionId: {
          [Op.or]: questionsId,
        },
        unloggedUserId: userId,
      },
      attributes: ['id', 'questionId', 'selectedAnswer'],
    });

    return res.status(201).send({
      disputes,
      questions,
      answers,
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

const find = async (req, res) => {
  const { code } = req.params;
  if (!code)
    return res.status(400).send({
      message: 'Some values are missing',
    });

  try {
    const quiz = await Quiz.findOne({
      where: {
        accessCode: code,
      },
      releasedAt: {
        [Op.lte]: new Date(),
      },
    });

    if (!quiz) {
      return res.status(400).send({
        message: 'Código inválido',
      });
    }

    if (quiz.blocked) {
      return res.status(400).send({
        message: 'Quiz não disponível',
      });
    }

    if (quiz.expirationAt) {
      if (quiz.expirationAt < new Date()) {
        return res.status(400).send({
          message: 'Quiz expirado!',
        });
      }
    }

    return res.status(201).send({
      quiz: quiz,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const startQuizUnlogged = async (req, res) => {
  const { quiz, name } = req.body;

  if (!quiz)
    return res.status(400).send({
      message: 'Quiz não informado!',
    });
  if (!name)
    return res.status(400).send({
      message: 'Nome não informado!',
    });

  try {
    const user = await UnloggedUser.create({
      name,
    });

    const listQuiz = await QuestionQuiz.findAll({
      where: {
        quiz_id: quiz,
      },
      attributes: {
        include: ['id'],
      },
      include: [
        {
          model: TfQuestion,
          as: 'tfQuestion',
        },
        {
          model: MeQuestion,
          as: 'meQuestion',
        },
      ],
    });

    const color = generateColor();

    const disputeCreated = await Dispute.create({
      quizId: quiz,
      unloggedUserId: user.id,
      status: 'started',
      score: 0,
      color,
    });

    if (!disputeCreated) {
      return res.status(400).send({
        message: 'Erro ao criar partida!',
      });
    }

    const dispute = await Dispute.findOne({
      where: {
        id: disputeCreated.id,
      },
      include: [
        {
          model: UnloggedUser,
          attributes: ['name'],
        },
      ],
      attributes: ['id', 'score', 'quizId', 'color'],
    });

    req.io.emit(`quiz${quiz}`, dispute);

    return res.status(201).send({
      listQuiz,
      dispute,
      user: user.id,
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

const ranking = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).send({
      message: 'Quiz não informado!',
    });

  try {
    const disputes = await Dispute.findAll({
      where: {
        quizId: id,
      },
      attributes: ['id', 'score', 'color'],
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
        {
          model: UnloggedUser,
          attributes: ['name'],
        },
      ],
    });

    return res.status(201).send(disputes);
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

const info = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).send({
      message: 'Quiz não informado!',
    });

  try {
    const quiz = await Quiz.findOne({
      where: {
        id,
      },
      attributes: ['name'],
    });

    const questions = await QuestionQuiz.count({
      where: {
        quiz_id: id,
      },
    });

    return res.status(201).send({ quiz, questions });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: error,
    });
  }
};

const switchBlocked = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).send({
      message: 'Quiz não informado!',
    });

  try {
    const quiz = await Quiz.findOne({
      where: {
        id,
      },
    });

    quiz.blocked = !quiz.blocked;

    await quiz.save();

    return res.status(201).send();
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

module.exports = {
  createQuiz,
  find,
  subjectsQuizList,
  allQuizSubjectTeacher,
  allQuizTeacher,
  questionsInQuiz,
  findQuizzes,
  startQuiz,
  answerQuestion,
  answerQuestionUnloggedUser,
  quizStatus,
  allDisputesPlayer,
  statusDisputePlayer,
  statusDisputePlayerUnlogged,
  startQuizUnlogged,
  ranking,
  info,
  switchBlocked,
};
