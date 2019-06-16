module.exports = (sequelize, DataTypes) => {
  const GroupUser = sequelize.define('GroupUser', {
    name: DataTypes.STRING,
  });

  GroupUser.associate = function (models) {
    GroupUser.hasMany(models.User, {
      foreignKey: 'groupUser',
      as: 'group',
    });
  };
  return GroupUser;
};
