'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isAlpha: true
        }
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isAlpha: true
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'id'
        },
        validate: {
            max: 2
        },
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isAlpha: true
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
        default: null,
        validate: {
            len: [6,]
        },
        set(value) {
          if(value != null) {
            this.setDataValue('password', bcrypt.hashSync(value, 8)) 
          }
        }
      },
      token:{
        type: Sequelize.STRING,
        default: null,
        allowNull: true
    },
      resetPasswordToken: {
        type: Sequelize.STRING,
        type: Sequelize.STRING,
        default: null,
        allowNull: true
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
    await queryInterface.dropTable('Users');
  }
};