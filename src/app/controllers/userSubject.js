const { Subject, User, UserSubject } = require('../models');

const userSubjects = async (req, res) => {
  const { userId } = req;

  try {
    const subjects = await UserSubject.findAll({
      where: {
        user_id: userId,
      },
      include: [{
        model: Subject,
        as: 'subject',
        include: [{
          model: User, as: 'user',
        }],
      }],
    });

    return res.status(201).send({ subjects });
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = {
  userSubjects,
};
