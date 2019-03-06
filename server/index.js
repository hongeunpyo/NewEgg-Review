const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 3009;
const router = express.Router();
const cors = require('cors');
const {PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT} = require('../database/postgres/postgres.config');
const { Pool, Client } = require('pg');

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

//connection to postgres database
const db = new Pool(cn);

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
    db.connect().then((client) => {
        client.query('SELECT * FROM reviews WHERE item_id = $1', [req.params.item_id])
            .then((data) => {
                res.send(data);
            }).catch((err) => {
                console.log("Error occurred while retrieving data", err);
            }).then(() => {
                client.end();
            })
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