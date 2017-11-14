import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
  major: {
    type: String,
    enum: ['content', 'programming', 'design', 'marketing'],
    unique: true
  },
  order: { type: Number, default: 1 }
});

export default mongoose.model('Queue', schema);
