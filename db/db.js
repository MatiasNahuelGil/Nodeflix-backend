import mysql from "mysql2";

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Matias-619',
  database : 'nodeflix'


});
 
connection.connect();

//module.exports = connection;
export const db = connection;