const argon2 = require('argon2')
const Model = require('./Model.js');


class User extends Model{

  createUser = async (username, password, callback) => {
    let stringQuery = 'insert into account values (?, ?, 1)';
    const hashedPassword = await argon2.hash(password);
    console.log(stringQuery);
    this.connection.query({ sql: stringQuery, values: [username, hashedPassword]}, callback);
  }
  findUser = async (username, callback) => {
    let findUserString = 'Select username from account where username = ?';
    console.log(findUserString)
    this.connection.query({ sql: findUserString, values: [username]}, callback);
  }
  findPassword = async (username, callback) => {
    let getHashedPassword = 'Select password, role from account where username = ?';
    this.connection.query({ sql: getHashedPassword, values: [username]}, callback);

  }
  changePassword = async (object, username, callback) => {
    let query = 'update account set password = ? where username = ?';
    const hashedPassword = await argon2.hash(object.newPassword);
    this.connection.query({ sql: query, values: [hashedPassword, username]}, callback);

  }

  
}

const user = new User();
module.exports = user;


