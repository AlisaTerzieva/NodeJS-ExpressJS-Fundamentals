const fs = require('fs')
const formidable = require('formidable')
const utils = require('../utils/default')
const db = require('../config/dataBase')
const addMoviePath = './build/html/addMovie.html'

module.exports = (req, res) => {
  if (req.url === '/addMovie' && req.method === 'GET') {
    fs.readFile(addMoviePath, (err, data) => {
      if (err) {
        utils.defaultFailedReq(res, err)
        return
      }
      utils.defaultSuccessReq(res, data, 'text/html')
    })
  } else if (req.url === '/addMovie' && req.method === 'POST') {
    fs.readFile(addMoviePath, 'utf8', (err, data) => {
      if (err) {
        utils.defaultFailedReq(res, err)
        return
      }
      let form = new formidable.IncomingForm()
      form.parse(req, (err, fields, files) => {
        if (err) {
          utils.defaultFailedReq(res, err)
          return
        }
        if (!fields['movieTitle'] || !fields['moviePoster']) {
          res.writeHead(200, { 'content-type': 'text/html' })
          res.write(data.replace('<div id="replaceMe">{{replaceMe}}</div>', `<div id="errBox">
          <h2 id="errMsg">Please fill all fields</h2>
          </div>`))
          res.end()
          return
        }
        let entry = {
          movieTitle: fields['movieTitle'],
          movieYear: fields['movieYear'],
          moviePoster: fields['moviePoster'],
          movieDescription: fields['movieDescription']
        }
        res.writeHead(200, { 'content-type': 'text/html' })
        res.write(data.replace('<div id="replaceMe">{{replaceMe}}</div>', `<div id="succssesBox">
          <h2 id="succssesMsg">Movie Added</h2>
          </div>`))
        res.end()
        db.push(entry)
      })
    })
  } else return true
}
