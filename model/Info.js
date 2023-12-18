const mysql = require('mysql');
const argon2 = require('argon2')
const Model = require('./Model.js')

class Info extends Model{
    
    getInformation = async (username, callback) => {
        let query = "select fullname, email, birthday, job, organization, address, avatar from account_info where username = ?";
        this.connection.query({ sql: query, values: [username]}, callback);
    }

    createAuthorInformation = async (obj, callback) => {
        let query = "insert into account_info (username, fullname, email, birthday, job, organization, address, avatar) values ";
        query += "(? , ?, ?, ?, ?, ?, ?, ?)"
        this.connection.query({ sql: query, values: [
            obj.username, obj.fullname, obj.email, obj.birthday, obj.job, obj.organization, obj.address, obj.avatar
        ]}, callback);
    }
}


const info = new Info();
module.exports = info;
