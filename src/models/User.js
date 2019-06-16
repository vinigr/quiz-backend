module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: true,
    },
    groupUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
