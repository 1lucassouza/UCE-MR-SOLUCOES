const mysql = require('mysql2')


const conn = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234', 
  database: process.env.DB_NAME || 'mr_solucoes',
  charset: 'utf8mb4',
  connectionLimit: 10
})

module.exports = conn
