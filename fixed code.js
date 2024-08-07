// app.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

let db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INT, name TEXT)");

  let stmt = db.prepare("INSERT INTO users VALUES (?, ?)");
  stmt.run(1, 'Alice');
  stmt.run(2, 'Bob');
  stmt.finalize();
});

app.get('/user', (req, res) => {
  let id = req.query.id;
  db.get(`SELECT name FROM users WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).send("An error occurred");
      return;
    }
    res.send(`User: ${row ? row.name : 'Not found'}`);
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
