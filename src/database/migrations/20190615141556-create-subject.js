module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('Subjects', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
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
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }),


  down: queryInterface => queryInterface.dropTable('Subjects'),
};
