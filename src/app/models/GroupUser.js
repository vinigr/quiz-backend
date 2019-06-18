module.exports = (sequelize, DataTypes) => {
  const GroupUser = sequelize.define('GroupUser', {
    name: DataTypes.STRING(25),
  });

  GroupUser.associate = function (models) {
    GroupUser.hasMany(models.User, {
      foreignKey: 'group_users',
      as: 'group',
    });
  };
  return GroupUser;
};
