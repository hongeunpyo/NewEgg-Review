const { Pool, Client } = require('pg');
const { performance } = require('perf_hooks')
const {PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT} = require('./postgres.config');
const {author, body, pros, cons, title, date, verified, item_id, eggs} = require('../generator')
const {value_gen} = require('./dataHelpers.js')
const pgp = require('pg-promise')({
  capSQL: true
});

//config for connecting to database
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
  return values;
}

// insertion function that will insert into database and call data generation
const databaseInsert = async function(iterations, number) {
  var array = dataGenerate(number);
  var colSet = new pgp.helpers.ColumnSet(['title', 'pros', 'cons', 'body', 'verified', 'date', 'eggs', 'author', 'item_id'],  {table: 'reviews'});
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

const idInsert = async function(iterations, batchSize) {
  var colSet = new pgp.helpers.ColumnSet(['item_id'], {table: 'items'});
  
  var arr = [];
  for (let i = 1 + batchSize * iterations; i <= batchSize + (batchSize * iterations); ++i) {
    var obj = {};
    obj['item_id'] = i;
    // console.log(obj);
    arr.push(obj);
    if (i % 100000 === 0) {
      console.log(`@ iteration ${iterations}, inserting ${i} entries`)
    }
  }
  const query = pgp.helpers.insert(arr, colSet);
  await db.none(query).then(()=>{console.log('DB seeded')})
}

// promisify given function x# of times and resolve one by one
const queueInserts = async function(batchSize, generationFunction) {
  const t0 = performance.now();
  var iterations = 10000000/batchSize
  console.log(iterations)
  for (let i = 0; i < iterations; ++i) {
    await(generationFunction(i, batchSize))
  }

  //testing performance of seeder
  const t1 = performance.now();
  console.log('Performance in ms', t1 - t0)

}

const insertController = async function() {
  // await queueInserts(500000, idInsert);
  await queueInserts(500000, databaseInsert);
  await db.$pool.end();
}

insertController();