const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const express = require("express");
const https = require("https");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
  res.sendFile(__dirname+"/public/index.html");
})

app.listen(3000, function(){
  console.log("Server running.");
})


app.post("/", async function(req, res){
    const query = req.body.text;

    const projectId= "csubassistant-jnvv";
    const response = await runSample(projectId, query);
    console.log(response);
    res.send(response);
});

async function runSample(projectId= "csubassistant-jnvv", text) {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

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
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) { //add        fulfillment for db query
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  let responseText = await result.fulfillmentText;
  console.log(responseText);
  return await responseText;
}
