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
.then(client => {
  client.query('DROP TABLE IF EXISTS reviews')
  .then((data) => {
    console.log('Table dropped')
  }).catch((err) => {
    console.log('Failed to drop table', err)
  })
  
  client.query(`CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    item_id INT,
    review_data TEXT,
    static_data TEXT
    )
  ;`).then((data) => {
    console.log('Table created')
  }).catch((err) => {
    console.log('Failed to create table', err)
  }).then(() => {
    client.end();
  })
}).catch(e => {
  client.release()
  console.log(err.stack);
})
