module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    active: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    local_auth: {
      type: DataTypes.INTEGER,
      references: {
        model: 'local_auths',
        key: 'id',
      },
    },
    group_user: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 1,
      references: {
        model: 'group_users',
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


  down: queryInterface => queryInterface.dropTable('users'),
};
