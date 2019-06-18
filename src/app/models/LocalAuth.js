module.exports = (sequelize, DataTypes) => {
  const LocalAuth = sequelize.define('LocalAuth', {
    name: DataTypes.STRING(60),
    email: DataTypes.STRING(80),
    password: DataTypes.STRING(80),
  });

  LocalAuth.associate = function (models) {
    LocalAuth.hasOne(models.User, {
      foreignKey: 'local_auth',
      as: 'l_auth',
    });
  };
  return LocalAuth;
};
