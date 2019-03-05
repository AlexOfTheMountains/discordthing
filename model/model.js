const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

let db = null;

function currentDate() {
  return new Date().toISOString();
}

module.exports = {
  openDB : function(path) {
    db = new sqlite3.cached.Database(path, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error("Failed to connect: " + err.message);
      } else {
        console.log(`Connected to database: ${path}`);
      }
    });
    return db != null;
  },
  closeDB : function() {
    db.close();
    db = null;
  },
  addPlayer : function(playerName, discordUserID, callback) {
    success = false;
    db.serialize( () => {
      db.run('INSERT INTO players(discordID) VALUES (?)', discordUserID, function(err) {
        rowid = null;
        if (!err) {
          rowid = this.lastID;
          db.run('INSERT INTO player_name(PlayerKey, name, date) VALUES((?), (?), (?))',
            rowid, playerName, currentDate(), (err) => {
            if (err) {
              console.error(err.message);
              callback(false);
            } else {
              console.log(`Added player ${playerName} with discordID ${discordUserID?discordUserID:'NULL'} and rowid ${rowid}`);
              callback(true);
            }
          });
        } else {
          console.error(err.message);
          callback(false);
        }
      });
    });
  },
  listPlayers : function(callback) {
    db.all('SELECT rowid as rowid, name as name, discordid as discordid from CurrentPlayerNames', (err, rows) => {
      if (!err)
      {
        callback(rows);
      } else {
        callback(null);
      }
    });
  },
  updatePower : function(score, level, discordUserID, callback) {
    success=false;
    db.serialize( () => { //first get playerkey from discordid
      key = null;
      //currentid = discordUserID
      db.get('SELECT rowid as rowid, name as name from CurrentPlayerNames WHERE DiscordID=?', discordUserID, (err, row) => {
        if (!err) {
          key = row.rowid;
          name = row.name;
          db.run('INSERT INTO player_powerscore(PlayerKey, date, power, level) VALUES((?),(?),(?),(?))',
            key, currentDate(), score, level, (err) => {
            if (err)  {
              console.error(err.message);
              callback(false);
            } else {
              console.log(`Added new power score for player with discordID ${discordUserID?discordUserID: 'NULL'}`);
              callback({name: name});
            }
          });
        } else {
          console.error(err.message);
          callback(false);
        }
      });
    });
  },
  updatePlayerName : function(discordUserID, oldName, newName, callback) {
    db.serialize( () => {
      db.get('SELECT rowid FROM CurrentPlayerNames WHERE DiscordID = ? or Name LIKE ?',
        discordUserID, oldName, (err, row) => {
          if (!err && row) {
            key = row.rowid;
            db.run('INSERT INTO player_name(PlayerKey, date, name) VALUES((?),(?),(?))',
              key, currentDate(), newName, (err) => {
                if(err) {
                  console.error(err.message);
                  callback(false, "Write Error");
                } else {
                  console.log(`Updated name for player to ${newName}`);
                  callback(true, null);
                }
              });
          } else {
            console.error(err.message);
            callback(false, "Unknown Player");
          }
      });
    });
  },
  addRole : function(roleName, discordRoleID, callback) {
    db.serialize( () => {
      console.log(`${roleName} ${discordRoleID}`);
      db.run('INSERT INTO role (Name, DiscordRoleID) VALUES(?, ?)',
        roleName, discordRoleID,
      function (err) {
        if (!err) {
          callback(true);
          console.log(`Added role ${roleName} with discordRoleID ${discordRoleID}`);
        } else {
          console.error(err.message);
        }
      });
    });
  },
  deleteRole : function(roleName, discordRoleID, callback) {
    db.serialize( () => {
      console.log(`${roleName} ${discordRoleID}`);
      db.get('SELECT rowid FROM role WHERE Name LIKE ?', roleName, (err, row) => {
        rolekey = row.rowid;
        db.run('DELETE FROM player_role WHERE RoleKey = ?',
          rolekey, function (err) {
          if (!err) {
            console.log(`Removed role ${roleName} from ${this.changes} players.`);
            db.run('DELETE FROM role WHERE rowid = ?', rolekey, function (err){
              if (!err) {
                console.log(`Removed role ${roleName} from database.`);
                callback(true, null);
              } else {
                console.error(err.message);
                callback(false, "Failed to delete role from database.");
              }
            });
          } else {
            console.error(err.message);
            callback(false, "Failed to remove role from players.");
          }
        });
      });
    });
  },
  updateRole : function(oldRoleName, newRoleName, newDiscordRole, callback) {
    db.serialize( () => {
      db.get('SELECT rowid FROM role WHERE Name LIKE (?)', oldRoleName, (err, row) => {
        if(!err && row) {
          key = row.rowid;
          console.log(`RowID: ${row.rowid}`);
          db.run("UPDATE role SET Name = (?), DiscordRoleID = (?) WHERE rowid = (?)",
            newRoleName, newDiscordRole, key, function(err) {
              if (!err) {
                console.log(`Updated role, changed ${this.changes} rows`);
                callback(true);
              } else {
                console.error(err.message);
                callback(false);
              }
            });
        } else if (!err) {
          callback(false);
        } else {
          callback(false);
          console.error(err.message);
        }
      });
    });
  },
  assignPlayerRole : function(roleName, playerName, discordUserID, callback) {
    db.serialize( () => {
      db.get('SELECT rowid, Name FROM CurrentPlayerNames WHERE DiscordID = ? or Name LIKE ?',
        discordUserID, playerName, (err, row) => {
        if (!err && row) {
          playername = row.Name;
          playerkey = row.rowid;
          console.log(`PlayerRowID: ${row.rowid}`);
          db.get('SELECT rowid FROM role WHERE Name LIKE ?', roleName, (err, row) => {
            if (!err && row) {
              rolekey = row.rowid;
              console.log(`RoleRowID: ${row.rowid}`);
              db.run('INSERT INTO player_role (RoleKey, PlayerKey) VALUES(?, ?)',
                rolekey, playerkey, function(err) {
                  if (!err) {
                    callback(true, playername);
                  } else {
                    console.error(err.message);
                    callback(false, "Assignment failed, player may already have role.");
                  }
                });
            } else if (!err) {
              callback(false, "Role does not exist.")
            } else {
              console.error(err.message);
              callback(false, "Assignment failed.");
            }
          });
        } else if (!err) {
          callback(false, "Player could not be found or does not exist.");
        } else {
          callback(false, "Assignment failed.");
          console.error(err.message);
        }
      });
    });
  },
  retractPlayerRole : function(roleName, playerName, discordUserID, callback) {
    db.serialize( () => {
      db.get('SELECT rowid, Name FROM CurrentPlayerNames WHERE DiscordID = ? or Name LIKE ?',
        discordUserID, playerName, (err, row) => {
        if (!err && row) {
          playerkey = row.rowid;
          playername = row.Name;
          console.log(`PlayerRowID: ${row.rowid}`);
          db.get('SELECT rowid FROM role WHERE Name LIKE ?', roleName, (err, row) => {
            if (!err && row) {
              rolekey = row.rowid;
              console.log(`RoleRowID: ${row.rowid}`);
              db.run('DELETE FROM player_role WHERE RoleKey = ? and PlayerKey = ?',
                rolekey, playerkey, function(err) {
                  if (!err) {
                    callback(true, playername);
                  } else {
                    console.error(err.message);
                    callback(false, "Removal failed, player may already be lacking the role.");
                  }
                });
            } else if (!err) {
              callback(false, "Role does not exist.")
            } else {
              console.error(err.message);
              callback(false, "Removal failed.");
            }
          });
        } else if (!err) {
          callback(false, "Player could not be found or does not exist.");
        } else {
          callback(false, "Removal failed.");
          console.error(err.message);
        }
      });
    });
  },
  addTier : function(tierName, maxPlayers, preferredPlayers, discordRoleID, callback) {
    db.serialize( () => {
      console.log(`${tierName} ${maxPlayers} ${preferredPlayers} ${discordRoleID}`);
      db.run('INSERT INTO tiers (Name, MaxSize, PreferredSize, DiscordRoleID) VALUES(?, ?, ?, ?)',
        tierName, maxPlayers, preferredPlayers, discordRoleID,
      function (err) {
        if (!err) {
          callback(true);
          console.log(`Added tier ${tierName} with MaxPlayers ${maxPlayers}`);
        } else {
          console.error(err.message);
        }
      });
    });
  },
  updateTier : function(tierName, maxPlayers, preferredPlayers, discordRoleID, callback) {
    db.serialize( () => {
      db.get('SELECT rowid FROM tiers WHERE Name LIKE (?)', tierName, (err, row) => {
        if(!err && row)
        {
          key = row.rowid;
          console.log(`RowID: ${row.rowid}`);
          db.run("UPDATE tiers SET MaxSize = (?), PreferredSize = (?), DiscordRoleID = (?) WHERE rowid = (?)",
            maxPlayers, preferredPlayers, discordRoleID, key, function(err) {
              if (!err) {
                console.log(`Updated tier, changed ${this.changes} rows`);
                callback(true);
              } else {
                console.error(err.message);
                callback(false);
              }
            });
        } else if (!err) {
          callback(false);
        } else {
          callback(false);
          console.error(err.message);
        }
      });
    });
  },
  assignTier : function(discordUserID, playerName, tierName, callback) {
    db.serialize( () => {
      db.get("SELECT rowid as rowid FROM CurrentPlayerNames WHERE DiscordID = ? or Name LIKE ?",
      discordUserID, playerName, (err, row) => {
        if (!err && row) {
          playerKey = row.rowid;
          db.get('SELECT rowid as rowid FROM tiers WHERE name LIKE ?', tierName, (err, row) => {
            if (!err && row) {
              tierKey = row.rowid;
              db.run('INSERT INTO player_tier(PlayerKey, TierKey, Date) VALUES (?, ?, ?)',
              playerKey, tierKey, currentDate(), function(err) {
                callback(true, null);
              });
            } else {
              if (err)
                console.error("tier " + err.message);
              callback(false, "Unknown tier");
            }
          });
        } else {
          if (err)
            console.error("player " + err.message);
          callback(false, "Unknown player");
        }
      });
    });
  },
  linkPlayer : function(discordUserID, playerName, callback) {

  },
  viewPlayer : function(playerName, discordUserID, callback) {

  },
  viewTier : function(tierName, discordRoleID, callback) {

  },
  overrideTier : function(discordUserID, playerName, discordRoleID, tierName, callback) {

  },
  inactivatePlayer : function(playerName, discordUserID, callback) {

  },
  activatePlayer : function(playerName, discordUserID, callback) {

  },
};
