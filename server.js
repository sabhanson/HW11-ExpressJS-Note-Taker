const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const { readAndAppend, readFromFile } = require('./helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


//GET route for notes.html
app.get('/notes', (req,res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)

//GET route for api notes
app.get('/api/notes', (req,res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
})

//POST route for api notes
app.post('/api/notes', (req,res) => {
    const { title, text} = req.body;
    console.log(req.body);
    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        }
        readAndAppend(newNote, './db/db.json');
        res.json('added new note!')
    } else {
        res.error('error, new note not added')
    }
})

//DELETE route for api notes by id
app.delete('/api/notes/:id', (req,res,) =>{
    fs.readFile('./db/db.json', 'utf8' , (err, data) => {
        const notesList = JSON.parse(data)
        if (err) {
          throw err;
        } else {
          const newNotesList = notesList.filter((note) => {
            return note.id !== req.params.id;})
            fs.writeFile('./db/db.json', JSON.stringify(newNotesList, null, 4), (err) =>
            err ? console.log(err) : res.json(newNotesList) )
        }
    })  
}
)

//GET route for index.html
app.get('*', (req,res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

//LISTEN to set up a localhost
app.listen(PORT, () =>
    console.log(`App listening on http://localhost:${PORT}`)
    
)