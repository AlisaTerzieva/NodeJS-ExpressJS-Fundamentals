const formidable = require('formidable')
const qs = require('query-string')
let Image = require('../models/ImageSchema')

let addImage = (req, res) => {
  let form = new formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err)
      return
    }
    let image = new Image({
      URL: fields.imageUrl,
      creationDate: Date.now(),
      title: fields.imageTitle,
      description: fields.description,
      tags: fields.tagsID.split(',').filter(tag => { return tag !== '' })
    }).save((err, image) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(`Successfully saved image with URL: ${image.URL}`)
    })
    res.writeHead(302, { 'Location': '/' })
    res.end()
  })
}

let deleteImg = (req, res) => {
  let imgId = qs.parse(qs.extract(req.url)).id
  Image.find({ _id: imgId }).remove().exec((err, result) => {
    if (err) {
      console.log(err)
      return
    }
    res.writeHead(302, { 'Location': '/' })
    res.end()
  })
}
module.exports = (req, res) => {
  if (req.pathname === '/addImage' && req.method === 'POST') {
    addImage(req, res)
  } else if (req.pathname === '/delete' && req.method === 'GET') {
    deleteImg(req, res)
  } else {
    return true
  }
}
