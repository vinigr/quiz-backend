const { MeQuestion } = require('../models');

const createQuestionME = async (req, res) => {
  const { file = null } = req;

  const { question, options, answer } = req.body;

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
      pathImage: file && file.path,
      option1: jsonOptions[0].option,
      option2: jsonOptions[1].option,
      option3,
      option4,
      option5,
      answer,
      user_id: req.userId,
    });

    return res.status(201).send({ question: questionResp });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};


module.exports = {
  createQuestionME,
};
