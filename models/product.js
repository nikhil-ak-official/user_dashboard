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
    unique:true,
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

Category.hasMany(Product, {foreignKey: 'category_id'});
Product.belongsTo(Category, {foreignKey: 'category_id'});

Subcategory.hasMany(Product, {foreignKey: 'subcategory_id'});
Product.belongsTo(Subcategory, {foreignKey: 'subcategory_id'});

module.exports = Product