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
const pgp = require('pg-promise')({
    capSQL: true
  });

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
// const db = new Pool(cn);
const db = pgp(cn)

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
                res.send(data.rows);
            }).catch((err) => {
                console.log("Error occurred while retrieving data", err);
            }).then(() => {
                client.end();
            })
    }).catch((err) => console.log("Error occurred while connecting to DB", err))
});

app.post('/reviews', (req, res) => {
    let newPost = req.body;
    db.connect().then((client) => {
        client.query(`INSERT INTO reviews (item_id, title, pros, cons, body, verified, date, eggs,
            author) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [newPost.item_id, newPost.title, newPost.pros,
            newPost.cons, newPost.body, newPost.verified, newPost.date,newPost.eggs, newPost.author])
            .then((data) => {
                console.log('Post request sucessful')
                res.send(data);
            }).catch((err) => {
                console.log("Error occurred while retrieving data", err);
            }).then(() => {
                client.end();
            })
    })
});

app.patch('/reviews', (req, res) => {
    let newPost = req.body;
    console.log(newPost)
    if (req.body.helpful === true) {
        db.connect().then((client) => {
            client.query(`UPDATE reviews SET helpful = helpful + 1 WHERE review_id = $1`, [newPost.id])
                .then(() => {
                    console.log('Updated "helpful" in reviews')
                    res.sendStatus(201);
                }).catch((err) => {
                    console.log("Error occurred while updating data", err);
                }).then(() => {
                    client.end();
                })
            });
    }
    if (req.body.helpful === false) {
        db.connect().then((client) => {
            client.query(`UPDATE reviews SET not_helpful = not_helpful + 1 WHERE review_id = $1`, [newPost.id])
                .then(() => {
                    console.log('Updated "not_helpful" in reviews')
                    res.sendStatus(201);
                }).catch((err) => {
                    console.log("Error occurred while updating data", err);
                }).then(() => {
                    client.end();
                })
            });
    }
})

app.listen(port, () => {
    console.log('Listening on port ' + port);
});

module.exports = {
    app
}