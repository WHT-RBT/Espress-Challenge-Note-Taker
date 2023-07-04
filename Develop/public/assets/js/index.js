// JavaScript code for notes.html

let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

// Function to check if the page is the notes page
const isNotesPage = () => {
  return window.location.pathname === '/notes.html';
};

// Function to show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Function to hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// Function to render the active note
const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

// Function to handle saving a note
const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Function to handle rendering the Save button
const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Function to handle clicking on an existing note
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Function to handle clicking on the New Note button
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

// Function to render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  noteList.innerHTML = "";

  if (jsonNotes.length === 0) {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    liEl.textContent = 'No saved Notes';
    noteList.append(liEl);
  } else {
    jsonNotes.forEach((note) => {
      const liEl = document.createElement('li');
      liEl.classList.add('list-group-item');
      liEl.dataset.note = JSON.stringify(note);

      const spanEl = document.createElement('span');
      spanEl.classList.add('list-item-title');
      spanEl.textContent = note.title;
      spanEl.addEventListener('click', handleNoteView);
      liEl.append(spanEl);

      noteList.append(liEl);
    });
  }
};

// Function to get notes from the server
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Function to save a note to the server
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

// Function to delete a note from the server
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Function to get and render notes
const getAndRenderNotes = () => getNotes().then(renderNoteList);

// Initialize the page
const init = () => {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelector('.list-group');

  renderActiveNote();
};

if (isNotesPage()) {
  init();

  noteTitle.addEventListener('input', handleRenderSaveBtn);
  noteText.addEventListener('input', handleRenderSaveBtn);
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);

  getAndRenderNotes();
}