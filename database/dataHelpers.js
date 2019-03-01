const {author, body, pros, cons, title, date, verified, item_id, eggs} = require('./generator')
const faker = require('faker');

//someStaticData
var staticArr = JSON.stringify([title(), pros(), cons(), body(), author()])

module.exports = {
  value_gen: () => {
    var obj = {}
      obj['review_data'] = null;
      obj['static_data'] = staticArr;
      obj['item_id'] = item_id(10000000);
      obj['review_data'] = JSON.stringify([verified(), date(1000), eggs(5)])
    return obj;
  }
}