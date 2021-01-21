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
        validator(value) {
          const alpha = /^[a-zA-Z ]*$/;
          if(!value.match(alpha)) {
            throw new Error('Please enter valid subcategory name')
          }
        }
      },
      set(value) {
        this.setDataValue('name',value.trim().toLowerCase())
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

  Category.hasMany(Subcategory, {foreignKey: 'category_id'});
  Subcategory.belongsTo(Category, {foreignKey: 'category_id'});

  module.exports = Subcategory