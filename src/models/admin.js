const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  __v: { type: Number, select: false },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    required: true,
    enum: [
      'admin',
      'programming',
      'designer',
      'content',
      'marketing',
      'stage-1',
      'stage-2'
    ]
  }
});

export default mongoose.model('Admin', schema);
