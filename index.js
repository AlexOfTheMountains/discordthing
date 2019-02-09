const Discord = require('discord.js');
const token = require('./token.json');
const fs = require('fs');
const path = require('path');

const client = new Discord.Client();

const prefix = '!';

commands = {};

function addCmds(path)
{
  console.log("Adding commands :" + path);
  cmds = require(path).commands;

  for (cmd in cmds)
  {
    commands[cmd] = cmds[cmd];
  }
}

function addAllCmds(dir)
{
  fs.readdirSync(dir).forEach( f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ?
      walkDir(dirPath) : addCmds("./" + path.join(dir, f));
    });
}
addAllCmds('./commands');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
  if (msg.author.bot) return;

  msgArray = msg.content.split(" ");
  cmd = msgArray[0];
  args = msgArray.slice(1);

  if (cmd.startsWith(prefix))
  {
    cmd = cmd.substring(prefix.length);
  }
  else
    return

  cmd = cmd.toLowerCase();
  if (commands[cmd])
  {
    commands[cmd](msg, args);
  }
});

client.login(token.token);
