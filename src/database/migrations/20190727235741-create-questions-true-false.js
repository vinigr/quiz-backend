module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('tf_questions', {
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
    answer: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
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


  down: queryInterface => queryInterface.dropTable('tf_questions'),
};