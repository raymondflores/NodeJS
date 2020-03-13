const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'shopdb',
  password: 'theArtofwar!'
});

module.exports = pool.promise();
