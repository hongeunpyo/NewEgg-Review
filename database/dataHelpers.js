const {author, body, pros, cons, title, date, verified, item_id, eggs} = require('./generator')

module.exports = {
  value_gen: (n) => {
    var values = [];
    var obj = {}
    if (n === 0) {
      obj['review_array'] = null;
    } else {
      // for (let i = 0; i < n; ++i) {
          values.push([item_id(10000000),title(), pros(), cons(), body(), verified(), date(1000), eggs(5), author()])
          obj['review_array'] = JSON.stringify(values)
      // }
    }
    return obj;
  }
}