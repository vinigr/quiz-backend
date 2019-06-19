module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('subjects', {
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
    access_code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }),


  down: queryInterface => queryInterface.dropTable('subjects'),
};
