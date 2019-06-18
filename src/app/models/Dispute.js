module.exports = (sequelize, DataTypes) => {
  const Dispute = sequelize.define('Dispute', {
    quizId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
  });

  Dispute.associate = function (models) {
    Dispute.belongsTo(models.Quiz, {
      foreignKey: 'quiz_id',
      as: 'quiz',
    });
    Dispute.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };
  return Dispute;
};
