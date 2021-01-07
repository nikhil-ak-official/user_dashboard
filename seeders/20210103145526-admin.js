'use strict';
const bcrypt = require('bcrypt') 
const passwords = ["nikhilanilkumar", "annsusan", "sidharthsujithlal", "thejussatheeshan", "haripriyajagannathan"]
const hashedPassword = passwords.map(e => bcrypt.hashSync(e, 8))
module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Users', [{
      firstName: "nikhil",
      lastName: "anilkumar",
      email: "nikku.a1998@gmail.com",
      role_id: 1,
      status: "active",
      password: hashedPassword[0],
      token: null,
      resetPasswordToken: null,
      createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
      updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
    },
    {
      firstName: "ann",
      lastName: "susan",
      email: "annsusan@gmail.com",
      role_id: 1,
      status: "active",
      password: hashedPassword[1],
      token: null,
      resetPasswordToken: null,
      createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
      updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
    },
    {
      firstName: "sidharth",
      lastName: "sujithlal",
      email: "sidharthsujithlal@gmail.com",
      role_id: 1,
      status: "active",
      password: hashedPassword[2],
      token: null,
      resetPasswordToken: null,
      createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
      updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
    },
    {
      firstName: "thejus",
      lastName: "satheeshan",
      email: "thejussatheeshan.a1998@gmail.com",
      role_id: 1,
      status: "active",
      password: hashedPassword[3] ,
      token: null,
      resetPasswordToken: null,
      createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
      updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
    },
    {
      firstName: "haripriya",
      lastName: "jagannathan",
      email: "haripriyajagannathan@gmail.com",
      role_id: 1,
      status: "active",
      password: hashedPassword[4],
      token: null,
      resetPasswordToken: null,
      createdAt: Sequelize.literal(`CURRENT_TIMESTAMP`),
      updatedAt: Sequelize.literal(`CURRENT_TIMESTAMP`)
    },
  ], {})

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
