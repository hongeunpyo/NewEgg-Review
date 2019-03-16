const redis = require('redis');
const {promisify} = require('util');
const {RPASS} = require('./redis-config')
const client = redis.createClient(process.env.REDIS_URL);
// client.auth(RPASS)

module.exports = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  keysAsync: promisify(client.keys).bind(client)
};