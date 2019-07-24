module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    question: DataTypes.STRING,
    options: DataTypes.ARRAY(DataTypes.TEXT(500)),
    answer: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  });

  Question.associate = function (models) {
    Question.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    Question.belongsToMany(models.Quiz, {
      through: 'QuestionQuiz',
      as: 'dispute',
      foreignKey: 'question_id',
    });
  };

  return Question;
};
