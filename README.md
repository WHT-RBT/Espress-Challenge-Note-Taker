# Module 11 Express.js Challenge: 
# NOTE TAKER
<br>

## User Story

AS A small business owner
I WANT to be able to write and save notes
SO THAT I can organize my thoughts and keep track of tasks I need to complete
<br><br>

## Instructions

- Open the note-taking application
- You will then be presented with a landing page with a blue  "NOTES" button. Click on that button.
- You will then be directed to a page with where you can enter your notes, with the option to "Save" your notes.
- Click the Save icon that appears in the navigation at the top right of the page when done.
- The notes will then have been saved and will show in the feft-hand column with any other existing notes you have entered.
- When any of those existing notes are clicked, they will then appear on the right-hand column
- You will also have the ability to click on the "Write" icon on the top of the page that will populate empty fields to enter a new note title and  notes shown in the right-hand column
<br><br>
## Getting Started
The application should have a db.json file on the back end that will be used to store and retrieve notes using the fs module.

The following HTML routes should be created:

GET /notes should return the notes.html file.

GET * should return the index.html file.

The following API routes should be created:

GET /api/notes should read the db.json file and return all saved notes as JSON.

POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
<br><br>
## Bonus
As a bonus, see if you can add the DELETE route to the application using the following guideline:

DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.
<br><br>
## Mock-Up
The following images show the web application's appearance and functionality:
![Landing Page](<Develop/public/assets/images/landing page.png>)

![Notes Page](<Develop/public/assets/images/Note Page.png>)

![Entered Notes](<Develop/public/assets/images/entered notes.png>)


<br><br>
## Links

Deployed Link: <br>
     https://git.heroku.com/my-express-note-taker-app.git


GitHub Repo Link: <br>
     https://github.com/WHT-RBT/Express-Note-Taker
