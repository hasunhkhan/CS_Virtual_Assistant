const pg = require("pg");
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "seniorproject",
  password: "",
  port: "5432"
});
module.exports = pool;






/*
//test query to db
const testQuery = (request, response) => {
    pool.query("SELECT version();", (err, res) => {
      if (err) {
        throw err
      }
      response.status(200).send(res.rows[0]);
    });
}
*/
/*
module.exports = {
  testQuery
}
*/
