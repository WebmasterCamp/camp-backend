const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  transfer_money: { type: String, required: true },
  status: String,
  no: String
});

export default mongoose.model('Slip', schema);
