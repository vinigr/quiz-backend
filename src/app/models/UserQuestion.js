module.exports = (sequelize, DataTypes) => {
  const UserQuestion = sequelize.define('UserQuestion', {
    questionId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    unloggedUserId: DataTypes.INTEGER,
    selectedAnswer: DataTypes.STRING(5),
    result: DataTypes.STRING(5),
  });

  UserQuestion.associate = function (models) {
    UserQuestion.belongsTo(models.QuestionQuiz, {
      foreignKey: 'questionId',
    });
    UserQuestion.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    UserQuestion.belongsTo(models.UnloggedUser, {
      foreignKey: 'unloggedUserId',
      as: 'unloggedUser',
    });
  };
  return UserQuestion;
};
