module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    accessCode: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Subject.associate = function (models) {
    Subject.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Subject.hasMany(models.Quiz, {
      foreignKey: 'subjectId',
      as: 'subject',
    });
    Subject.belongsToMany(models.User, {
      through: 'UserSubject',
      as: 'subjectUsers',
      foreignKey: 'subjectId',
    });
  };
  return Subject;
};
