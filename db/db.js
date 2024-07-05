const mysql = require ('mysql2')

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '12345',
  database : 'nodeflix',


});
 
connection.connect((error)=>{
  if (error){
    console.log('El error de conexión es : '+ error)
    return
  }
  console.log('Conectado a la base de datos MySQL')
});


module.exports = connection;