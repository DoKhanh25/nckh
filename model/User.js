const mysql = require('mysql');
const argon2 = require('argon2')
const Model = require('./Model.js');
const { use } = require('../controller/auth.js');


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
  createUser_info = async (fullname, email, birthday, job,organization,address,avatar, callback) => {
    let stringQuery = 'insert into account (fullname, email, birthday, job, organization, address, avatar) values ?'
    this.connection.query({sql: stringQuery,values: [fullname, email, birthday, job, organization, address, avatar]}, callback)
  }

  updateUser_fullname = async(fullname,userId, callback) => {
    let stringQuery = `UPDATE account SET fullname = ? WHERE id = ${userId}`
    this.connection.query({sql: stringQuery, values: [fullname]}, callback)
  }
  updateUser_email = async(email,userId, callback) => {
    let stringQuery = `UPDATE account SET email = ? WHERE id = ${userId}`
    this.connection.query({sql: stringQuery, values: [email]}, callback)
  }
  updateUser_birthday = async(birthday, userId, callback) => {
    let stringQuery = `UPDATE account SET birthday = ? WHERE id = ${userId}`
    this.connection.query({sql: stringQuery, values: [birthday]}, callback)
  }
  updateUser_job = async(job,userId, callback) => {
    let stringQuery = `UPDATE account SET job = ? WHERE id = ${userId}`
    this.connection.query({sql: stringQuery, values: [job]}, callback)
  }
  updateUser_organization = async(organization,userId, callback) => {
    let stringQuery = `UPDATE account SET organization = ? WHERE id = ${userId}`
    this.connection.query({sql: stringQuery, values: [organization]}, callback)
  }
  updateUser_address = async(address,userId, callback) => {
    let stringQuery = `UPDATE account SET address = ? WHERE id = ${userId}`
    this.connection.query({sql: stringQuery, values: [address]}, callback)
  }
  updateUser_avatar = async(avatar,userId, callback) => {
    let stringQuery = `UPDATE account SET avatar = ? WHERE id = ${userId}`
    this.connection.query({sql: stringQuery, values: [avatar]}, callback)
  }
  
}

const user = new User();
module.exports = user;


