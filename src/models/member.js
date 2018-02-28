const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
  __v: { type: Number, select: false },
  facebook: String,
  nickName: String,
  sex: String,
  picture: String,
  vote_count: { type: Number, default: 0 },
  vote_special: { type: Number, default: 0 },
  voted_boy: { type: Boolean, default: false },
  voted_girl: { type: Boolean, default: false },
  voted_special: { type: Boolean, default: false },
})

export default mongoose.model('Member', schema)
