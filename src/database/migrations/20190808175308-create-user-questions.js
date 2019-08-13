module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('user_questions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    question_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'question_quizzes',
        key: 'id',
      },
    },
    selected_answer: {
      allowNull: false,
      type: DataTypes.STRING(5),
    },
    result: {
      allowNull: false,
      type: DataTypes.STRING(5),
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }),


  down: queryInterface => queryInterface.dropTable('user_questions'),
};
