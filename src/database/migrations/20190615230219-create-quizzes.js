module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('quizzes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(30),
    },
    subject_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'subjects',
        key: 'id',
      },
    },
    blocked: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    released_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    expiration_at: {
      allowNull: true,
      type: DataTypes.DATE,
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


  down: queryInterface => queryInterface.dropTable('quizzes'),
};
