const qs = require('query-string')
const fs = require('fs')
const showResultsPath = './views/results.html'
const minDateNumber = -8640000000000000
const maxDateNumber = 8640000000000000
let Image = require('../models/ImageSchema')
let Tag = require('../models/TagSchema')

module.exports = (req, res) => {
  if (req.pathname === '/search') {
    let searchArgs = qs.parse(qs.extract(req.url))

    let tagsArr = searchArgs.tagName.split(',').map(tag => tag.trim()).filter(tag => { return tag !== '' })
    let postedAfter = searchArgs.afterDate || minDateNumber
    let postedBefore = searchArgs.beforeDate || maxDateNumber
    let limitCount = Number(searchArgs.Limit) || 10

    let minDate = new Date(postedAfter)
    let maxDate = new Date(postedBefore)

    let htmlBody = []
    let images = []

    fs.readFile(showResultsPath, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      if (tagsArr.length === 0) {
        images = Image.find({}).exec((err, images) => {
          if (err) {
            console.log(err)
            return
          }
          for (let image of images) {
            htmlBody.push(`<fieldset> <legend>${image.title}:</legend> 
            <img src="${image.URL}">
            </img><p>${image.description}</p>
            <button onclick="location.href='/delete?id=${image._id}'" class="deleteBtn">Delete
            </button>
            </fieldset>`)
          }
          res.writeHead(200, { 'Content-type': 'text/html' })
          res.write(data.replace('<div class="replaceMe"></div>', htmlBody.join('')))
          res.end()
        })
      } else if (tagsArr.length > 0) {
        let tags = Tag.find({ 'name': { $in: tagsArr } }, (err, tags) => {
          if (err) {
            console.log(err)
            return
          }
          Image.find({ 'tags': { $elemMatch: { $in: tags } } }).sort({ creationDate: 'descending' }).exec((err, images) => {
            if (err) {
              console.log(err)
              return
            }
            for (let image of images) {
              htmlBody.push(`<fieldset> <legend>${image.title}:</legend> 
              <img src="${image.URL}">
              </img><p>${image.description}</p>
              <button onclick="location.href='/delete?id=${image._id}'" class="deleteBtn">Delete
              </button>
              </fieldset>`)
            }
            res.writeHead(200, { 'Content-type': 'text/html' })
            res.write(data.replace('<div class="replaceMe"></div>', htmlBody.join('')))
            res.end()
          })
        })
      } else if (postedAfter || postedBefore) {
        // It is not clear if the entries should be ordered by most recent when searching by date or not
        Image.find({ creationDate: { $gt: minDate, $lt: maxDate } }).limit(limitCount).exec((err, images) => {
          if (err) {
            console.log(err)
            return
          }
          for (let image of images) {
            htmlBody.push(`<fieldset> <legend>${image.title}:</legend> 
            <img src="${image.URL}">
            </img><p>${image.description}</p>
            <button onclick="location.href='/delete?id=${image._id}'" class="deleteBtn">Delete
            </button>
            </fieldset>`)
          }
          res.writeHead(200, { 'Content-type': 'text/html' })
          res.write(data.replace('<div class="replaceMe"></div>', htmlBody.join('')))
          res.end()
        })
      }
    })
  } else {
    return true
  }
}
