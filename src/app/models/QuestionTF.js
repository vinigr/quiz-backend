module.exports = (sequelize, DataTypes) => {
  const TfQuestion = sequelize.define('TfQuestion', {
    question: DataTypes.STRING,
    pathImage: DataTypes.STRING,
    answer: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER,
    subjectId: DataTypes.INTEGER,
  });

  TfQuestion.associate = function (models) {
    TfQuestion.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    TfQuestion.belongsTo(models.Subject, {
      foreignKey: 'subjectId',
    });
    TfQuestion.belongsToMany(models.Quiz, {
      through: 'QuestionQuiz',
      as: 'dispute',
      foreignKey: 'tfQuestionId',
    });
  };

  return TfQuestion;
};
