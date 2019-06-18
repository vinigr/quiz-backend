module.exports = (sequelize, DataTypes) => {
  const QuestionQuiz = sequelize.define('QuestionQuiz', {
    quiz_id: DataTypes.INTEGER,
    question_id: DataTypes.INTEGER,
  });

  QuestionQuiz.associate = function (models) {
    QuestionQuiz.belongsTo(models.Quiz, {
      foreignKey: 'quiz_id',
      as: 'quiz',
    });
    QuestionQuiz.belongsTo(models.Question, {
      foreignKey: 'question_id',
      as: 'question',
    });
  };
  return QuestionQuiz;
};
