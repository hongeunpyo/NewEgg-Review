const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const path = require('path');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 3009;
const router = express.Router();
const cors = require('cors');
const {PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT} = require('./postgres.config');
const { Pool, Client } = require('pg');

const dbPath = path.resolve(__dirname, '../database/reviewdb.db') 
let db = new sqlite3.Database(dbPath);

app.use(cors());
app.use(bodyParser.json());
app.use(compression());

const cn = {
    user: PGUSER,
    database: PGDATABASE,
    host: PGHOST,
    password: PGPASSWORD,
    port: PGPORT
  }



//Wildcard operator that serves compressed bundle file
app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

app.use(express.static(__dirname + '/../client/dist'));

//Route that sends back index.html whenever a parameter id gets passed in
app.get('/:id', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/dist/index.html'))
});

//GET request for review information according to item id
app.get('/reviews/:item_id', (req, res) => {
    db.all('SELECT * FROM reviews WHERE item_id=(?)', [req.params.item_id], (err, row) => {
        if (err) {
            console.error('ERROR occurred while retrieving reviews')
        }
        res.status(200).send(row);
    })
});

app.post('/reviews', (req, res) => {
    let newPost = req.body;
    let stmt = db.prepare('INSERT INTO reviews (item_id, title, pros,\
    cons,body,verified,date,eggs,author) VALUES (?,?,?,?,?,?,?,?,?)');
    stmt.run(newPost.item_id, newPost.title, newPost.pros,
    newPost.cons, newPost.body, newPost.verified, newPost.date,
    newPost.eggs, newPost.author)
    stmt.finalize();
    res.send(201);
});

app.patch('/reviews', (req, res) => {
    let newPost = req.body;
    if (req.body.helpful === true) {
        let stmt = db.prepare('UPDATE reviews SET helpful = helpful + 1 WHERE id = ?');
        stmt.run(newPost.id)
        stmt.finalize();
        res.sendStatus(201);
    }
    if (req.body.helpful === false) {
        let stmt = db.prepare('UPDATE reviews SET not_helpful = not_helpful + 1 WHERE id = ?');
        stmt.run(newPost.id)
        stmt.finalize();
        res.sendStatus(201);
    }
})

app.listen(port, () => {
    console.log('Listening on port ' + port);
});

module.exports = {
    app
}