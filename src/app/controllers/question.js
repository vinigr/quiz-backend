const createQuestionME = (req, res) => {
  const { options, answer } = req.body;

  const optionsParse = JSON.parse(options);

  res.send();
};


module.exports = {
  createQuestionME,
};
