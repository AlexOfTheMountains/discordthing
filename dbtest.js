const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/chinook.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

db.serialize( () => {
  db.run('CREATE TABLE langs(name text)');
  db.run('INSERT INTO langs(name) VALUES (?)', "a");
  db.run('INSERT INTO langs(name) VALUES (?)', "b");
  db.run('INSERT INTO langs(name) VALUES (?)', "c");
  db.all('SELECT * from langs', (err, rows) => {
    if (err)
    {
      console.error(err);
    } else {
      values = [];
      for (row in rows)
      {
        values.push(rows[row].name);
      }
      console.log(values.join(", "));
    }
  });
  db.run('DROP TABLE langs');
});
db.close();
