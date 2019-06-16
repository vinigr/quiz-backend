module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('QuestionQuiz', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    quizId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    questionId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }),


  down: queryInterface => queryInterface.dropTable('QuestionQuiz'),
};
