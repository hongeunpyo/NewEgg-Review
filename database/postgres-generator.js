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

//using pg-promises to connect to database
const db = pgp(cn);

// var sql = `INSERT INTO reviews (item_id, title, pros, cons, body, verified, date, eggs, author) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`
var colSet = new pgp.helpers.ColumnSet(['review_array'],  {table: 'reviews'})

// generate values according to random input
const dataGenerate = function() {
  const values = []
  for (let i = 0; i < 100001; ++i) {
    var item = value_gen(Math.floor(Math.random() * 10))
    if (Object.keys(item).length !== 0) {
      item = value_gen(Math.floor(Math.random() * 10));
      values.push(item);
    }
    if (i % 50000 === 0) {
      console.log(`ay we made it ${i}`)
    }
  }
  databaseInsert(values);
}

const databaseInsert = function(array) {
  const query = pgp.helpers.insert(array, colSet);
  db.none(query).then((data) => {
    console.log('Data successfully seeded')
  }).catch((err) => {
    console.log('Error adding data', err)
  }).then(() => {
  }).catch(err => {
    console.log('Error closing pool')
  });
}

//promisify given function x# of times and resolve one by one
const queueInserts = function(iterations, generator) {
  var queue = [];

  for (let i = 0; i < iterations; i++) {
    queue.push(new Promise((resolve, reject) => {
      resolve(generator());
    }))
  }
  
  // const serializePromises = (funcs) => {
  //   funcs.reduce((promise, func) => {
  //     promise.then((result) => {
  //       func().then(Array.prototype.concat.bind(result))
  //     })
  //     promise.resolve([]);
  //   })
  // }
  // serializePromises(queue);
  // Promise.all(queue).then(() => {
  //   console.log('Promise resolved');
  // }).catch((err) => {
  //   console.log('Error occurred while resolving promises')
  // })
  db.$pool.end();
}

queueInserts(4, dataGenerate);

  // for (let i = 0; i < queue.length; i++) {
  //   console.log('queue Iterations',i);
  //   Promise.all(queue[0]).then(() => {
  //     console.log('Promise resolved')
  //   }).catch(() => {
  //     console.log('Promise failed')
  //   })
  //   queue.pop();
  // }