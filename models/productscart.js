const mysqlConnection = require("../db/db")
const {Sequelize} = require('sequelize')
const Product = require("./product")
const Cart = require('./cart')


const ProductsCart = mysqlConnection.define('ProductsCarts', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  product_id: {
    type: Sequelize.INTEGER
  },
  cart_id: {
    type: Sequelize.INTEGER
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
})

Product.belongsToMany(Cart, {through: 'ProductsCarts'});
Cart.belongsToMany(Product, {through: 'ProductsCarts'});

module.exports = ProductsCart