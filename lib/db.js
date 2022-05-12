const mysql = require('mysql2/promise')
const { logger } = require('./winston')
require('dotenv').config()

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env

let pool = mysql.createPool({
  // host 바꾸기
  host: DB_HOST,
  user: DB_USER,
  port: 3306,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  connectionLimit: 30,
})

console.log(`host : ${DB_HOST}\nuser : ${DB_USER} \npassword : ${DB_PASSWORD}\ndatabase : ${DB_DATABASE}
`)

pool.on('acquire', function (connection) {
  console.log(`커넥션 풀에서 ${connection.threadId} 번 커넥션 수령 (Message)`)
})

pool.on('connection', function (connection) {
  connection.query('SET SESSION auto_increment_increment=1')
})

pool.on('release', function (connection) {
  console.log(`커넥션 풀에 ${connection.threadId} 번 커넥션 반납 (Message)`)
})

setInterval(function () {
  logger.info(`DB Ping | ${Date()}`)
  pool.query('SELECT 1').then(() => {})
}, 1000 * 60 * 60)

module.exports = pool
