const mongoose = require('mongoose');
const { Schema } = mongoose;
import _ from 'lodash';

const answerSchema = new Schema({
  __v: { type: Number, select: false },
  answer: String,
  point: { type: Number, select: false, default: 0 }
});

const schema = new Schema({
  __v: { type: Number, select: false },
  completedMajor: [String],
  confirmedMajor: {
    type: String,
    enum: ['content', 'programming', 'design', 'marketing']
  },
  generalQuestions: [answerSchema],
  specialQuestions: {
    design: [_.cloneDeep(answerSchema)],
    marketing: [_.cloneDeep(answerSchema)],
    content: [_.cloneDeep(answerSchema)],
    programming: [_.cloneDeep(answerSchema)]
  },
  answerFile: String,
  answerFileUrl: String
});

export default mongoose.model('Question', schema);
