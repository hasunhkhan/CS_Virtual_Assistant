const pg = require("pg");
const pool = new pg.Pool({
//local default settings
user: "postgres",
host: "localhost",
database: "postgres",
password: "",//your pass
port: "5432"});//default port

//test query to db
const testQuery = (request, response) => {
    pool.query("SELECT version();", (err, res) => {
      if (err) {
        throw err
      }
      response.status(200).send(res.rows[0]);
    });
}

module.exports = {
  testQuery
}
