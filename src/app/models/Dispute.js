module.exports = (sequelize, DataTypes) => {
  const Dispute = sequelize.define('Dispute', {
    quizId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    unloggedUserId: DataTypes.INTEGER,
    status: DataTypes.STRING(10),
    score: DataTypes.INTEGER,
  });

  Dispute.associate = function (models) {
    Dispute.belongsTo(models.Quiz, {
      foreignKey: 'quizId',
    });
    Dispute.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    Dispute.belongsTo(models.UnloggedUser, {
      foreignKey: 'unloggedUserId',
    });
  };
  return Dispute;
};
