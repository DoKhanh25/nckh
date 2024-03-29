const argon2 = require('argon2')
const Model = require('./Model.js')

class Info extends Model{
    
    getInformation = async (username, callback) => {
        let query = "select fullname, email, birthday, job, organization, address, avatar, author_identity from account_info where username = ?";
        this.connection.query({ sql: query, values: [username]}, callback);
    }

    getAllInformation = async (callback) => {
        let query = "select username, fullname, author_identity from account_info ";
        this.connection.query({ sql: query}, callback);
    }

    createAuthorInformation = async (obj, callback) => {
        let query = "insert into account_info (username, fullname, email, birthday, job, organization, address, author_identity) values ";
        query += "(? , ?, ?, ?, ?, ?, ?, ?)"
        this.connection.query({ sql: query, values: [
            obj.username, obj.fullname, obj.email, this.toSqlDatetime(obj.birthday), obj.job, obj.organization, obj.address, obj.author_identity
        ]}, callback);
    }

    updateInfo = async(obj, username, callback) => {
        let query = "update account_info set fullname = ?, email = ? , birthday = ? , job = ? , organization = ? , address = ? , avatar = ? where username = ?";
        this.connection.query({sql: query, values: [
            obj.fullname, obj.email, this.toSqlDatetime(obj.birthday), obj.job, obj.organization, obj.address, obj.avatar, username
        ]}, callback);
    }

    toSqlDatetime = (inputDate) => {
        const date = new Date(inputDate)
        const dateWithOffest = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        return dateWithOffest
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ')
    }
    
}


const info = new Info();
module.exports = info;
