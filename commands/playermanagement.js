const model = require('../model/model.js');

model.openDB('db/test.db');

function getFirstUserMention(msg)
{
  //if (msg.mentions.users.length() >= 1)
  {
    mentioned = msg.mentions.users.array();
    for (user in mentioned) {
      user = mentioned[user];
      if (user != null)
        return user;
    }
  }
  return null;
}

module.exports = {
  commands: {
    addplayer : (msg, args) => {
      // !addplayer playername discordMention
      mentioned = getFirstUserMention(msg);
      discordUserID = null;
      if (mentioned) {
        discordUserID = mentioned.id;
      }
      model.addPlayer(args[0], discordUserID, (success) => {
        if (success) {
          msg.reply(`Successfully added ${args[0]}`);
        }
      });
    },
    listplayers : (msg, args) => {
      model.listPlayers((rows) => {
        string = "";
        for (row in rows)
        {
          row = rows[row];
          console.log(row);
          discord = row.discordid ? `: <@${row.discordid}>` : ""
          string += `Player: ${row.name} ${discord}\n`;
        }
        msg.channel.send(string);
      });
    }
  }
};
