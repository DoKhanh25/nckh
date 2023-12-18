const mysql = require('mysql');
const argon2 = require('argon2')
const Model = require('./Model.js')


class User extends Model{

  createUser = async (username, password, callback) => {
    let stringQuery = 'insert into account values (?, ?, 1)';
    const hashedPassword = await argon2.hash(password);
    this.connection.query({ sql: stringQuery, values: [username, hashedPassword]}, callback);
  }
  findUser = async (username, callback) => {
    let findUserString = 'Select username from account where username = ?';
    this.connection.query({ sql: findUserString, values: [username]}, callback);
  }
  findPassword = async (username, callback) => {
    let getHashedPassword = 'Select password, role from account where username = ?';
    this.connection.query({ sql: getHashedPassword, values: [username]}, callback);

  }
}

const user = new User();
module.exports = user;


