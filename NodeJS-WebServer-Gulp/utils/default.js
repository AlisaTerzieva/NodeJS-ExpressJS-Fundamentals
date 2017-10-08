const types = {
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.html': 'text/html'
}

let defaultFailedReq = (res, err) => {
  res.writeHead(404, {
    'content-type': 'text/plain'
  })
  res.write('Resource not found!')
  console.log(err.message)
  res.end()
}

let defaultSuccessReq = (res, data, contentType) => {
  res.writeHead(200, {
    'content-type': contentType
  })
  res.write(data)
  res.end()
}

let getFileType = (urlString) => {
  let ind = urlString.lastIndexOf('.')
  let ext = urlString.substr(ind, urlString.length - 1)
  if (types.hasOwnProperty(ext)) {
    return types[ext]
  }
  return false
}

let compareMovies = (a, b) => {
  if (b.movieYear !== a.movieYear) { return b.movieYear - a.movieYear }
  return a.movieTitle.localeCompare(b.movieTitle)
}

module.exports = {
  defaultFailedReq: defaultFailedReq,
  defaultSuccessReq: defaultSuccessReq,
  getFileType: getFileType,
  compareMovies: compareMovies
}
