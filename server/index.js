const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const port = process.env.PORT || 3009;
const cors = require('cors');
const {PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT} = require('../database/postgres/postgres.config');
const { Pool, Client } = require('pg');

const cn = {
    user: PGUSER,
    database: PGDATABASE,
    host: PGHOST,
    password: PGPASSWORD,
    port: PGPORT
}

//connection to postgres database
const db = new Pool(cn);

//connect DB to server
db.connect(function (err, client, done) {
    if (err) {
        console.log(err);
    }
    //establish connection to server
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(compression());

    //Wildcard operator that serves compressed bundle file
    app.get('*.js', function (req, res, next) {
      req.url = req.url + '.gz';
      res.set('Content-Encoding', 'gzip');
      next();
    });
    
    //GET request for loader verification
    app.get('/loaderio-*', function (req, res) {
        res.sendFile(path.join(__dirname + '/loaderio-fbd36966cb048c05742ebe8ffa6ae1cf.txt'))
    });
    
    app.use(express.static(__dirname + '/../client/dist'));
    
    //Route that sends back index.html whenever a parameter id gets passed in
    app.get('/:id', (req, res) => {
        res.sendFile(path.join(__dirname + '/../client/dist/index.html'));
    });
    
    //GET request for review information according to item id
    app.get('/reviews/:item_id', (req, res) => {
        let itemQuery = `SELECT * FROM reviews WHERE item_id = $1`
        client.query(itemQuery, [req.params.item_id])
            .then((data) => {
                res.send(data.rows);
            }).catch((err) => {
                console.log("Error ocurred while retrieving data", err);
            })
    });

    //POST request for new reviews according to item id
    app.post('/reviews', (req, res) => {
        let newPost = req.body;
        let insertQuery = `INSERT INTO reviews (item_id, title, pros, cons, body, verified, date, eggs, author) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
        client.query(insertQuery, [newPost.item_id, newPost.title, newPost.pros, newPost.cons, newPost.body, newPost.verified, newPost.date,newPost.eggs, newPost.author])
            .then((data) => {
                console.log('Post request successful');
                res.sendStatus(201);
            }).catch((err) => {
                console.log("Error occurred while retrieving data", err);
            })
    });

    //PATCH request for updating helpful counter for reviews
    app.patch('/reviews', (req, res) => {
        let newPost = req.body;
        console.log(newPost)
        if (req.body.helpful === true) {
            let helpfulQuery = `UPDATE reviews SET helpful = helpful + 1 WHERE review_id = $1`;

            client.query(`UPDATE reviews SET helpful = helpful + 1 WHERE review_id = $1`, [newPost.id])
                .then(() => {
                    console.log('Updated "helpful" in reviews')
                    res.sendStatus(201);
                }).catch((err) => {
                    console.log("Error occurred while updating data", err);
                })
        }
        if (req.body.helpful === false) {
            let notHelpfulQuery = `UPDATE reviews SET not_helpful = not_helpful + 1 WHERE review_id = $1`;
            client.query(notHelpfulQuery, [newPost.id])
                .then(() => {
                    console.log('Updated "not_helpful" in reviews')
                    res.sendStatus(201);
                }).catch((err) => {
                    console.log("Error occurred while updating data", err);
                })
        }
    })
    app.listen(port, () => {
        console.log('Listening on port ' + port);
    });

    module.exports = {
        app
    }
})