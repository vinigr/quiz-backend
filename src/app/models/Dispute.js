module.exports = (sequelize, DataTypes) => {
  const Dispute = sequelize.define('Dispute', {
    quizId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
  });

  Dispute.associate = function (models) {
    Dispute.belongsTo(models.Quiz, {
      foreignKey: 'quizId',
    });
    Dispute.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return Dispute;
};
