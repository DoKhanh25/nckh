const Model = require('./Model.js')


class RegisterCopyright extends Model{
  
    createRegisterCopyright = async (obj, callback) => {
      let query = "insert into paper (title, hashcode, updateTime, updateBy, author_identity, note) values (?, ?, ?, ?, ?, ?)";
      this.connection.query({sql: query, values: [obj.title, obj.destination, this.toSqlDatetime(Date.now()), obj.registerName, obj.authorIds, obj.note] }, callback)
    }

    getCopyrightByUsername = async (username, callback) => {
      let query = "select paper_pk.username, paper_pk.status, paper.title, paper.note, paper.author_identity, paper.updateTime, paper.updateBy";
      query += " from paper_pk inner join paper on paper_pk.paper_id = paper.id";
      query += " where paper_pk.username = ?";
      this.connection.query({sql: query, values: [username] }, callback);
    }

    insertDataToPaper_PK = async (authorAccs, paperId, callback) => {
      let query = "insert into paper_pk (username, paper_id, ownership, status) values (?, ?, ?, ?)";
      
      authorAccs.forEach(element => {
        this.connection.query({sql: query, values: [element, paperId, 1, 0 ]}, callback);
      });
      

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
  