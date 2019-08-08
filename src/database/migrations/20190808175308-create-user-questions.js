module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('user_questions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    quiz_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'quizzes',
        key: 'id',
      },
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    me_question_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'me_questions',
        key: 'id',
      },
    },
    tf_question_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'tf_questions',
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
