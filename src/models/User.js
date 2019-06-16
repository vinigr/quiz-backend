module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isActive: {
      type: DataTypes.STRING,
      default: true,
    },
    groupUser: {
      type: DataTypes.INTEGER,
      default: 0,
    },
  });

  User.associate = function (models) {
    User.belongsTo(models.GroupUser, {
      foreignKey: 'groupUser',
      as: 'group',
    });
    User.hasMany(models.Subject, {
      foreignKey: 'userId',
      as: 'user',
    });
    User.hasMany(models.Question, {
      foreignKey: 'userId',
    });
    User.belongsToMany(models.Subject, {
      through: 'UserSubject',
      as: 'subjectUsers',
      foreignKey: 'userId',
    });
    User.belongsToMany(models.Quiz, {
      through: 'Dispute',
      as: 'dispute',
      foreignKey: 'userId',
    });
  };
  return User;
};
