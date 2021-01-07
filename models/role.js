const mysqlConnection = require('../db/db')
const {Sequelize} = require('sequelize')

const Role = mysqlConnection.define('Roles', {
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




module.exports = Role