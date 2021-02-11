const mysqlConnection = require('../db/db')
const {Sequelize} = require('sequelize')
const Product = require('./product')

const Trending = mysqlConnection.define('Trendings', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  count: {
    type: Sequelize.INTEGER,
    allowNull: false,
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


// associations

Product.hasMany(Trending, {foreignKey: 'product_id'});
Trending.belongsTo(Product, {foreignKey: 'product_id'});


module.exports = Trending