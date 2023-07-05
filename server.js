const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Allows all notes to have a unique ID
const { v4: uuidv4 } = require('uuid');

app.use(express.static('public'));
app.use(express.json());

// API Routes
// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err;
    const dbData = JSON.parse(data);
    res.json(dbData);
  });
});

// POST
app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err;
    const dbData = JSON.parse(data);
    const newNote = {
      id: uuidv4(),
      title: req.body.title,
      text: req.body.text,
    };
    dbData.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(dbData), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

// DELETE
app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err;
    const dbData = JSON.parse(data);
    const newDb = dbData.filter((note) => note.id !== req.params.id);
    fs.writeFile('./db/db.json', JSON.stringify(newDb), (err) => {
      if (err) throw err;
      res.sendStatus(200);
    });
  });
});

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop', 'public', 'notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'));
  });
  

app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});