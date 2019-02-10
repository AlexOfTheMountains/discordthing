const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/chinook.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

db.serialize( () => {
  db.run('CREATE TABLE swears(word text)', (err) => {
    console.log("Table already exists");
  });
});

module.exports = {
  commands : {
    swear: (msg, args) => {
      mentions = msg.mentions;
      console.log(mentions);

      if (mentions.users.array().length != 0) {
        mentioned = mentions.users.array();
        for (user in mentioned) {
          user = mentioned[user];
          msg.channel.send(`${msg.author.username} says fuck you <@${user.id}>`);
          console.log(`${msg.author.username} says fuck you <@${user.id}>`);
        }
      }
      else {
        msg.channel.send(`FUCK you too ${msg.author.username}`);
      }
    },
    addswear:(msg, args) => {
      db.run('INSERT INTO swears(word) VALUES (?)', args[0]);
    },
    delswear:(msg, args) => {
      db.run('DELETE FROM swears WHERE word == (?)', args[0], function(err) {
        if (this.changes)
        {
          msg.channel.send(`Okay, I've forgotten about ${args[0]}`);
        }
        else
        {
          msg.channel.send("I didn't know that swear anyways.");
        }
      });
    },
    listswears:(msg, args) => {
      db.serialize( () => {
        db.all('SELECT * from swears', (err, rows) => {
          if (err)
          {
            console.error(err);
          } else {
            swears = [];
            for (row in rows)
            {
              swears.push(rows[row].word);
            }
            msg.channel.send(`Here are all the swear words I know: ${swears.join(", ")}`);
          }
        });
      });
    }
  },
  database: db
};
