const {author, body, pros, cons, title, date, verified, item_id, eggs} = require('../generator')
const Uuid = require('cassandra-driver').types.Uuid
const faker = require('faker');

//someStaticData
var staticObj = {
  title: title(),
  pros: pros(),
  cons: cons(),
  body: body(),
  author: author()
}
module.exports = {
  generateData: () => {
    var queries = []
      // var obj = {}
      // obj['query'] = query
      // obj['params'] = []
      const id = Uuid.random();
      var params = [id, staticObj.title, staticObj.pros, staticObj.cons, staticObj.body, verified(), date(1000), eggs(5), staticObj.author, 0, 0, item_id(10000000)]
      // obj.params.push(...params);
      // queries.push(obj);
      // queries.push(params);
    return params;
  }
}
