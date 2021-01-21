const mysqlConnection = require('../db/db')
const {Sequelize} = require('sequelize')

const Category = mysqlConnection.define('Categories', {
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
          throw new Error('Please enter valid category name')
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

Category.beforeCreate(async (category,options)=>{
  const checkName = await Category.findAll()
    checkName.forEach(e => {
      let name = e.dataValues.name
      if(name.replace('/\s+/g','').trim().toLowerCase() == category.name.replace('/\s+/g','').trim().toLowerCase()) {

      throw new Error('category name already exist')
    }
  })
});


Category.beforeUpdate(async (category,options)=>{
  const checkName = await Category.findAll()
  checkName.forEach(e => {
    let name = e.dataValues.name
    if(name.replace('/\s+/g','').trim().toLowerCase() == category.name.replace('/\s+/g','').trim().toLowerCase()) {
      throw new Error('category name already exist')
    }
  })
});

module.exports = Category