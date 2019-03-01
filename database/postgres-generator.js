const { Pool, Client } = require('pg');
const { performance } = require('perf_hooks')
const {PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT} = require('./postgres.config');
const {author, body, pros, cons, title, date, verified, item_id, eggs} = require('./generator')
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

//using pg-promises to connect to database
const db = pgp(cn);

// generate values according to random input
const dataGenerate = function(number) {
  const values = []
  for (let i = 0; i < number; ++i) {
    var item = value_gen()
    if (Object.keys(item).length !== 0) {
      values.push(item);
    }
    if (i % 50000 === 0) {
      console.log(`ay we made it ${i}`)
    }
  }
  // databaseInsert(values);
  // console.log(values);
  return values;
}

const databaseInsert = async function(number) {
  var array = dataGenerate(number);
  // console.log(array);
  var colSet = new pgp.helpers.ColumnSet(['review_data', 'static_data', 'item_id'],  {table: 'reviews'});
  const query = pgp.helpers.insert(array, colSet);
  await db.none(query).then((data) => {
    console.log('Data successfully seeded');
  }).catch((err) => {
    console.log('Error adding data', err);
  }).then(() => {

  }).catch(err => {
    console.log('Error closing pool');
  });
}

// promisify given function x# of times and resolve one by one
const queueInserts = async function(iterations, insertion) {
  const t0 = performance.now();
  for (let i = 0; i < iterations; i++) {
    await(insertion(500000))
  }
  db.$pool.end();
  const t1 = performance.now();
  console.log('Performance in ms', t1 - t0)
}

queueInserts(20, databaseInsert);