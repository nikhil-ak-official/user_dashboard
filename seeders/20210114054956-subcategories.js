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
   await queryInterface.bulkInsert('Subcategories', [{
     name: 'Tshirts',
     category_id:1,
     createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
      updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
  },
{
  name: 'Shoes',
     category_id:2,
     createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
      updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
},
{
  name: 'TV',
     category_id:3,
     createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
      updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
},
{
  name: 'Shirts',
     category_id:1,
     createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
      updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
}, {
  name: 'Sliders',
     category_id:2,
     createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
      updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
}, {
  name: 'Mobiles',
     category_id:3,
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
    await queryInterface.bulkDelete('Subcategories', null, {})

  }
};
