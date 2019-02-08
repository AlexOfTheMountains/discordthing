const Discord = require('discord.js');
const token = require('./token.json');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});


client.login(token.token);
