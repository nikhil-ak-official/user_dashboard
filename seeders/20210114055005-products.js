'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Products', [{
     name: 'Highlander Tshirt for Men',
     description: 'Best slim fit casual tshirt with stripes',
     price: 299,
     status: 'active',
     quantity: 10,
     image: 'images/2021-01-18.jpg',
     category_id: 1,
     subcategory_id: 1,
     createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
      updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)


   }])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Products', null, {})
  }
};
