const fs = require('fs')
const filePath = './views/home.html'
const utils = require('../utils/default')

module.exports = (req, res) => {
  if (req.pathname === '/' && req.method === 'GET') {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        utils.defaultErrorRes(res, err)
        return
      }
      utils.defaultSuccessRes(res, data)
    })
  } else {
    return true
  }
}
