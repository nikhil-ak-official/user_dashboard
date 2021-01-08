const Sequelize = require('sequelize')
const mysql = require('mysql2')

// const mysqlConnection = new Sequelize('user_dashboard', 'root', process.env.MYSQL_PASSWORD, {
//     host: 'localhost',
//     dialect: 'mysql'
// });
const mysqlConnection = new Sequelize('dbdashbo', 'usrdashbo', process.env.MYSQL_PASSWORD_PRODUCTION, {
    host: '3.231.80.163',
    dialect: 'mysql'
});

mysqlConnection.authenticate()
.then(() => console.log('Connected to database'))
.catch((err) =>  console.log('Cannot connect', err));

// (async() => {
//     await mysqlConnection.sync()
// })();

module.exports = mysqlConnection