const cassandra = require('cassandra-driver');
const client = new cassandra.Client({contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1', keyspace: 'reviews'})

//Function to reset database for fresh data generation
var resetDB = async function() {
  await client.execute(`DROP KEYSPACE IF EXISTS reviews`)
  .then(() => {
    console.log('Keyspace reviews dropped');
  }).catch((err) => {
    console.log('Error occurred when dropping keyspace', err)
  })
  
  
  await client.execute(`CREATE KEYSPACE reviews WITH REPLICATION = {
    'class': 'SimpleStrategy',
    'replication_factor': 1
  }`).then(() => {
    console.log('Keyspace reviews created');
  }).catch((err) => {
    console.log('Error occurred when creating keyspace', err)
  })
  
  await client.shutdown()
  .then(() => {
    console.log('Closing connection to Cassandra db...');
  }).catch((err) => {
    console.log('Error while shutting down connection to db...');
  })
}

//initializes tables in keyspace reviews
const initializeTables = async () => {
  await client.execute(`DROP TABLE IF EXISTS reviews`).then(() => console.log('Table reviews dropped')).catch((err) => console.log('Error occurred when dropping reviews table', err))
  //cassandra does not take in default values
  //inserting null will delete the column
  await client.execute(`CREATE TABLE reviews (
    review_id UUID PRIMARY KEY,
    title text,
    pros text,
    cons text,
    body text,
    verified text,
    date text,
    eggs int,
    author text,
    helpful int,
    not_helpful int,
    item_id int
  )`).then(() => console.log('Table reviews created')).catch((err) => console.log('Error occurred while creating table reviews', err))
}

resetDB(initializeTables());