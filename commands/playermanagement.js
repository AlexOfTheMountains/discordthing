const model = require('../model/model.js');

model.openDB('db/test.db');

function getFirstUserMention(msg)
{
  mentioned = msg.mentions.users.array();
  for (user in mentioned) {
    user = mentioned[user];
    if (user != null)
      return user;
  }
  return null;
}

function getFirstRoleMention(msg)
{
  mentioned = msg.mentions.roles.array();
  console.log(msg.mentions);
  for (role in mentioned) {
    role = mentioned[role];
    if (role != null)
      return role;
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
            msg.reply(`Successfully updated power to ${args[0]} and level to ${args[1]} for ${name}`);
          } else {
            msg.reply(`Did not successfully update.`)
          }
        });
      }
    },
    addtier : (msg, args) => {
      // !addtier Name MaxPlayers PrefPlayers @DiscordRole
      role = getFirstRoleMention(msg);
      if (!role)
        msg.reply("Must specify a discord role for the tier");
      model.addTier(args[0], args[1], args[2], role.id, (success) => {
        if (success) {
          msg.reply(`Successfully added tier ${args[0]}`);
        } else {
          msg.reply(`Failed to add tier`);
        }
      });
    },
    updatetier : (msg, args) => {
      // !addtier Name MaxPlayers PrefPlayers @DiscordRole
      role = getFirstRoleMention(msg);
      if (!role)
        msg.reply("Must specify a discord role for the tier");
      model.updateTier(args[0], args[1], args[2], role.id, (success) => {
        if (success) {
          msg.reply(`Successfully updated tier ${args[0]}`);
        } else {
          msg.reply(`Failed to add tier`);
        }
      });
    },
    assignplayer : (msg, args) => {
      // !assignplayer PlayerName or DiscordMention TierName
      player = getFirstUserMention(msg);
      discordUserID = 0;
      playerName = "";
      if (player) {
        discordUserID = player.id;
      }
      else
        playerName = args[0];

      tier = args[1];
      model.assignTier(discordUserID, playerName, tier, (success, reason) => {
        if (success) {
          if (discordUserID)
            msg.reply(`Successfully assigned <@${discordUserID}> to ${tier}`);
          else if (playerName)
            msg.reply(`Successfully assigned ${playerName} to ${tier}`);
        } else {
          msg.reply(`Failed to assign player: ${reason}`);
        }
      });
    }
  }
};
