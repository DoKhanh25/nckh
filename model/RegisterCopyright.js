const Model = require('./Model.js');
const user = require('./User.js');

class RegisterCopyright extends Model{
  
    createRegisterCopyright = async (obj, callback) => {
      let query = "insert into paper (title, path, updateTime, updateBy, author_identity, note, status, hashcode) values (?, ?, ?, ?, ?, ?, ?, ?)";
      this.connection.query({sql: query, values: [obj.title, obj.destination, this.toSqlDatetime(Date.now()), obj.registerName, obj.authorIds, obj.note, 0, obj.hash] }, callback)
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
      let query = "select path from paper where id = ?";
      this.connection.query({sql: query, values: [paperId]}, callback);
    }

    getHashFromPaper = async (callback) => {
      let query = "select hashCode from paper";
      this.connection.query({sql: query}, callback);
    }

    insertDataToPaper_PK = async (authorAccs, paperId, callback) => {
      let insertQuery = "insert into paper_pk (username, paper_id, ownership) values (?, ?, ?);";
      let query = "";
      let valueArray = [];
      for(let i = 0; i < authorAccs.length; i++){
        query = query  + insertQuery
      }
      
      authorAccs.forEach(element => {
        valueArray.push(element, paperId, 1);
      });
      console.log(query)
      console.log(valueArray)
      this.connection.query({sql: query, values: valueArray}, callback);

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
      let query = "update paper set status = 1 where id = ?";
      this.connection.query({sql: query, values: [id]}, callback);
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
  