module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define('Quiz', {
    name: DataTypes.STRING(30),
    subjectId: DataTypes.INTEGER,
    accessCode: DataTypes.STRING(30),
    blocked: DataTypes.BOOLEAN,
    feedbackAnswer: DataTypes.BOOLEAN,
    releasedAt: DataTypes.DATE,
    expirationAt: DataTypes.DATE,
  });

  Quiz.associate = function (models) {
    Quiz.belongsTo(models.Subject, {
      foreignKey: 'subject_id',
      as: 'subject',
    });
    Quiz.belongsToMany(models.MeQuestion, {
      through: 'QuestionQuiz',
      as: 'question_quiz',
      foreignKey: 'quiz_id',
    });
    Quiz.belongsToMany(models.User, {
      through: 'Dispute',
      as: 'dispute',
      foreignKey: 'quizId',
    });
  };

  return Quiz;
};
