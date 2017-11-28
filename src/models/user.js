import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const schema = new Schema({
  __v: { type: Number, select: false },
  facebook: String,
  status: String,
  questions: { type: ObjectId, ref: 'Question' },
  completed: [Boolean], // Mark boolean to check that user has done each step,
  completed_at: Date,
  // Step 1 Form field
  title: {
    type: String,
    enum: ['นาย', 'นางสาว']
  },
  firstName: String,
  lastName: String,
  firstNameEN: String,
  lastNameEN: String,
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
  religion: {
    type: String,
    enum: ['พุทธ', 'คริสต์', 'อิสลาม', 'พราหมณ์', 'สิกข์', 'ไม่ระบุ']
  },
  blood: {
    type: String,
    enum: ['A', 'B', 'O', 'AB']
  },
  age: Number, // Aim to deprecated
  // Step 2 Form field
  address: String,
  province: String,
  postalCode: String,
  email: String,
  phone: String,
  emergencyPhone: String,
  emergencyPhoneRelated: String,
  emergencyName: String,
  shirtSize: String,
  food: String,
  disease: String,
  med: String,
  foodAllergy: String,
  medAllergy: String,
  skype: String,
  // Step 3 form field
  knowCamp: [String],
  activities: String,
  knowCampAnother: { type: String, required: false }, // Aim to deprecated
  whyJoinYwc: String,
  expectation: String,

  designPortfolio: String,
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
  slips: [String],

  // Grading stage
  isPassStageOne: {
    type: Boolean,
    default: false
  },
  isJudgeStageTwo: {
    type: Boolean,
    default: false
  },
  isPassStageTwo: {
    type: Boolean,
    default: false
  },
  noteStageTwo: String,
  isJudgeMajorQuestion: {
    type: Boolean,
    default: false
  },
  isPassStageThree: {
    type: Boolean,
    default: false
  },
  grader_id: { type: ObjectId, ref: 'Admin' },
  interviewRef: String,
  isFinalist: Boolean,
  isFinalistBackup: Boolean
});

export default mongoose.model('User', schema);
