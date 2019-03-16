const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const cluster = require('cluster');
const app = express();
const port = process.env.PORT || 3009;
const cors = require('cors');
const {PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT} = require('../database/postgres/postgres.config');
const pgp = require('pg-promise')({
    capSQL: true
  });

  //check if cluster is master and run threading function
if (cluster.isMaster) {
    //Create cluster for number of cpus available
    for (var i = 0; i < 2; i++) {
        cluster.fork();
    }
    // Listen for dying workers
    cluster.on('exit', function (worker) {
    // Replace the dead worker
    console.log('Worker %d died :(', worker.id);
    cluster.fork();
    });
} else { //For rest of clusters run express server   
    //connect to redis
    const redisClient = require('./redis-client')
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
    
    app.get('/loaderio-*', function (req, res) {
        res.sendFile(path.join(__dirname + '/loader.txt'))
    });
    
    app.use(express.static(__dirname + '/../client/dist'));
    
    //Route that sends back index.html whenever a parameter id gets passed in
    app.get('/:id', (req, res) => {
        res.sendFile(path.join(__dirname + '/../client/dist/index.html'));
    });
    
    //GET request for review information according to item id
    app.get('/reviews/:item_id', async (req, res) => {
        const rawData = await redisClient.getAsync(req.params.item_id)
        console.log(rawData);
        if (rawData === null) {
            db.any('SELECT * FROM reviews where item_id = $1', [req.params.item_id])
                .then((data) => {
                    redisClient.setAsync(req.params.item_id, JSON.stringify(data))
                    res.send(data);
                    res.end();
                }).catch() 
        } else {
            console.log('Sending data from redis server')
            res.send(rawData);
            res.end();
        }
    });
    
    app.post('/reviews', (req, res) => {
        let newPost = req.body;
        db.none(`INSERT INTO reviews (item_id, title, pros, cons, body, verified, date, eggs,
                     author) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [newPost.item_id, newPost.title, newPost.pros,
                     newPost.cons, newPost.body, newPost.verified, newPost.date,newPost.eggs, newPost.author])
                     .then((data) => {
                         res.send(data);
                         res.end()
                     }).catch(err)
    });
    
    app.patch('/reviews', (req, res) => {
        let newPost = req.body;
        if (req.body.helpful === true) {
            db.none(`UPDATE reviews SET helpful = helpful + 1 WHERE review_id = $1`, [newPost.id]) 
                .then(() => {
                    res.sendStatus(201);
                    res.end();
                }).catch()
        }
        if (req.body.helpful === false) {
            db.connect().then((client) => {
                db.none(`UPDATE reviews SET not_helpful = not_helpful + 1 WHERE review_id = $1`, [newPost.id])
                    .then(() => {
                        res.sendStatus(201)
                        res.end()
                    }).catch()
            })
        }
    })
    
    app.listen(port, () => {
        console.log('Listening on port ' + port);
    });
    
    module.exports = {
        app
    }
}

// let htmlTemplate = `
//     <!DOCTYPE html>
//     <html>
//         <head>
//             <title>Reviews</title>
//             <link rel="stylesheet" href="style.css">
//             <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400">
//         </head>
//         <body>
//             <div id="reviewApp"></div>
//             <script type="text/javascript" src="bundle.js"></script>
//         </body>
//     </html>
//     `