import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const schema = new Schema({
  __v: { type: Number, select: false },
  facebook: String,
  status: String,
  questions: { type: ObjectId, ref: 'Question' },
  // step: { type: Number, default: 0 },
  completed: [Boolean],
  title: String,
  firstName: String,
  lastName: String,
  nickName: String,
  faculty: String,
  department: String,
  // academicYear: String,
  academicYear: Number,
  university: String,
  sex: String,
  birthdate: Date,
  age: Number,
  address: String,
  province: String,
  postCode: String,
  phone: String,
  email: String,
  line: String,
  interview: String,
  homework: [{ question: String, answer: String, upload_url: String }],
  idInterview: { type: String, required: false },
  interview_time: String,
  confirm_interview: Boolean,
  blood: String,
  foodAllergy: String,
  disease: String,
  medicine: String,
  knowCamp: String,
  knowCampAnother: { type: String, required: false },
  whyJoinYwc: String,
  prominentPoint: String,
  event: String,
  portfolio: String,
  portfolioUrl: String,
  answerFile: String,
  picture: String,
  updated_at: Date,
  no: String,
  transfer_money: String,
  slips: [String],
  major: {
    type: String,
    enum: ['content', 'programmer', 'designer', 'marketing']
  }
});

export default mongoose.model('User', schema);
