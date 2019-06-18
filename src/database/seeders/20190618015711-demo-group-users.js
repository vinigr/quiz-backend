module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('group_users', [{
    name: 'Player',
    created_at: new Date(),
    updated_at: new Date(),
  }, {
    name: 'Teacher',
    created_at: new Date(),
    updated_at: new Date(),
  }, {
    name: 'Admin',
    created_at: new Date(),
    updated_at: new Date(),
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('group_users', null, {}),
};
