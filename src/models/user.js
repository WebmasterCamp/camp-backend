import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const schema = new Schema({
  __v: { type: Number, select: false },
  facebook: String,
  status: String,
  questions: { type: ObjectId, ref: 'Question' },
  completed: [Boolean], // Mark boolean to check that user has done each step
  title: {
    type: String,
    enum: ['นาย', 'นางสาว']
  },
  firstName: String,
  lastName: String,
  nickname: String,
  faculty: String,
  department: String,
  academicYear: {
    type: String,
    enum: ['ปี 1', 'ปี 2', 'ปี 3', 'ปี 4', 'ปี 5', 'ปี 6', 'ปวส. ปี 1', 'ปวส. ปี 2']
  },
  university: String,
  sex: {
    type: String,
    enum: ['ชาย', 'หญิง']
  },
  birthdate: Date,
  age: Number, // Aim to deprecated
  address: String,
  province: String,
  postalCode: String,
  phone: String,
  email: String,
  blood: {
    type: String,
    enum: ['A', 'B', 'O', 'AB']
  },
  foodAllergy: String,
  medAllergy: String,
  disease: String,
  knowCamp: {
    type: String,
    enum: [
      'คนรู้จัก',
      'facebook',
      'email',
      'roadshow',
      'twitter',
      'other'
    ]
  },
  knowCampAnother: { type: String, required: false }, // Aim to deprecated
  whyJoinYwc: String,
  expectation: String,

  major: {
    type: String,
    enum: ['content', 'programming', 'design', 'marketing']
  },

  line: String,
  interview: String,
  homework: [{ question: String, answer: String, upload_url: String }],
  idInterview: { type: String, required: false },
  interview_time: String,
  confirm_interview: Boolean,
  prominentPoint: String,
  event: String,
  portfolio: String,
  portfolioUrl: String,
  answerFile: String,
  picture: String,
  updated_at: Date,
  no: String,
  transfer_money: String,
  slips: [String]
});

export default mongoose.model('User', schema);
