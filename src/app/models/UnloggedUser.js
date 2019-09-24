module.exports = (sequelize, DataTypes) => {
  const UnloggedUser = sequelize.define('UnloggedUser', {
    name: DataTypes.STRING(60),
  });

  UnloggedUser.associate = function (models) {
    UnloggedUser.belongsToMany(models.Quiz, {
      through: 'Dispute',
      as: 'dispute',
      foreignKey: 'unloggedUserId',
    });
    UnloggedUser.hasMany(models.UserQuestion, {
      foreignKey: 'unloggedUserId',
    });
  };
  return UnloggedUser;
};
