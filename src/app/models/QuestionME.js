module.exports = (sequelize, DataTypes) => {
  const MeQuestion = sequelize.define('MeQuestion', {
    question: DataTypes.STRING,
    pathImage: DataTypes.STRING,
    option1: DataTypes.STRING(500),
    option2: DataTypes.STRING(500),
    option3: DataTypes.STRING(500),
    option4: DataTypes.STRING(500),
    option5: DataTypes.STRING(500),
    answer: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    subjectId: DataTypes.INTEGER,
  });

  MeQuestion.associate = function (models) {
    MeQuestion.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    MeQuestion.belongsTo(models.Subject, {
      foreignKey: 'subjectId',
    });
    MeQuestion.belongsToMany(models.Quiz, {
      through: 'QuestionQuiz',
      as: 'dispute',
      foreignKey: 'meQuestionId',
    });
    MeQuestion.hasMany(models.UserQuestion, {
      foreignKey: 'meQuestionId',
    });
  };

  return MeQuestion;
};
