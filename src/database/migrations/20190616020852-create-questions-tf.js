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
    path_image: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    answer: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    subject_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'subjects',
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


  down: queryInterface => queryInterface.dropTable('tf_questions'),
};
