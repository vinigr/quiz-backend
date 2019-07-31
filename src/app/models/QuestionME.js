module.exports = (sequelize, DataTypes) => {
  const QuestionME = sequelize.define('QuestionME', {
    question: DataTypes.STRING,
    pathImage: DataTypes.STRING,
    option1: DataTypes.STRING(500),
    option2: DataTypes.STRING(500),
    option3: DataTypes.STRING(500),
    option4: DataTypes.STRING(500),
    option5: DataTypes.STRING(500),
    answer: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  });

  QuestionME.associate = function (models) {
    QuestionME.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    QuestionME.belongsToMany(models.Quiz, {
      through: 'QuestionQuiz',
      as: 'dispute',
      foreignKey: 'question_id',
    });
  };

  return QuestionME;
};
