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
    //receive a new note and save in the reqbody
    //add to the dbjson file
    //return new note to the client
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
        res.error('you suck loser')
    }
})

//DELETE ROUTE

//FIRST, access the array of objects from db.json (objArray = parsed db.json file)
//THEN, bring that array into this file so it can be manipulated (new element to define the array?)
//THEN, search through the array to find the specific object that matches the id of the selected note (filter method???)
//THEN, remove that object from the array  (if req.body.id.value === element.id { filter.objArray ???}))
//THEN, push that new array back to the db.json file with writeFile (this will rewrite over the previous data) writeFile ('/db/db.json)

//event listener is on the delete icon on each note
//when clicked, take that specific URL and delete the note (obj) from the db json
//read file and look for the note that is linked to the specified ID
//delete that object


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

app.listen(PORT, () =>
    console.log('App listening yo')
)