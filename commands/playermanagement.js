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
        } else {
          msg.reply(`Did not successfully add player.`)
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
      level = args[1];
      if (mentioned) {
        discordUserID = mentioned.id;
      } else {
        discordUserID = msg.author.id;
      }
      if (level < 1 || level > 50) {
        //not currently checking to ensure an integer, number.isinteger wasn't working
        msg.reply(`Invalid value entered for level. Please enter an integer between 1 and 50.`);
      } else {
          model.updatePower(args[0], level, discordUserID, (value) => {
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
      // !updatetier Name MaxPlayers PrefPlayers @DiscordRole
      role = getFirstRoleMention(msg);
      if (!role)
        msg.reply("Must specify a discord role for the tier");
      model.updateTier(args[0], args[1], args[2], role.id, (success) => {
        if (success) {
          msg.reply(`Successfully updated tier ${args[0]}`);
        } else {
          msg.reply(`Failed to update tier`);
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
    },
    updatename : (msg, args) => {
      // !updatename newname oldname or DiscordMention
      mentioned = getFirstUserMention(msg);
      discordUserID = null;
      oldName = "";
      if (mentioned){
        discordUserID = mentioned.id;
      } else {
        oldName = args[1];
      }
      newName = args[0];
      model.updatePlayerName(discordUserID, oldName, newName, (success, reason) => {
        if  (success) {
          if (discordUserID) {
            msg.reply(`Successfully renamed <@${discordUserID}> to ${newName}`);
          } else if (oldName) {
            msg.reply(`Successfully renamed ${oldName} to ${newName}`);
          }
        } else {
          msg.reply(`Failed to rename player: ${reason}`);
        }
      });
    },
    addrole : (msg, args) => {
      // !addrole rolename @DiscordRole (optional)
      role = getFirstRoleMention(msg);
      if (!role) {
        roleid = null;
      } else {
        roleid = role.id;
      }
      model.addRole(args[0], roleid, (success) => {
        if (success) {
          msg.reply(`Successfully added role ${args[0]}`);
        } else {
          msg.reply(`Failed to add role`);
        }
      });
    },
    updaterole : (msg, args) => {
      // !updaterole oldname newname @newDiscordRole (optional)
      role = getFirstRoleMention(msg);
      if (!role)  {
        roleid = null;
      } else {
        roleid = role.id;
      }
      if (!args[1]) {
        newname = args[0];
      } else {
        newname = args[1];
      }
      model.updateRole(args[0], newname, roleid, (success) => {
        if (success) {
          msg.reply(`Successfully updated role ${args[0]}`);
        } else {
          msg.reply(`Failed to update role`);
        }
      });
    },
  }
};
