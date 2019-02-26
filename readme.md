# Discord Bot
## Setup
* Install node.js, see: https://nodejs.org/en/
* Get added to discord developer project team, see https://discordapp.com/developers/applications/
** To get this done Dora will need to invite you to the team that will send you an email (yes really) with a link to accept the invite. it will also turn 2 factor authentication on on your discord account which is a bit of a pita..sorry
* Sign up for a github account, see: https://github.com
* if you're on windows, install git, see: https://git-scm.com
** if you're on mac you may need to install xcode
** if you're on linux you're cool with figuring it out
* Checkout the repository (insert following command in a terminal after navigating to the directory you want your source checked into)

```sh
git clone https://github.com/AlexOfTheMountains/discordthing.git
```

**or**, if you've set up an SSH key with github: (also type into terminal after navigating to the directory you want your source checked into)

```sh
git clone git@github.com:AlexOfTheMountains/discordthing.git
```

* Set up the node stuff (yet another terminal command, navigate to inside your new discordthing directory first)

  `npm install`

* Get the bot token from the discord project for use in the next step
** Go to TheMachine Application in your discord developer portal, then click bot on the left, then click on "click to reveal your token". Use that token in the next step where <token contents from discord> is listed
* In your new discordthing directory, create a local token file called token.json with the contents:

 ```javascript
 {
   "token" : "<token contents from discord>"
 }
 ```
 The token content should be treated as a secret, there's no need to share it with anyone else and it shouldn't be checked into the repository as that's public.  You'll note that there is a token in the history of the repository; that's no longer a valid token.
* Copy the database from db/empty.db to db/test.db

## Running it
At the command line (also from inside the discordthing directory):

```sh
node index.js
```

It should start and connect to the discord instance.  It's probably best to have your own test server.  Contact Doralina to be added to the discord developer team.  This will allow you to create an instance of the bot to add to your server.
