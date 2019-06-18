module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    question: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    options: {
      allowNull: false,
      type: DataTypes.ARRAY(DataTypes.STRING(500)),
    },
    answer: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });

  Question.associate = function (models) {
    Question.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Question.belongsToMany(models.Quiz, {
      through: 'QuestionQuiz',
      as: 'dispute',
      foreignKey: 'questionId',
    });
  };

  return Question;
};
