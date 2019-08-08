module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('me_questions', {
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
      type: DataTypes.INTEGER,
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


  down: queryInterface => queryInterface.dropTable('me_questions'),
};
