module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define('Quiz', {
    name: DataTypes.STRING(30),
    subjectId: DataTypes.INTEGER,
  });

  Quiz.associate = function (models) {
    Quiz.belongsTo(models.Subject, {
      foreignKey: 'subject_id',
      as: 'subject',
    });
    Quiz.belongsToMany(models.Question, {
      through: 'QuestionQuiz',
      as: 'question_quiz',
      foreignKey: 'quiz_id',
    });
    Quiz.belongsToMany(models.User, {
      through: 'Dispute',
      as: 'dispute',
      foreignKey: 'quiz_id',
    });
  };

  return Quiz;
};