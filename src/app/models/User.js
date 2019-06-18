module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING(60),
    email: DataTypes.STRING(80),
    password: DataTypes.STRING(80),
    active: DataTypes.BOOLEAN,
    group_user: DataTypes.INTEGER,
  });

  User.associate = function (models) {
    User.belongsTo(models.GroupUser, {
      foreignKey: 'group_users',
      as: 'group',
    });
    User.hasMany(models.Subject, {
      foreignKey: 'user_id',
      as: 'user',
    });
    User.hasMany(models.Question, {
      foreignKey: 'user_id',
    });
    User.belongsToMany(models.Subject, {
      through: 'UserSubject',
      as: 'subject_users',
      foreignKey: 'user_id',
    });
    User.belongsToMany(models.Quiz, {
      through: 'Dispute',
      as: 'dispute',
      foreignKey: 'user_id',
    });
  };
  return User;
};
