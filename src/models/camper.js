import mongoose, {Schema} from 'mongoose'

const majors = ['content', 'programming', 'design', 'marketing']

const religions = [
  'atheist',
  'buddhism',
  'christianity',
  'islam',
  'hinduism',
  'sikhism',
  'taoism',
  'other',
]

const CamperSchema = new Schema({
  __v: {type: Number, select: false},
  name: {type: String, required: true},
  age: {type: Number},
  parent: {type: Schema.ObjectId, ref: 'Parent'},
  major: {type: String, enum: majors, required: true},
  religion: {type: String, enum: religions},
  education: {type: String, required: true},
  school: String,
  address: String,
  phone: {type: String},
  email: {type: String},
  social: String,
  syndromes: String,
  foodAllergies: String,
  drugAllergies: String,
})

const Camper = mongoose.model('Camper', CamperSchema)

export default Camper
