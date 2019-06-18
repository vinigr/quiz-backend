module.exports = (sequelize, DataTypes) => {
  const UserSubject = sequelize.define('UserSubject', {
    userId: DataTypes.INTEGER,
    subjectId: DataTypes.INTEGER,
  });

  UserSubject.associate = function (models) {
    UserSubject.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    UserSubject.belongsTo(models.Subject, {
      foreignKey: 'subjectId',
      as: 'subject',
    });
  };
  return UserSubject;
};
