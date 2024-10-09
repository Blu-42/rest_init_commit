const express = require("express");
const app = express();

const notes = require("./data/notes-data");

// Middleware to parse JSON bodies
app.use(express.json());

// GET /notes/:noteId - Returns a single note by ID
app.get("/notes/:noteId", (req, res, next) => {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  if (foundNote) {
    res.json({ data: foundNote });
  } else {
    next({ status: 404, message: `Note id not found: ${req.params.noteId}` });
  }
});

// GET /notes - Returns an array of notes
app.get("/notes", (req, res) => {
  res.json({ data: notes });
});

// Variable to hold the next ID
let lastNoteId = notes.reduce((maxId, note) => Math.max(maxId, note.id), 0);

// POST /notes - Creates a new note
app.post("/notes", (req, res, next) => {
  const { data: { text } = {} } = req.body;
  if (text) {
    const newNote = {
      id: ++lastNoteId,
      text,
    };
    notes.push(newNote);
    res.status(201).json({ data: newNote });
  } else {
    next({ status: 400, message: "A 'text' property is required." });
  }
});

// Not found handler
app.use((req, res, next) => {
  next({ status: 404, message: `Not found: ${req.originalUrl}` });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
