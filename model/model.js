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
    db.all('SELECT name as name, discordid as discordid from CurrentPlayerNames', (err, rows) => {
      if (!err)
      {
        callback(rows);
      } else {
        callback(null);
      }
    });
  },
  updateScore : function(discordUserID, score, level) {

  },
  updatePlayerName : function(discordUserID, oldName, newName) {

  },
  addRole : function(roleName, discordRoleID) {

  },
  assignPlayerRole : function(roleName, discordUserID) {

  },
  retractPlayerRole : function(roleName, discordUserID) {

  },
  createTier : function(tierName, maxPlayers, preferredPlayers, discordRoleID) {

  },
  updateTier : function(tierName, maxPlayers, preferredPlayers, discordRoleID) {

  },
  assignTier : function(discordUserID, playerName, tierName) {

  }
};
