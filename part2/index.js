const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

//   const password = process.argv[2]
const password = process.env.MONGODBPASSWORD;
const PORT = process.env.PORT || 3001;

if (!password) {
  console.log("MONGODBPASSWORD environment variable is required");
  process.exit(1);
}

if (!PORT) {
  console.log("PORT environment variable is required");
  process.exit(1);
}

console.log("Password:", password);
console.log("Port:", PORT);

const url = `mongodb+srv://EvilEyed2k23:${password}@cluster0.cpcfgzg.mongodb.net/notesApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).send("Something went wrong");
});

// let notes = [
//   {
//     id: "1",
//     title: "laundry",
//     summary: "wash utensils",
//     important: false,
//     complete: false,
//   },
//   {
//     id: "2",
//     title: "grocery shopping",
//     summary: "buy vegetables and fruits",
//     important: false,
//     complete: false,
//   },
//   {
//     id: "3",
//     title: "study session",
//     summary: "prepare for the upcoming exams",
//     important: false,
//     complete: false,
//   },
// ];

const notesSchema = new mongoose.Schema({
  title: String,
  summary: String,
  important: Boolean,
  complete: Boolean,
});

const Note = mongoose.model("Note", notesSchema);

app.get("/", (req, res) => {
  res.send("<h1>Welcome To Notes App</h1>");
});

app.get("/api/notes", async (req, res) => {
  //   res.json(notes);
  try {
    const notes = await Note.find({});
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/notes/:id", async (req, res) => {
  //   const id = req.params.id;
  //   const note = notes.find((note) => note.id === id);
  //   if (note) {
  //     res.json(note);
  //   } else {
  //     res.status(404).end();
  //   }
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  try {
    const note = await Note.findById(id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).send("Note not found");
    }
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).send("Internal Server Error");
  }
});

// app.post("/api/notes", (req, res) => {
//   const note = req.body;
//   const ids = notes.map((note) => note.id);
//   const maxId = Math.max(...ids);
//   const newNote = {
//     id: (maxId + 1).toString(),
//     title: note.title,
//     summary: note.summary,
//     important: Boolean(note.important) || false,
//     complete: Boolean(note.complete) || false,
//   };
//   notes = [...notes, newNote];
//   console.log(note);

//   res.status(201).json(newNote);
// });

app.post("/api/notes", async (req, res) => {
  const { title, summary, important = false, complete = false } = req.body;

  if (!title || !summary) {
    return res.status(400).json({ error: "Title and summary are required" });
  }

  try {
    // Check for existing note with the same title
    const existingNote = await Note.findOne({ title });

    if (existingNote) {
      return res.status(400).json({
        error:
          "Note with the same title already exists. Please provide a new note.",
      });
    }

    const newNote = new Note({
      title,
      summary,
      important,
      complete,
    });

    const savedNote = await newNote.save();
    console.log("Note saved", savedNote);
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  //   notes = notes.filter((note) => note.id !== id);
  //   res.status(204).end();
});

// app.patch('/api/notes/:id', (req, res) => {
//     const id = req.params.id;
//     const updatedNote = req.body;

//     // Update the note based on the fields provided in the request
//     notes = notes.map(note =>
//         note.id === id ? { ...note, ...updatedNote } : note
//     );

//     res.json(notes.find(note => note.id === id)); // Return the updated note
// });
app.patch("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  const updatedNote = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid note ID format" });
  }

  // Find the note by id and update only the specified fields
  //   let noteFound = false;
  //   notes = notes.map((note) => {
  //     if (note.id === id) {
  //       noteFound = true;
  //       return { ...note, ...updatedNote };
  //     }
  //     return note;
  //   });

  //   if (noteFound) {
  //     res.json(notes.find((note) => note.id === id)); // Return the updated note
  //   } else {
  //     res.status(404).send({ error: "Note not found" });
  //   }
  try {
    const note = await Note.findByIdAndUpdate(id, updatedNote, {
      new: true,
      runValidators: true,
    });
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// const app = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' })
//   res.end(JSON.stringify(notes))
// })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
