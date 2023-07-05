let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteTitle = document.getElementById('note-title');
  noteText = document.getElementById('note-text');
  saveNoteBtn = document.getElementById('save-note');
  newNoteBtn = document.getElementById('new-note');
  noteList = document.querySelector('.list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// get request for the notes
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// post request for the notes
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

// delete request for the notes
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// function to hide the save btn until there is a note added to save
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

// save note
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

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target.parentElement;
  const noteId = note.getAttribute('data-note-id');

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  const note = e.target.parentElement;
  const noteId = note.getAttribute('data-note-id');
  const noteTitle = note.querySelector('.note-title').innerText;
  const noteText = note.querySelector('.note-text').innerText;

  activeNote = {
    id: noteId,
    title: noteTitle,
    text: noteText,
  };

  renderActiveNote();
};

// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteView = () => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  const jsonNotes = await notes.json();
  noteList.innerHTML = '';

  if (jsonNotes.length === 0) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerText = 'No saved notes';
    noteList.appendChild(listItem);
  } else {
    jsonNotes.forEach((note) => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.setAttribute('data-note-id', note.id);

      const noteTitle = document.createElement('h5');
      noteTitle.classList.add('note-title');
      noteTitle.innerText = note.title;

      const noteText = document.createElement('p');
      noteText.classList.add('note-text');
      noteText.innerText = note.text;

      listItem.appendChild(noteTitle);
      listItem.appendChild(noteText);
      listItem.addEventListener('click', handleNoteView);

      const deleteBtn = document.createElement('i');
      deleteBtn.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
      deleteBtn.addEventListener('click', handleNoteDelete);

      listItem.appendChild(deleteBtn);
      noteList.appendChild(listItem);
    });
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => {
  getNotes().then(renderNoteList);
};

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();