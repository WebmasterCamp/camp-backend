import mongoose from 'mongoose'
import Promise from 'bluebird'
mongoose.Promise = Promise

const schema = new mongoose.Schema({
  __v: { type: Number, select: false },
  string: String,
})

export default mongoose.model('Unique', schema)
