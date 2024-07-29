const mysql = require('mysql2');

// creates a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mypasswordis12345%',
  database: 'studentdb'
});

// connect to database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

module.exports = connection;
