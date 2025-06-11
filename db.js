const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // sua senha aqui
  database: 'sistema_login'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('🟢 Conectado ao MySQL');
});

module.exports = connection;
