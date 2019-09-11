const { Subject, User, UserSubject } = require("../models");

const userSubjects = async (req, res) => {
  const { userId } = req;

  try {
    const subjects = await UserSubject.findAll({
      where: {
        user_id: userId
      },
      include: [
        {
          model: Subject,
          as: "subject",
          include: [
            {
              model: User,
              as: "user"
            }
          ]
        }
      ]
    });

    return res.status(201).send({ subjects });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const unsubscribe = async (req, res) => {
  const { userId } = req;
  const { id } = req.params;

  try {
    const subscribe = await UserSubject.findOne({
      where: {
        user_id: userId,
        subject_id: id
      }
    });

    if (!subscribe)
      return res.status(404).send({ message: "Disciplina não encontrada!" });

    subscribe.destroy();
    return res
      .status(201)
      .send({ message: "Inscrição cancelada com sucesso!" });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

module.exports = {
  userSubjects,
  unsubscribe
};
