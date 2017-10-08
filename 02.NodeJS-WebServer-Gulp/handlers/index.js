const statusHandler = require('./status-handler')
const homeHandler = require('./home-handler')
const staticHandler = require('./static-files-handler')
const addMovieHandler = require('./add-movie-handler')
const viewAllMoviesHandler = require('./view-all-movies-handler')
const detailsHandler = require('./details-handler')

module.exports = [statusHandler, homeHandler, staticHandler, addMovieHandler, viewAllMoviesHandler, detailsHandler]
