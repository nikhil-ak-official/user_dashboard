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
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'Users',
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
})

User.hasOne(Cart, {foreignKey: 'user_id'});
Cart.belongsTo(User, {foreignKey: 'user_id'})

module.exports = Cart