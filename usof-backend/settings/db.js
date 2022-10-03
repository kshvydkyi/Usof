const mysql = require('mysql2');
const config = require('../config');
const connection = mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.NAME
});

connection.connect((error) => {
    if(error) return console.log('Помилка при підключенні до бази даних');
    else return console.log('Підключення до бази даних пройшло успішно');
});

module.exports = connection.promise();


