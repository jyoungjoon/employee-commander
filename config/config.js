const mysql = require('mysql2');
const util = require('util');
require('dotenv').config();

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

db.connect();

db.query = util.promisify(db.query);

module.exports = db;
