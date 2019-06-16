module.exports = (sequelize, DataTypes) => {
  const Dispute = sequelize.define('Dispute', {
    quizId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    score: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });

  Dispute.associate = function (models) {
    Dispute.belongsTo(models.Quiz, {
      foreignKey: 'quizId',
      as: 'quiz',
    });
    Dispute.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return Dispute;
};
