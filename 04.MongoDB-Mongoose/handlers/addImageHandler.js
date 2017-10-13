const formidable = require('formidable')
let Image = require('../models/ImageSchema')

// URL: String,
// creationDate: Date,
// description: String,
// tags: [{ type: ObjId, ref: 'Tag' }]

let addImage = (req, res) => {
  let form = new formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err)
      return
    }
    let image = new Image({
      URL: fields.imageUrl,
      description: fields.description,
      tags: fields.tagsID.substr(0, fields.tagsID.length - 1).split(',')
    }).save((err, image) => {
      if (err) {
        console.log(err)
        return
      }
    })
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
