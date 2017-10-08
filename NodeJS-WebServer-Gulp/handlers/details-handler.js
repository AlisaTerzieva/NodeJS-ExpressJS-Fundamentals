const fs = require('fs')
const utils = require('../utils/default')
const db = require('../config/dataBase')
const detailsPath = './build/html/details.html'

module.exports = (req, res) => {
  if (req.url.startsWith('/movies/details/') && req.method === 'GET') {
    let index = req.url.lastIndexOf('/')
    let movieNo = req.url.substr(index + 1, req.url.length - 1)
    fs.readFile(detailsPath, 'utf8', (err, data) => {
      if (err) {
        utils.defaultFailedReq(res, err)
        return
      }
      db.sort(utils.compareMovies)
      let currentMovie = db[movieNo]
      let movieHtml = `
      <div class="content">
        <img src="${decodeURIComponent(
          currentMovie['moviePoster'])}" alt=""/>
        <h3>Title  ${decodeURIComponent(
          currentMovie['movieTitle']
            .replace(/\+/g, ' '))}</h3>
        <h3>Year ${decodeURIComponent(
          currentMovie['movieYear'])}</h3>
        <p> ${decodeURIComponent(
          currentMovie['movieDescription']
            .replace(/\+/g, ' '))}</p>
      </div>`
      let html = data.replace('<div id="replaceMe">{{replaceMe}}</div>', movieHtml)
      utils.defaultSuccessReq(res, html, 'text/html')
    })
  } else return true
}
