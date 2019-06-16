module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    question: DataTypes.STRING,
    options: DataTypes.ARRAY(DataTypes.STRING),
    answer: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  });

  Question.associate = function (models) {
    Question.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Question.belongsToMany(models.Quiz, {
      through: 'QuestionQuiz',
      as: 'dispute',
      foreignKey: 'questionId',
    });
  };

  return Question;
};
