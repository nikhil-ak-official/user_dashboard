'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isAlpha: true
        }
      },
      createdAt: {
        type: 'TIMESTAMP',
        // defaultValue:  Sequelize.literal(`CURRENT_TIMESTAMP`),
        allowNull: false
    },
    updatedAt: {
        type: 'TIMESTAMP',
        // defaultValue: Sequelize.literal(`CURRENT_TIMESTAMP`),
        allowNull: false
    }
    });

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Roles');
  }
};