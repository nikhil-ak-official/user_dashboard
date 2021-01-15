'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProductsCarts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
            references: {
              model: 'Products',
              key: 'id'
            },
    
      },
      cart_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
            references: {
              model: 'Carts',
              key: 'id'
            },
      },
      product_quantity: {
        type: Sequelize.INTEGER,
        validate: {
          validator(value) {
            if(value<0) {
              throw new Error('Please enter a positive value')
            }
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ProductsCarts');
  }
};