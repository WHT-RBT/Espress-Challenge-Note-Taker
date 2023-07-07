const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  const notes = getNotesFromDB();
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  const newNote = {
    id: uuidv4(),
    title,
    text,
  };

  const notes = getNotesFromDB();
  notes.push(newNote);
  saveNotesToDB(notes);

  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;

  let notes = getNotesFromDB();
  notes = notes.filter((note) => note.id !== id);
  saveNotesToDB(notes);

  res.sendStatus(204);
});

// Helper functions
const getNotesFromDB = () => {
  const dbFilePath = path.join(__dirname, 'Develop', 'db', 'db.json');
  const data = fs.readFileSync(dbFilePath, 'utf8');
  return JSON.parse(data);
};

const saveNotesToDB = (notes) => {
  const dbFilePath = path.join(__dirname, 'Develop', 'db', 'db.json');
  fs.writeFileSync(dbFilePath, JSON.stringify(notes));
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});