# CS_Virtual_Assistant


Virtual Assistant created by Joseph Gaede, Hasun Khan, Chad Manning, and Julian Villarreal

## Installation


To run locally on windows:

install gitbash

install postgres

Set up the credentials for the database 
Change /db/db.js to reflect your credentials for the database
Build the database in PSQL 
'''
\i path_to_file\spdb.sql
\i path_to_file\insert.sql 
'''

install nodejs version v14.15.5

Run this command in the terminal while in the directory
'''
npm i
'''

Set the environment variable
Will be different depending on OS
'''
$env:GOOGLE_APPLICATION_CREDENTIALS="[PATH_TO \my-key.json]"
'''

Start the server 
'''
node app.js
''

Go to localhost:3000 on the browser