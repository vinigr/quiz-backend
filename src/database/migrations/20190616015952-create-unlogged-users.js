module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('unlogged_users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
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

  down: queryInterface => queryInterface.dropTable('unlogged_users'),
};
