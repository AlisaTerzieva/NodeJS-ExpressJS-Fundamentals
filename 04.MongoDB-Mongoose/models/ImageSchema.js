const mongoose = require('mongoose')
let Schema = mongoose.Schema
const ObjId = Schema.Types.ObjectId

let imageSchema = new Schema({
  URL: { type: String, required: true },
  title: { type: String },
  creationDate: { type: Date },
  description: { type: String },
  tags: [{ type: ObjId, ref: 'Tag' }]
})

module.exports = mongoose.model('Image', imageSchema)
