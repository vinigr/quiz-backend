module.exports = (sequelize, DataTypes) => {
  const UserQuestion = sequelize.define('UserQuestion', {
    quiz_id: DataTypes.INTEGER,
    meQuestionId: DataTypes.INTEGER,
    tfQuestionId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    selectedAnswer: DataTypes.STRING(5),
    result: DataTypes.STRING(5),
  });

  UserQuestion.associate = function (models) {
    UserQuestion.belongsTo(models.Quiz, {
      foreignKey: 'quiz_id',
      as: 'quiz',
    });
    UserQuestion.belongsTo(models.MeQuestion, {
      foreignKey: 'meQuestionId',
      as: 'meQuestion',
    });
    UserQuestion.belongsTo(models.TfQuestion, {
      foreignKey: 'tfQuestionId',
      as: 'tfQuestion',
    });
    UserQuestion.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return UserQuestion;
};
