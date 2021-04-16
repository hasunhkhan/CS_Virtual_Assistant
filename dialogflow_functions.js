//functions for dialogflow and db queries
//queries would be different for each STUDENT
//currently only working for default. Would need to have a login page or
//something to select a valid student then change queries to match respective student

async function test(agent){//with 'agent' obj can grab params
  try{
    console.log("In test function");
    const queryTest = await pool.query("SELECT * FROM STUDENT");
    console.log(queryTest.rows[0].s_name);
    queryResult = queryTest.rows[0].s_name;
  }catch (err){
    console.error(err.message);
  }

  agent.add("Hello from the post request~! Here is a "+"  \n"+"test query: "+queryResult);
}

async function gpa(agent){
  try{
    console.log("In gpa function");
    const queryTest = await pool.query("SELECT GPA()");
    console.log(queryTest.rows[0]);
    queryResult = queryTest.rows[0].gpa;
  }catch (err){
    console.error(err.message);
  }

  agent.add("No problem! Your current GPA is: "+queryResult);
}

async function counselor(agent){
  try{
    console.log("In counselor function");
    const queryTest = await pool.query("SELECT * FROM COUNSELOR");
    console.log(queryTest.rows[0].c_name);
    queryResult = queryTest.rows[0];

  }catch (err){
    console.error(err.message);
  }

  agent.add("Your counselor is: "+queryResult.c_name+
  ". She is in room number: "+queryResult.office);
}

//working
async function professor(agent){
  let className;
  try{
    console.log("In professor function");
    console.log(agent.parameters.class)
    className = agent.parameters.class;
    const queryTest = await pool.query("SELECT P_EMAIL FROM PROFESSOR WHERE CLASS="+'\''+className+'\'');
    console.log(queryTest.rows[0].p_email);
    queryResult = queryTest.rows[0].p_email;

  }catch (err){
    console.error(err.message);
  }

  agent.add("Your professors email for "+className+" is: "+queryResult);
}

async function allGrades(agent){
  try{
    console.log("In allGrades function");
    const queryTest = await pool.query("SELECT * FROM Grades");
    console.log(queryTest.rows);
    console.log(queryTest.rowCount);
    let stringClasses = queryTest.rows[0].class;
    let stringGrades = queryTest.rows[0].grade;
    for(i = 1; i < queryTest.rowCount; i++){
      stringClasses += ", "+queryTest.rows[i].class+" ";
      stringGrades += ", "+queryTest.rows[i].grade+" ";
    }
    console.log(stringClasses);
    console.log(stringGrades);
    //should be a better way of doing this
    queryResult = stringClasses+" are: "+stringGrades;

  }catch (err){
    console.error(err.message);
  }

  agent.add("Your current grades for the following classes : "+queryResult);
}

async function userInfo(agent){
  try{
    console.log("In userInfo function");
    //would change depending on user
    //u name = logged in student
    const queryTest = await pool.query("SELECT USERID, U_EMAIL FROM USERINFO WHERE U_NAME='John'");
    console.log(queryTest);
    console.log(queryTest.rows[0]);
    queryResult = queryTest.rows[0];

  }catch (err){
    console.error(err.message);
  }
  let uEmail = queryResult.u_email;
  let userid = queryResult.userid;
  agent.add("Your information is as follows: CSUB id: "+userid+" , CSUB Email: "+uEmail);
}

/*async function weather(agent){
  const query = "Bakersfield";
  const apiKey = "";
  const unit = "imperial";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;
  console.log(url);
  https.get(url, function(response){ //on response object
    console.log("statusCode: ", response.statusCode);
    //we set encoding to be a specific type
    //data is an event. emitted by response object. when data event occurs do funct
    //data is a predefined event by node. we listen for when data occurs
    //and do the function callback in second argument
    //wire attached to response object
    //we listen for when data event occurs
    //function is attached to named 'data' event
    //this function is then called synchrnously.
    //data as arg is any name
    //we then log the data we get.
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.weather[0].description; //access specific named values in object
      console.log(temp);
    };
    agent.add("The weather is currently: ");
  }
}*/


module.exports = { test: test, gpa: gpa, counselor: counselor
  , professor: professor, allGrades: allGrades, userInfo: userInfo};
const pool = require("./db/db");
