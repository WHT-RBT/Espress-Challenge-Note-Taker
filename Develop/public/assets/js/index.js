let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('#note-title');
  noteText = document.querySelector('#note-text');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelector('.list-container .list-group');
}

const show = (elem) => {
  elem.style.display = 'inline';
};

const hide = (elem) => {
  elem.style.display = 'none';
};

let activeNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

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

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };

  saveNote(newNote)
    .then(() => {
      activeNote = {};
      renderActiveNote();
      getAndRenderNotes(); // Fetch and render the updated note list
    });
};

const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target.parentElement;
  const noteId = JSON.parse(note.dataset.note).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId)
    .then(() => {
      renderActiveNote();
      getAndRenderNotes();
    });
};

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.dataset.note);
  renderActiveNote();
};

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

const renderNoteList = (notes) => {
  noteList.innerHTML = '';

  notes.forEach((note) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    liEl.dataset.note = JSON.stringify(note);

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.textContent = note.title;
    spanEl.addEventListener('click', handleNoteView);

    const deleteBtnEl = document.createElement('i');
    deleteBtnEl.classList.add(
      'fas',
      'fa-trash-alt',
      'float-right',
      'text-danger',
      'delete-note'
    );
    deleteBtnEl.addEventListener('click', handleNoteDelete);

    liEl.appendChild(spanEl);
    liEl.appendChild(deleteBtnEl);
    noteList.appendChild(liEl);
  });
};

const getAndRenderNotes = () => {
  getNotes()
    .then((response) => response.json())
    .then((data) => renderNoteList(data));
};

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('input', handleRenderSaveBtn);
  noteText.addEventListener('input', handleRenderSaveBtn);
}

getAndRenderNotes();
