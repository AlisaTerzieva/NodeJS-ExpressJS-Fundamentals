const mongoose = require('mongoose')
let Schema = mongoose.Schema
const ObjId = Schema.Types.ObjectId

let tagSchema = new Schema({
  name: { type: String, required: true },
  creationDate: {type: Date, required: true},
  images: [{type: ObjId, ref: 'Image'}]
})

tagSchema.methods.nameToLower = function () {
  return this.name.toLowerCase()
}

module.exports = mongoose.model('Tag', tagSchema)
