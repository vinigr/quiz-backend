const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, GroupUser } = require('../models');

const verifyHelper = {
  verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(403).send({
        auth: false, message: 'No token provided.',
      });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          auth: false,
          message: `Fail to Authentication. Error -> ${err}`,
        });
      }
      req.userId = decoded.userId;
      next();
    });
  },

  async isTeacher(req, res, next) {
    try {
      const user = await User.findOne({
        where: { id: req.userId },
        include: [{
          model: GroupUser,
          as: 'group',
          where: {
            name: {
              [Op.or]: ['Teacher', 'Admin'],
            },
          },
        }],
      });

      if (!user) return res.status(403).send({ message: 'Require Teacher Role!' });
      next();
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async isAdmin(req, res, next) {
    try {
      const user = await User.findOne({
        where: { id: req.userId },
        include: [{ model: GroupUser, as: 'group', where: { name: 'Admin' } }],
      });

      if (!user) return res.status(403).send({ message: 'Require Teacher Role!' });
      next();
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};

module.exports = verifyHelper;
