const dbPath = 'mongodb://localhost:27017/mongoosedemo'
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

module.exports = mongoose.connect(dbPath, {
    useMongoClient: true
})
