module.exports = (sequelize, DataTypes) => {
  const QuestionQuiz = sequelize.define('QuestionQuiz', {
    quiz_id: DataTypes.INTEGER,
    meQuestionId: DataTypes.INTEGER,
    tfQuestionId: DataTypes.INTEGER,
  });

  QuestionQuiz.associate = function (models) {
    QuestionQuiz.belongsTo(models.Quiz, {
      foreignKey: 'quiz_id',
      as: 'quiz',
    });
    QuestionQuiz.belongsTo(models.MeQuestion, {
      foreignKey: 'meQuestionId',
      as: 'meQuestion',
    });
    QuestionQuiz.belongsTo(models.TfQuestion, {
      foreignKey: 'tfQuestionId',
      as: 'tfQuestion',
    });
  };
  return QuestionQuiz;
};
