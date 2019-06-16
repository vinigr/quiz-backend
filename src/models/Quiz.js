module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define('Quiz', {
    name: DataTypes.STRING,
    subjectId: DataTypes.INTEGER,
  });

  Quiz.associate = function (models) {
    Quiz.belongsTo(models.Subject, {
      foreignKey: 'subjectId',
      as: 'subject',
    });
    Quiz.belongsToMany(models.Question, {
      through: 'QuestionQuiz',
      as: 'questionQuiz',
      foreignKey: 'quizId',
    });
    Quiz.belongsToMany(models.User, {
      through: 'Dispute',
      as: 'dispute',
      foreignKey: 'quizId',
    });
  };

  return Quiz;
};
