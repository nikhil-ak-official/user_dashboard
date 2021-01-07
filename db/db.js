const Sequelize = require('sequelize')
const mysql = require('mysql2')

// const mysqlConnection = new Sequelize('user_dashboard', 'root', process.env.MYSQL_PASSWORD, {
//     host: 'localhost',
//     dialect: 'mysql'
// });
const mysqlConnection = new Sequelize('heroku_9a66066370e9936', 'bde5318ebeaa85', process.env.MYSQL_PASSWORD_PRODUCTION, {
    host: 'us-cdbr-east-02.cleardb.com',
    dialect: 'mysql'
});

mysqlConnection.authenticate()
.then(() => console.log('Connected to database'))
.catch((err) =>  console.log('Cannot connect', err));

// (async() => {
//     await mysqlConnection.sync()
// })();

module.exports = mysqlConnection