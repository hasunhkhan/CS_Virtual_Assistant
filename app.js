//Dependencies
//from testdbintegration branch
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const express = require("express");
const https = require("https");
const app = express();

const { WebhookClient } = require("dialogflow-fulfillment");
const { test } = require(__dirname+"/testdf");

const db = require(__dirname+"/db/queries");
app.post("/testdb", db.testQuery);

//route to handle dialogflow post requests
app.post("/dialogflow", express.json(),(req, res) =>{
  console.log("test");

  const agent = new WebhookClient({ request: req, response: res });
  let intentMap = new Map();
  intentMap.set("test", test);
  agent.handleRequest(intentMap);
});

//body parser
app.use(express.urlencoded({extended: true}));
//include public files
app.use(express.static(__dirname + "/public"));
//on HTTP get
app.get("/", function(req, res){
  console.log("New get request");
  res.sendFile(__dirname+"/public/index.html");
})

app.listen(3000, function(){
  console.log("Server running on port 3000\n");
})

//On post
app.post("/", async function(req, res){
    const query = req.body.text;

    const projectId= "csubassistant-jnvv";
    const response = await runSample(projectId, query);
    res.send(response);
});

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
  console.log("test1")
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
  }
  */
  let responseText = await result.fulfillmentText;
  return await responseText;
}
