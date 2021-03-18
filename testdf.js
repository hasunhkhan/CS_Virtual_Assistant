function test(agent){

  
  agent.add("Hello from the post request~!");
}

module.exports = { test: test};
const db = require(__dirname+"/db/queries");
