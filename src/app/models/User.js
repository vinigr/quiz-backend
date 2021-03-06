module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING(60),
    active: DataTypes.BOOLEAN,
    local_auth: DataTypes.INTEGER,
    group_user: DataTypes.INTEGER,
  });

  User.associate = function (models) {
    User.belongsTo(models.LocalAuth, {
      foreignKey: 'local_auth',
      as: 'l_auth',
    });
    User.belongsTo(models.GroupUser, {
      foreignKey: 'group_user',
      as: 'group',
    });
    User.hasMany(models.Subject, {
      foreignKey: 'userId',
      as: 'user',
    });
    User.hasMany(models.MeQuestion, {
      foreignKey: 'user_id',
    });
    User.hasMany(models.TfQuestion, {
      foreignKey: 'user_id',
    });
    User.belongsToMany(models.Subject, {
      through: 'UserSubject',
      as: 'user_subject',
      foreignKey: 'user_id',
    });
    User.belongsToMany(models.Quiz, {
      through: 'Dispute',
      as: 'dispute',
      foreignKey: 'userId',
    });
    User.hasMany(models.UserQuestion, {
      foreignKey: 'userId',
    });
    User.hasMany(models.DeviceNotification, {
      foreignKey: 'userId',
    });
  };
  return User;
};
