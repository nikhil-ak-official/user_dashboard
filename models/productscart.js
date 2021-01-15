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
})

Product.belongsToMany(Cart, {through: 'ProductsCarts', foreignKey: 'product_id'});
Cart.belongsToMany(Product, {through: 'ProductsCarts', foreignKey: 'cart_id'});

Product.hasMany(ProductsCart, {foreignKey: 'product_id'});
ProductsCart.belongsTo(Product, {foreignKey: 'product_id'});

Cart.hasMany(ProductsCart, {foreignKey: 'cart_id'});
ProductsCart.belongsTo(Cart, {foreignKey: 'cart_id'});


module.exports = ProductsCart