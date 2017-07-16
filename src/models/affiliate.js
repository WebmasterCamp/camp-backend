const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  __v: { type: Number, select: false },
  name: String,
  url: String,
  approved: Boolean
});

export default mongoose.model('Affiliate', schema);
