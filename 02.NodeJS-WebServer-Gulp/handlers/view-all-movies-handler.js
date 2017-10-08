const fs = require('fs')
const utils = require('../utils/default')
const db = require('../config/dataBase')
const viewMoviesPath = './build/html/viewAll.html'

module.exports = (req, res) => {
  if (req.url.startsWith('/viewAllMovies') && req.method === 'GET') {
    fs.readFile(viewMoviesPath, 'utf8', (err, data) => {
      if (err) {
        utils.defaultFailedReq(res, err)
        return
      }
      let moviesArr = []
      db.sort(utils.compareMovies)
      for (let movie of db) {
        moviesArr.push(
          `<div class="movie">
            <a href="/movies/details/${db.indexOf(movie)}">
              <img class="moviePoster" src="${decodeURIComponent(movie.moviePoster)}"/>
            </a>         
          </div>`)
      }
      let html = data.replace('<div id="replaceMe">{{replaceMe}}</div>', moviesArr.join(''))
      utils.defaultSuccessReq(res, html, 'text/html')
    })
  } else return true
}
