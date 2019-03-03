const cassandra = require('cassandra-driver')
const {generateData} = require('./cassandraHelpers')

//connection to client
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'reviews'
})

//create database entries
const insertBatch = async (num) => {
  //create query to insert entries
  let query = `INSERT INTO reviews.reviews (review_id, title, pros, cons, body, verified, date, eggs, author, helpful, not_helpful, item_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?)`
  
  for (let i = 0; i < num; i++) {
    let params = generateData(query)
    await client.execute(query, params, {prepare: true}).then(() => console.log(`Item ${i}inserted into db`))
  }
}

const promiseThreadedExecution = async (iterations) => {
  var promiseQueue = [];

  for (let i = 0; i < iterations; i++) {
    var promise = new Promise((resolve) => {
      resolve(insertBatch(50000))
    })
    promiseQueue.push(promise)
  }
  await Promise.all(promiseQueue)

  await client.shutdown().then(() => console.log('Closing connection to db')).catch((err) => console.log(`Error closing db`, db))
}

promiseThreadedExecution(10);