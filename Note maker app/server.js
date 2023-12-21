const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3009;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

function readDB() {
    const data = fs.readFileSync('./db/db.json', 'utf8');
    return JSON.parse(data); 
}

function writeDB(data){
    fs.writeFileSync('./db/db.json', JSON.stringify(data, null, 2), 'utf8');
}

app.get('/', (req, res)=>{
    res.send ('Welcome to the note-taking app');
})

app.get('/api/notes', (req,res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) =>{
    const newNote = req.body;
    console.log(req.body);
    if (!newNote.title || !newNote.text) {
        return res.status(400).send('Both title and text are required');
    }

    fs.readFile('./db/db.json', 'utf8', (err, data) =>{
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }   
        const notes = JSON.parse(data);
        newNote.id = notes.length + 1;
        notes.push(newNote);
        writeDB(notes);
        res.status(201).send(newNote);
    });
});

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
