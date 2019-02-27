const { Pool, Client } = require('pg');
const {PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT} = require('./postgres.config');

const db = new Pool({
  user: PGUSER,
  database: PGDATABASE,
  host: PGHOST,
  password: PGPASSWORD,
  port: PGPORT
});

db.connect((err, client, done) => {
  if (err) {
    console.log('Error encountered while connecting to db', err);
  }

  client.query('DROP TABLE IF EXISTS reviews', (err) => {
    done();
    if (err) {
      console.log('Error encountered while dropping db', err);
    }
  });

  client.query(`CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    item_id INT,
    title TEXT,
    pros TEXT,
    cons TEXT,
    body TEXT,
    verified TEXT,
    date VARCHAR,
    eggs INTEGER DEFAULT 0,
    author TEXT,
    helpful INTEGER NULL DEFAULT 0,
    not_helpful INTEGER NULL DEFAULT 0)
  ;`), (err) => {
    done();
    if (err) {
      console.log('Error encountered while populating db', err);
    }
  };
});