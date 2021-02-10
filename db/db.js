const Sequelize = require('sequelize')
const mysql = require('mysql2')

const mysqlConnection = new Sequelize('user_dashboard', 'root', process.env.MYSQL_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
});
// const mysqlConnection = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.MYSQL_PASSWORD_PRODUCTION, {
//     host: process.env.DB_HOST,
//     dialect: 'mysql'
// });

mysqlConnection.authenticate()
.then(() => console.log('Connected to database'))
.catch((err) =>  console.log('Cannot connect', err));

(async() => {
    await mysqlConnection.sync({force: true})
})();

module.exports = mysqlConnection