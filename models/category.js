const mysqlConnection = require('../db/db')
const {Sequelize} = require('sequelize')

const Category = mysqlConnection.define('Categories', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isAlpha: true
    },
  set(value) {
    this.setDataValue('name',value.trim().toLowerCase())
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
})

module.exports = Category