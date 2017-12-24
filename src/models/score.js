import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
  group: {
    type: String,
    unique: true
  },
  score: { type: Number, default: 0 }
});

export default mongoose.model('Score', schema);
