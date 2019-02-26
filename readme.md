# Discord Bot
## Setup
* Checkout the repository
  
	`git clone https://github.com/AlexOfTheMountains/discordthing.git`

**or**, if you've set up an SSH key with github:

	`git clone git@github.com:AlexOfTheMountains/discordthing.git`

* Set up the node stuff
  
  `npm install`

* Create a local token file called token.json with the contents:
 
 ```javascript
 {
 		"token" : "<token contents from discord>"
 }
 ```
 The token content should be treated as a secret, there's no need to share it with anyone else and it shouldn't be checked into the repository as that's public.  You'll note that there is a token in the history of the repository; that's no longer a valid token.
* Copy the database from db/empty.db to db/test.db

## Running it
At the command line:

`node index.js`

It should start and connect to the discord instance.  It's probably best to have your own test server.  Contact Doralina to be added to the discord developer team.  This will allow you to create an instance of the bot to add to your server.
