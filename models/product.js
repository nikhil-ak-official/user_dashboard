const mysqlConnection = require('../db/db')
const {Sequelize} = require('sequelize')
const Category = require('./category')
const Subcategory = require('./subcategory')


const Product = mysqlConnection.define('Products', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
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
      notIn: [['active', 'inactive']]
    }
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  subcategory_id: {
    type: Sequelize.INTEGER,
    allowNull: true
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

Category.hasMany(Product);
Product.belongsTo(Category);

Subcategory.hasMany(Product);
Product.belongsTo(Subcategory);

module.exports = Product