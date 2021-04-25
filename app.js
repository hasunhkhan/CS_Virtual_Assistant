//Dependencies
//from testdbintegration branch
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const express = require("express");
const https = require("https");
const { WebhookClient } = require("dialogflow-fulfillment");
const session = require("express-session");
const pool = require("./db/db");



//include functions
const { test, gpa, counselor, professor
  , allGrades, userInfo, weather, joke } = require(__dirname+"/dialogflow_functions");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
//db test app.post("/testdb", db.testQuery);

//******************ROUTES****************************************************//
//route to handle dialogflow post requests
//need to use ngrok because dialogflow requires
//a public https ip
app.post("/dialogflow",(req, res) =>{
  console.log("In post request");
  const agent = new WebhookClient({ request: req, response: res });
  let intentMap = new Map();
  //mapping intents with functions
  intentMap.set("test", test);
  intentMap.set("GPA", gpa);
  intentMap.set("counselor", counselor);
  intentMap.set("professor", professor);
  intentMap.set("allGrades", allGrades);
  intentMap.set("userInfo", userInfo);
  intentMap.set("weather", weather);
  intentMap.set("joke", joke);
  agent.handleRequest(intentMap);
});

//on HTTP get
app.get("/", (req, res) =>{
  console.log("GET landing page")
  res.sendFile(__dirname+"/public/index.html");
})

//redirect here if user and pass were correct
app.get("/home", function(req, res){
  if(req.session.loggedin){
    res.sendFile(__dirname+"/chatbot.html")
  }else{
    res.send("You must be logged in to view this page.")
  }
})

//authentication logic here
app.post("/auth", async (req,res) =>{
  console.log(req.body.username);
  console.log(req.body.password);
  let username = req.body.username;
  let password = req.body.password;
  if(username && password){
    try{
      var queryTest = await pool.query("SELECT * FROM USERINFO WHERE "
      + `U_EMAIL='${username}' AND PASSWORD='${password}'`);
      console.log(queryTest.rowCount);
    } catch(err){
      console.error(err.message);
    }
    if(queryTest.rowCount > 0){
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect("/home");
    } else {
      res.send("Incorrect user name or password!");
    }
    res.end();
  } else{

    res.send("Please enter your correct username and password");
    res.end();
  }

})

//On post
app.post("/home", async function(req, res){
    const query = req.body.text;
    const projectId= "csubassistant-jnvv";
    const response = await runSample(projectId, query);
    res.send(response);
});

//****************************************************************************//
app.listen(3000, function(){
  console.log("Server running on port 3000\n");
})
//runSample provided by google
// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
async function runSample(projectId= "csubassistant-jnvv", text) {
  // A unique identifier for the given session
  const sessionId = uuid.v4();
  console.log("In runSample")
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: text,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };
  // Send request and log result
  const responses = await sessionClient.detectIntent(request);// this is when df does post request?
  console.log('Server side Detected intent');
  const result = responses[0].queryResult;
  console.log(`Server side Query: ${result.queryText}`);
  console.log(`Server side Response: ${result.fulfillmentText}`);
  //fields (if applicable) for database queries console.log(result.parameters);
  /*if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }*/
  let responseText = result.fulfillmentText;
  return responseText;
}
