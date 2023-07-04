const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000; // Specify the port you want your server to listen on

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Routes
app.get('/api/notes', (req, res) => {
  // Handle the request and send a response
  res.json({ message: 'This is the notes API endpoint' });
});

app.post('/api/notes', (req, res) => {
  // Handle the request and send a response
  const note = req.body;
  console.log('Received a new note:', note);
  res.json({ message: 'Note saved successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
