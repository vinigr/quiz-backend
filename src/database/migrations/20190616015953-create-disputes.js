module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable('disputes', {
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
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      unlogged_user_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'unlogged_users',
          key: 'id',
        },
      },
      status: {
        allowNull: true,
        type: DataTypes.STRING(10),
      },
      score: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      color: {
        allowNull: false,
        type: DataTypes.STRING(6),
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

  down: queryInterface => queryInterface.dropTable('disputes'),
};
