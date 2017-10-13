const formidable = require('formidable')
const fs = require('fs')
const indexHtmlPath = './views/index.html'
let Tag = require('../models/TagSchema')

module.exports = (req, res) => {
  if (req.pathname === '/generateTag' && req.method === 'POST') {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err)
        return
      }

      let tag = new Tag({
        name: fields.tagName
      }).save((err, tag) => {
        if (err) {
          console.log(err)
          return
        }
        console.log(`Tag with tag name: ${tag.name} successfully saved to db!`)
      })
      fs.readFile(indexHtmlPath, 'utf8', (err, data) => {
        if (err) {
          console.log(err.message)
          return
        }
        let htmlBody = []

        Tag.find({}, (err, tags) => {
          if (err) {
            console.log(err.message)
            return
          }
          htmlBody.push('<div>')
          for (let tag of tags) {
            htmlBody.push(`<div class="tag" id="${tag._id}">${tag.name}</div>`)
          }
          htmlBody.push('</div>')
        }).then(() => {
          let html = data.replace('<div class="replaceMe"></div>', htmlBody.join(''))
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.write(html)
          res.end()
        })
      })
    })
  } else {
    return true
  }
}
