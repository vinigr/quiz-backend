module.exports = (sequelize, DataTypes) => {
  const QuestionQuiz = sequelize.define('QuestionQuiz', {
    quizId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
  });

  QuestionQuiz.associate = function (models) {
    QuestionQuiz.belongsTo(models.Quiz, {
      foreignKey: 'quizId',
      as: 'quiz',
    });
    QuestionQuiz.belongsTo(models.Question, {
      foreignKey: 'questionId',
      as: 'question',
    });
  };
  return QuestionQuiz;
};
