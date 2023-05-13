const mysql = require('mysql2/promise');

const DBConfig = {
  development: process.env.DB_host,
};

const pool = mysql.createPool(DBConfig.development);

module.exports = pool;
