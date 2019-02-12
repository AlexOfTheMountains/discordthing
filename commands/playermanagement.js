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
      // !listplayers
      model.listPlayers((rows) => {
        string = "";
        for (row in rows)
        {
          row = rows[row];
          console.log(row); //do we still need this log?
          discord = row.discordid ? `: <@${row.discordid}>` : ""
          string += `Player: ${row.name} ${discord}\n`;
        }
        msg.channel.send(string);
      });
    },
    updatepower : (msg, args) => {
      // !updatepower power level(1-50) discordMention(optional)
      mentioned = getFirstUserMention(msg);
      discordUserID = null;
      if (mentioned) {
        discordUserID = mentioned.id;
      } else {
        discordUserID = msg.author.id;
      }
      if (args[1] < 1 || args[1] > 50) {
        //not currently checking to ensure an integer, number.isinteger wasn't working
        msg.reply(`Invalid value entered for level. Please enter an integer between 1 and 50.`);
      } else {
          model.updatePower(args[0], args[1], discordUserID, (value) => {
          if (value) {
            name = value.name;
            //need to get the following message to output username insteaed of discord id or playername
            msg.reply(`Successfully updated power to ${args[0]} and level to ${args[1]} for ${name}`);
          } else {
            msg.reply(`Did not successfully update.`)
          }
        });
      }
    },
  }
};
