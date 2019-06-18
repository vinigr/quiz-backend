module.exports = (sequelize, DataTypes) => {
  const UserSubject = sequelize.define('UserSubject', {
    user_id: DataTypes.INTEGER,
    subject_id: DataTypes.INTEGER,
  });

  UserSubject.associate = function (models) {
    UserSubject.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    UserSubject.belongsTo(models.Subject, {
      foreignKey: 'subject_id',
      as: 'subject',
    });
  };
  return UserSubject;
};
