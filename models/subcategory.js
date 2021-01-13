const mysqlConnection = require("../db/db");
const {Sequelize} = require('sequelize');
const Category = require("./category");

const Subcategory = mysqlConnection.define('Subcategories', {
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
      }
    },
    category_id: {
      type: Sequelize.STRING,
      allowNull: false
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

  Category.hasMany(Subcategory);
  Subcategory.belongsTo(Category);

  module.exports = Subcategory