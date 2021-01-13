const mysqlConnection = require("../db/db")
const {Sequelize} = require('sequelize')
const User = require("./user")

const Cart = mysqlConnection.define('Carts', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  user_id: {
    type: Sequelize.INTEGER
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

User.hasOne(Cart);
Cart.hasMany(User);

module.exports = Cart