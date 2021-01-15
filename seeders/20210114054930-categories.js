'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

   await queryInterface.bulkInsert('Categories', [{
     name: 'clothing',
     createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
     updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
  }
])

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Categories', null, {})

  }
};
