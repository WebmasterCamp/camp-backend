import mongoose, {Schema} from 'mongoose'

const ParentSchema = new Schema({
  __v: {type: Number, select: false},
  name: String,
  relation: String,
  phone: String,
})

const Parent = mongoose.model('Parent', ParentSchema)

export default Parent
