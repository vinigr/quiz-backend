const { MeQuestion, TfQuestion } = require('../models');

const createQuestionME = async (req, res) => {
  const { file = null } = req;

  const {
    question, options, answer, explanation, subjectId,
  } = req.body;

  if (!question || !options || !answer) {
    return res.status(400).send({ message: 'Questão incompleta!' });
  }

  const jsonOptions = JSON.parse(options);

  if (jsonOptions.length < 2) {
    return res.status(400).send({ message: 'Questão incompleta!' });
  }

  const option3 = jsonOptions[2] ? jsonOptions[2].option : null;
  const option4 = jsonOptions[3] ? jsonOptions[3].option : null;
  const option5 = jsonOptions[4] ? jsonOptions[4].option : null;

  try {
    const questionResp = await MeQuestion.create({
      question,
      pathImage: file && file.url,
      option1: jsonOptions[0].option,
      option2: jsonOptions[1].option,
      option3,
      option4,
      option5,
      answer,
      explanation,
      user_id: req.userId,
      subjectId,
    });

    return res.status(201).send({ question: questionResp });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const questionsMe = async (req, res) => {
  try {
    const questions = await MeQuestion.findAll({
      where: {
        user_id: req.userId,
      },
    });

    return res.status(201).send(questions);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const createQuestionTF = async (req, res) => {
  const { file = null } = req;

  const {
    question, answer, explanation, subjectId,
  } = req.body;

  if (!question || !answer) {
    return res.status(400).send({ message: 'Questão incompleta!' });
  }

  try {
    const questionResp = await TfQuestion.create({
      question,
      pathImage: file && file.url,
      answer,
      user_id: req.userId,
      explanation,
      subjectId,
    });

    return res.status(201).send({ question: questionResp });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const questionsTf = async (req, res) => {
  try {
    const questions = await TfQuestion.findAll({
      where: {
        user_id: req.userId,
      },
    });


    return res.status(201).send(questions);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const questionsAll = async (req, res) => {
  try {
    const questionsTf = await TfQuestion.findAll({
      where: {
        user_id: req.userId,
      },
    });

    const questionsMe = await MeQuestion.findAll({
      where: {
        user_id: req.userId,
      },
    });

    return res.status(201).send({ questionsTf, questionsMe });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const allQuestionsSubject = async (req, res) => {
  const { id } = req.params;

  try {
    const questionsTf = await TfQuestion.findAll({
      where: {
        subjectId: id,
      },
    });

    const questionsMe = await MeQuestion.findAll({
      where: {
        subjectId: id,
      },
    });

    return res.status(201).send({ questionsTf, questionsMe });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

module.exports = {
  createQuestionME,
  questionsMe,
  createQuestionTF,
  questionsTf,
  questionsAll,
  allQuestionsSubject,
};
