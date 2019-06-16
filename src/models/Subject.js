module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    name: DataTypes.STRING,
    topic: DataTypes.STRING,
    accessCode: DataTypes.STRING,
    userId: DataTypes.INTEGER,
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
