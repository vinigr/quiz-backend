const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Helper = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },
  /**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken(id, userGroup) {
    const token = jwt.sign({
      userId: id,
      role: userGroup,
    },
    process.env.SECRET, { expiresIn: '7d' });
    return token;
  },

  generateConfirmationToken(id) {
    const token = jwt.sign({
      userId: id,
    },
    process.env.COD_CONFIRM, { expiresIn: '2d' });
    return token;
  },

  verifyConfirmation(token) {
    let user;
    jwt.verify(token, process.env.COD_CONFIRM, (err, decoded) => {
      if (err) {
        user = undefined;
        return user;
      }
      user = decoded.userId;
    });
    return user;
  },

  accessCodeGererate() {
    const math = Math.random().toString(36).substring(2, 6);
    const code = (math + math).toUpperCase();
    return code;
  },

  verifyTokenMobile(token) {
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
};

module.exports = Helper;
