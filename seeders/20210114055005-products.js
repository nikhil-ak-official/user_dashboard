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
     image: 'images/highlandertshirt.jpg',
     category_id: 1,
     subcategory_id: 1,
     createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
      updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)


   }, 
    {
      name: 'Puma shoes for Men',
      description: 'Best casual shoes',
      price: 1299,
      status: 'active',
      quantity: 10,
      image: 'images/pumashoes.jpeg',
      category_id: 2,
      subcategory_id: 2,
      createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
       updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
 
 
    },
    {
      name: 'Sony bravia',
      description: 'Best hd display tv',
      price: 50000,
      status: 'active',
      quantity: 10,
      image: 'images/sonybravia.jpg',
      category_id: 3,
      subcategory_id: 3,
      createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
       updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
 
 
    },
    {
      name: 'Highlander shirt for Men',
      description: 'Best slim fit casual shirt with stripes',
      price: 999,
      status: 'active',
      quantity: 10,
      image: 'images/highlandershirt.jpeg',
      category_id: 1,
      subcategory_id: 4,
      createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
       updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
 
 
    },
    {
      name: 'Nike slider for Men',
      description: 'Best casual slidersnfor men',
      price: 1299,
      status: 'active',
      quantity: 10,
      image: 'images/nikesliders.jpg',
      category_id: 2,
      subcategory_id: 5,
      createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
       updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
 
 
    },
    {
      name: 'Samsung A50',
      description: 'high quality display with long battery backup ',
      price: 50000,
      status: 'active',
      quantity: 10,
      image: 'images/samsunga50.jpeg',
      category_id: 3,
      subcategory_id: 6,
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
    await queryInterface.bulkDelete('Products', null, {})
  }
};
