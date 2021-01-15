'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true,


      },
      description: {
        type: Sequelize.STRING
      },
      price: {
        allowNull: false,
        type: Sequelize.FLOAT,
        validate: {
          validator(value) {
            if(value<=0) {
              throw new Error('Please enter a value greater than zero')
            }
          }
        }
      },
      image: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        validate: {
          isIn: [['active', 'inactive']]
        }
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          validator(value) {
            if(value<=0) {
              throw new Error('Please enter a value greater than zero')
            }
          }
        }
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
            references: {
              model: 'Categories',
              key: 'id'
            },
    
    
      },
      subcategory_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
            references: {
              model: 'Subcategories',
              key: 'id'
            },
    
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  }
};