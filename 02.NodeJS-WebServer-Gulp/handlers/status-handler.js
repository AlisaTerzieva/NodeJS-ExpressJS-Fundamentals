const fs = require('fs')
const utils = require('../utils/default')
const db = require('../config/dataBase')
const statusPath = './build/html/status.html'

// Use Postman or another tool for creating custom requests to test this functionality
// Request Headers: { Content-Type: text/html,
//                    StatusHeader: Full }
module.exports = (req, res) => {
  if (req.headers.statusheader === 'Full') {
    fs.readFile(statusPath, 'utf8', (err, data) => {
      if (err) {
        utils.defaultFailedReq(res, err)
        return
      }
      let moviesCount = db.length
      let html = data.replace('{{replaceMe}}', `Movies count is ${moviesCount}`)
      utils.defaultSuccessReq(res, html, 'text/html')
    })
  } else return true
}
