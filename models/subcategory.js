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

Subcategory.beforeCreate(async (subcategory,options)=>{
  const checkName = await Subcategory.findAll()
  checkName.forEach(e => {
    if(e.name.replace('/\s+/g','').trim().toLowercase() == subcategory.name.replace('/\s+/g','').trim().toLowercase()) {
      throw new Error('subcategory name already exist')
    }
  })
});

Subcategory.beforeUpdate(async (subcategory,options)=>{
  const checkName = await Subcategory.findAll()
  checkName.forEach(e => {
    if(e.name.replace('/\s+/g','').trim().toLowercase() == subcategory.name.replace('/\s+/g','').trim().toLowercase()) {
      throw new Error('subcategory name already exist')
    }
  })
});

  // associations

  Category.hasMany(Subcategory, {foreignKey: 'category_id'});
  Subcategory.belongsTo(Category, {foreignKey: 'category_id'});

  module.exports = Subcategory