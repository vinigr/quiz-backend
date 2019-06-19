module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('local_auths', {
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
    email: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    reset_password_token: {
      type: DataTypes.STRING(60),
    },
    reset_password_expires: {
      type: DataTypes.DATE,
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


  down: queryInterface => queryInterface.dropTable('local_auths'),
};
