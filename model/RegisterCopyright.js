const Model = require('./Model.js')


class RegisterCopyright extends Model{
  
    createRegisterCopyright = async (obj, callback) => {
      let query = "insert into paper (title, hashcode, updateTime, updateBy, author_identity, note) values (?, ?, ?, ?, ?, ?)";
      this.connection.query({sql: query, values: [obj.title, obj.destination, this.toSqlDatetime(Date.now()), obj.registerName, obj.authorIds, obj.note] }, callback)
    }

    // insertPaper_pk = async (obj, callback) => {
    //   let query = "insert into paper_pk (username, paper_id, ownership, status) "
    // }
   
    toSqlDatetime = (inputDate) => {
      const date = new Date(inputDate)
      const dateWithOffest = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      return dateWithOffest
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ')
  }
    
  }
  
  const registerCopyright = new RegisterCopyright();

  module.exports = registerCopyright;
  