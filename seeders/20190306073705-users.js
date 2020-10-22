'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      { id: 1, username: 'sylvester', password: 's@123', role: 'owner', email: 's@rmi.com', createdon: new Date()},
      { id: 2, username: 'admin', password: 'admin@1234', role: 'admin', email: 'rmi@example.com', createdon: new Date()}
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};


