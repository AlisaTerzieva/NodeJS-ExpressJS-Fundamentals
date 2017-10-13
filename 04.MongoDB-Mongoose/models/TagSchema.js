const mongoose = require('mongoose')
let Schema = mongoose.Schema
const ObjId = Schema.Types.ObjectId

let tagSchema = new Schema({
  name: { type: String, required: true },
  creationDate: {type: Date, required: true, default: Date.now()},
  images: [{type: ObjId, ref: 'Image'}]
})

tagSchema.methods.nameToLower = function () {
  return this.name.toLowerCase()
}

let Tag = mongoose.model('Tag', tagSchema)

// let test = new Tag({
//   name: 'Test',
//   creationDate: Date.now()
// })

// console.log(test.nameToLower())
module.exports = {
  Tag: Tag
}
