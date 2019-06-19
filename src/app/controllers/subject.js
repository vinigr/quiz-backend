const { Subject } = require('../models');
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

module.exports = {
  create,
};
