const Discord = require('discord.js');
const token = require('./token.json');

const client = new Discord.Client();

const prefix = '!';

commands = {};

function addCmds(path)
{
  cmds = require(path).commands;

  for (cmd in cmds)
  {
    commands[cmd] = cmds[cmd];
  }
}

addCmds('./commands/nice.js');

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

  if (commands[cmd])
  {
    commands[cmd](msg, args);
  }
});

client.login(token.token);
