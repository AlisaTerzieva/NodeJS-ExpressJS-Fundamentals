const mongoose = require('mongoose')
let Schema = mongoose.Schema
const ObjId = Schema.Types.ObjectId

let imageSchema = new Schema({
  URL: String,
  creationDate: Date,
  description: String,
  tags: [{type: ObjId, ref: 'Tag'}]
})

let Image = mongoose.model('Image', imageSchema)

module.exports = {
  Image: Image
}
