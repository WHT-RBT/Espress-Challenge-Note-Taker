const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse request bodies as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Routes
app.get('/api/notes', (req, res) => {
  // Read the db.json file and send the notes as a JSON response
  const dbPath = path.join(__dirname, 'db', 'db.json');
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve notes.' });
    }

    let notes = [];
    try {
      notes = JSON.parse(data);
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: 'Failed to parse notes data.' });
    }

    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  // Receive a new note from the request body, assign a unique ID,
  // and save it in the db.json file
  const dbPath = path.join(__dirname, 'db', 'db.json');
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save note.' });
    }

    let notes = [];
    try {
      notes = JSON.parse(data);
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: 'Failed to parse notes data.' });
    }

    const newNote = {
      id: uuidv4(),
      title: req.body.title,
      text: req.body.text,
    };

    notes.push(newNote);

    fs.writeFile(dbPath, JSON.stringify(notes), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return res.status(500).json({ error: 'Failed to save note.' });
      }

      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  // Delete the note with the specified ID from the db.json file
  const dbPath = path.join(__dirname, 'db', 'db.json');
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete note.' });
    }

    let notes = [];
    try {
      notes = JSON.parse(data);
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: 'Failed to parse notes data.' });
    }

    const noteId = req.params.id;
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    fs.writeFile(dbPath, JSON.stringify(updatedNotes), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return res.status(500).json({ error: 'Failed to delete note.' });
      }

      res.sendStatus(204);
    });
  });
});

// HTML Route
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Default route for serving the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
