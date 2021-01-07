'use strict';
const { query } = require("express");


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
    await queryInterface.bulkInsert('Roles', [{
      name: "admin",
      createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
      updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
    },
    {
      name: "user",
      createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
      updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
    }
    ], {})

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
    //  await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
