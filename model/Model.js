const mysql = require('mysql')
class Model {
    connection = mysql.createPool({
        host     : 'localhost',
        port     : '3310',
        user     : 'root',
        password : '123456a@',
        database: 'nckh2023',
        connectionLimit: 20
    })
    
}
module.exports = Model;