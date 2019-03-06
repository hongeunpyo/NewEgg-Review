const { Pool, Client } = require('pg');
const {PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT} = require('./postgres.config');

const cn = {
  user: PGUSER,
  database: PGDATABASE,
  host: PGHOST,
  password: PGPASSWORD,
  port: PGPORT
}

// default pg connection to database
const db = new Pool(cn);

//Table creation and deconstruction
db.connect()
.then((client) => {
  client.query('DROP TABLE IF EXISTS reviews')
  .then((data) => {
    console.log('Table reviews dropped')
  }).catch((err) => {
    console.log('Failed to drop table', err)
  })

  client.query(`CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    title TEXT,
    pros TEXT,
    cons TEXT,
    body TEXT,
    verified TEXT,
    date TEXT,
    eggs INT,
    author TEXT,
    helpful INT DEFAULT 0,
    not_helpful INT DEFAULT 0,
    item_id INT
    )
  ;`).then((data) => {
    console.log('Review table created')
  }).catch((err) => {
    console.log('Failed to create review table', err)
  })
  client.query('CREATE INDEX item_index ON reviews(item_id)')
    .then(() => {
      console.log('Index item_index created on reviews');
      client.release();
    }).catch((err) => {
      console.log('Failed to create index item_index');
      client.release();
    }).then(() => {
      db.end();
    })
});