const fs = require('fs')
const htmlPath = './build/html/home.html'
const faviconPath = './public/images/favicon.ico'
const utils = require('../utils/default')

module.exports = (req, res) => {
  if (req.url === '/favicon.ico' && req.method === 'GET') {
    fs.readFile(faviconPath, (err, data) => {
      if (err) {
        utils.defaultFailedReq(res, err)
        return
      }
      utils.defaultSuccessReq(res, data, 'image/x-icon')
    })
  } else if (req.url === '/' && req.method === 'GET') {
    fs.readFile(htmlPath, (err, data) => {
      if (err) {
        utils.defaultFailedReq(res, err)
        return
      }
      utils.defaultSuccessReq(res, data, 'text/html')
    })
  } else return true
}
