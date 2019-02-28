const faker = require('faker');

module.exports = {
    author: () => {
        let value = Math.floor(Math.random() * 5) + 1
        if (value === 5) {
            return 'Anonymous';
        }
        return faker.name.findName()},
    body: () => faker.lorem.paragraph(),
    pros: () => faker.lorem.sentence(),
    cons: () => faker.lorem.sentence(),
    title: () => faker.lorem.words(),
    date: (n) => JSON.stringify(faker.date.recent(n)).replace(/"/g, ''),
    verified: () => {
        let value = Math.floor(Math.random() * 2)
        if (value === 0) {
            return 'F'
        }
        return 'T'
    },
    item_id: (max) => (Math.floor(Math.random() * max) + 1),
    eggs: (max) => (Math.floor(Math.random() * max) + 1)
}