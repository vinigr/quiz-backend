module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('questions_ME', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    question: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    pathImage: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    option1: {
      allowNull: false,
      type: DataTypes.STRING(500),
    },
    option2: {
      allowNull: false,
      type: DataTypes.STRING(500),
    },
    option3: {
      allowNull: true,
      type: DataTypes.STRING(500),
    },
    option4: {
      allowNull: true,
      type: DataTypes.STRING(500),
    },
    option5: {
      allowNull: true,
      type: DataTypes.STRING(500),
    },
    answer: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
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


  down: queryInterface => queryInterface.dropTable('questions'),
};
