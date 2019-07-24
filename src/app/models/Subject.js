module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    name: DataTypes.STRING(60),
    topic: DataTypes.STRING(100),
    accessCode: DataTypes.STRING(30),
    userId: DataTypes.INTEGER,
  });

  Subject.associate = function (models) {
    Subject.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Subject.hasMany(models.Quiz, {
      foreignKey: 'subject_id',
      as: 'subject',
    });
    Subject.hasMany(models.Question, {
      foreignKey: 'subject_id',
      as: 'subject',
    });
    Subject.belongsToMany(models.User, {
      through: 'UserSubject',
      as: 'user_subject',
      foreignKey: 'subject_id',
    });
  };
  return Subject;
};
