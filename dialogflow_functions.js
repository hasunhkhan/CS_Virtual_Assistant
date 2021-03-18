//functions for dialogflow and db queries

async function test(agent){//with 'agent' obj can grab params
  try{
    console.log("In test function");
    const queryTest = await pool.query("SELECT VERSION()");
    console.log(queryTest.rows[0]);
    //should be a better way of doing this
    queryResult = queryTest.rows[0].version;
  }catch (err){
    console.error(err.message);
  }

  agent.add("Hello from the post request~! Here is a test query: "+queryResult);
}

module.exports = { test: test};
const pool = require("./db/db");
