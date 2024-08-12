const express=require('express')
const cors = require('cors');
const app=express()
app.use(cors()); 
app.use(express.json())

let notes = [
    {
      "id": "1",
      "title": "laundry",
      "summary": "wash utensils",
      "important": false,
      "complete": false
    },
    {
      "id": "2",
      "title": "grocery shopping",
      "summary": "buy vegetables and fruits",
      "important": false,
      "complete": false
    },
    {
      "id": "3",
      "title": "study session",
      "summary": "prepare for the upcoming exams",
      "important": false,
      "complete": false
    }
  ];
  
app.get('/',(req,res)=>{
    res.send('<h1>Hello World</h1>')
})

app.get('/api/notes',(req,res)=>{
    res.json(notes)
})

app.get('/api/notes/:id',(req,res)=>{
    const id=req.params.id
    const note=notes.find(note=>note.id===id)
    if(note){
        res.json(note)
    }
    else{
        res.status(404).end()
    }
})

app.post('/api/notes',(req,res)=>{
    const note=req.body
    const ids=notes.map(note=>note.id)
    const maxId=Math.max(...ids)
    const newNote={
        id:(maxId+1).toString(),
        title:note.title,
        summary:note.summary,
        important:Boolean(note.important)||false,
        complete:Boolean(note.complete)||false
    }
    notes=[...notes,newNote]
    console.log(note);
    
    res.status(201).json(newNote)
})

app.delete('/api/notes/:id',(req,res)=>{
    const id=req.params.id
    notes=notes.filter(note=>note.id!==id)
    res.status(204).end()
})

// app.patch('/api/notes/:id', (req, res) => {
//     const id = req.params.id;
//     const updatedNote = req.body;

//     // Update the note based on the fields provided in the request
//     notes = notes.map(note =>
//         note.id === id ? { ...note, ...updatedNote } : note
//     );

//     res.json(notes.find(note => note.id === id)); // Return the updated note
// });
app.patch('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const updatedNote = req.body;

    // Find the note by id and update only the specified fields
    let noteFound = false;
    notes = notes.map(note => {
        if (note.id === id) {
            noteFound = true;
            return { ...note, ...updatedNote };
        }
        return note;
    });

    if (noteFound) {
        res.json(notes.find(note => note.id === id)); // Return the updated note
    } else {
        res.status(404).send({ error: "Note not found" });
    }
});


// const app = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' })
//   res.end(JSON.stringify(notes))
// })

const PORT = 3007
app.listen(PORT)
console.log(`Server running on port ${PORT}`)