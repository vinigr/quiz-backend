module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('question_quizzes', {
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
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }),


  down: queryInterface => queryInterface.dropTable('question_quizzes'),
};
