const mysql = require('mysql2')
class Model {
    connection = mysql.createPool({
        host     : 'localhost',
        port     : '3306',
        user     : 'root',
        password : '123456a@',
        database: 'nckh2023',
        connectionLimit: 20
    })
    
}
module.exports = Model;