module.exports = (sequelize, DataTypes) => {
  const GroupUser = sequelize.define('GroupUser', {
    name: {
      allowNull: false,
      type: DataTypes.STRING(25),
    },
  });

  GroupUser.associate = function (models) {
    GroupUser.hasMany(models.User, {
      foreignKey: 'groupUser',
      as: 'group',
    });
  };
  return GroupUser;
};
