const router = require('express').Router();
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

router.get('/notes', (req, res) => {
  readFromFile('/db/db.json') // Adjusted path
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => res.status(500).json('Error reading notes.'));
});

router.post('/notes', (req, res) => {
  console.log(`${req.method} request received to add a note.`);
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      id: uuidv4(),
      title,
      text,
    };

    readAndAppend(newNote, '/db/db.json') // Adjusted path
      .then(() => {
        const response = {
          status: 'success',
          body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
      })
      .catch((err) => res.status(500).json('Error saving new note.'));
  } else {
    res.status(400).json('Error creating new note: Title and text are required.');
  }
});

router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('/db/db.json') // Adjusted path
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== noteId);
      writeToFile('/db/db.json', result); // Adjusted path
      res.json(`Note ${noteId} was deleted`);
    })
    .catch((err) => res.status(500).json('Error deleting note.'));
});

module.exports = router;
