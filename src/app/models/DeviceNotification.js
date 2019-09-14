module.exports = (sequelize, DataTypes) => {
  const DeviceNotification = sequelize.define('DeviceNotification', {
    deviceUuid: DataTypes.UUID,
    userId: DataTypes.INTEGER,
  });

  DeviceNotification.associate = function (models) {
    DeviceNotification.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return DeviceNotification;
};
