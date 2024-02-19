const Model = require('./Model.js');
const user = require('./User.js');

class RegisterCopyright extends Model{
  
    createRegisterCopyright = async (obj, callback) => {
      let query = "insert into paper (title, hashcode, updateTime, updateBy, author_identity, note, status) values (?, ?, ?, ?, ?, ?, ?)";
      this.connection.query({sql: query, values: [obj.title, obj.destination, this.toSqlDatetime(Date.now()), obj.registerName, obj.authorIds, obj.note, 0] }, callback)
    }

    getCopyrightByUsername = async (username, callback) => {
      let query = "select paper.id, paper_pk.username, paper.status, paper.title, paper.note, paper.author_identity, paper.updateTime, paper.updateBy";
      query += " from paper_pk inner join paper on paper_pk.paper_id = paper.id";
      query += " where paper_pk.username = ?";
      this.connection.query({sql: query, values: [username] }, callback);
    }

    getAllCopyright = async (callback) => {
      let query = "select paper.id, paper.status, paper.title, paper.note, paper.author_identity, paper.updateTime, paper.updateBy from paper";
      this.connection.query({sql: query }, callback);
    }

    getDownloadFilePath = async (paperId, callback) => {
      let query = "select hashcode from paper where id = ?";
      this.connection.query({sql: query, values: [paperId]}, callback);
    }

    insertDataToPaper_PK = async (authorAccs, paperId, callback) => {
      let query = "insert into paper_pk (username, paper_id, ownership) values (?, ?, ?)";
      
      authorAccs.forEach(element => {
        this.connection.query({sql: query, values: [element, paperId, 1 ]}, callback);
      });
    }



    getPaperIdByUsername = async (username, callback) => {
      let query = "select paper_id from paper_pk where username = ?"
      this.connection.query({sql: query, values: [username ]}, callback);
    }

    getPaperByID = async(paperId, callback) => {
      let query = "select * from paper where id = ?";
      this.connection.query({sql: query, values: [paperId]}, callback);
    }


    updateStatus = async (id, callback) => {
      let query = "update status = 1 from paper where id = ?";
      this.connection.query({sql: query, values: [id ]}, callback);
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
  
  const registerCopyright = new RegisterCopyright();

  module.exports = registerCopyright;
  