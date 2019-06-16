module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('Subject', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    topic: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    accessCode: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
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


  down: queryInterface => queryInterface.dropTable('Subject'),
};
