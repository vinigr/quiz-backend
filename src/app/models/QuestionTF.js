module.exports = (sequelize, DataTypes) => {
  const QuestionTF = sequelize.define('QuestionTF', {
    question: DataTypes.STRING,
    pathImage: DataTypes.STRING,
    answer: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER,
  });

  QuestionTF.associate = function (models) {
    QuestionTF.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    QuestionTF.belongsToMany(models.Quiz, {
      through: 'QuestionQuiz',
      as: 'dispute',
      foreignKey: 'question_id',
    });
  };

  return QuestionTF;
};
