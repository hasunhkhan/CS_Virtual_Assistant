const pg = require("pg");
const pool = new pg.Pool({
//local default settings
user: "postgres",
host: "localhost",
database: "postgres",
password: "",//your pass
port: "5432"});//default port
//test query to db
pool.query("SELECT version();", (err, res) => {
console.log(err, res);
pool.end();
});
