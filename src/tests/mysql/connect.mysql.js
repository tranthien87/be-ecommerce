const mysql = require('mysql2')

const pool = mysql.createPool({
    host:'localhost',
    user: 'root',
    password: 'aa1234aa',
    databse: 'shopdev'
})