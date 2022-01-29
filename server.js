const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const { readAndAppend, readFromFile } = require('./helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

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

//GET route for index.html
app.get('*', (req,res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

app.listen(PORT, () =>
    console.log('App listening yo')
)