const mysql = require('mysql2');
const config = require('../config');
const connection = mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.NAME
});

connection.connect((error) => {
    if(error) return console.log('An error occurred while connecting to the database');
    else return console.log('The connection to the database was successful');
});

module.exports = connection.promise();


