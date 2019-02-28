const { Pool, Client } = require('pg');
const {PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT} = require('./postgres.config');
const {value_gen} = require('./dataHelpers.js')
const pgp = require('pg-promise')({
  capSQL: true
});

const cn = {
  user: PGUSER,
  database: PGDATABASE,
  host: PGHOST,
  password: PGPASSWORD,
  port: PGPORT
}

//default pg connection to database
// const normalConnection = new Pool(cn);
//using pg-promises to connect to database
const db = pgp(cn);


var sql = `INSERT INTO reviews (item_id, title, pros, cons, body, verified, date, eggs, author) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`



// normalConnection.connect((err, client, done) => {
//   if (err) {
//     console.log('Error encountered while connecting to db', err);
//   }

  // normalConnection.query('DROP TABLE IF EXISTS reviews', (err) => {
  //   if (err) {
  //     console.log('Error encountered while dropping db', err);
  //   }
  // });

  // normalConnection.query(`CREATE TABLE reviews (
  //   id SERIAL PRIMARY KEY,
  //   item_id INT,
  //   title TEXT,
  //   pros TEXT,
  //   cons TEXT,
  //   body TEXT,
  //   verified TEXT,
  //   date VARCHAR,
  //   eggs INTEGER DEFAULT 0,
  //   author TEXT,
  //   helpful INTEGER NULL DEFAULT 0,
  //   not_helpful INTEGER NULL DEFAULT 0)
  // ;`), (err) => {
  //   if (err) {
  //     console.log('Error encountered while creating tables', err);
  //   }
  // };
  // normalConnection.end();
// });



// db.none('DROP TABLE IF EXISTS reviews').then((data) => {
//   console.log('Review table dropped')
// })
// .catch((err) => {
//   console.log('Error when dropping table', err)
// })

// db.none(`CREATE TABLE reviews (
//   item_id SERIAL PRIMARY KEY,
//   review_array TEXT
// );`).then((data) => {
//   console.log('Table successfully created');
// }) .catch((err) => {
//   console.log('Error when creating table', err);
// });

// generate values according to random input
var values = []
var errorCount = 0
for (var i = 0; i < 1000000; i++) {
  var item = value_gen(Math.floor(Math.random() * 15))
  if (Object.keys(item).length !== 0) {
    values.push(item);
  }
  // console.log(item);
}

// console.log(values);
// console.log(errCount);
// const values = [{review_array: value_gen(5)}, {review_array: value_gen(3)}];
var colSet = new pgp.helpers.ColumnSet(['review_array'],  {table: 'reviews'})

const query = pgp.helpers.insert(values, colSet);

db.none(query).then((data) => {
  console.log('Data successfully seeded')
}).catch((err) => {
  console.log('Error adding data', err)
});

  // client.query(`INSERT INTO reviews(title, pros) VALUES($1, $2)`, ['sometitle', 'somepros'], (err) => {
  //   done();
  //   if (err) throw err;
  // });
  // for (var i = 0; i < 50000; i++) {
  //   client.query(sql, values[i], (err) => {
  //     if (err) {
  //       console.log('Error occured while populating database')
  //     }
  //     done();
  //   });
  // }
