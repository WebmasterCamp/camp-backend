const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema.Types

const schema = new Schema({
  __v: { type: Number, select: false },
  user: { type: ObjectId, ref: 'User' },
  admin: { type: ObjectId, ref: 'Admin' },
  isAdmin: Boolean,
  facebook: String,
  token: String,
  mail: String,
  name: String,
})

export default mongoose.model('Session', schema)
