const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  __v: { type: Number, select: false },
  username: { type: String, required: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'programmer', 'designer', 'content', 'marketing']
  }
});

export default mongoose.model('Admin', schema);
