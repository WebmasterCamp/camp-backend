import mongoose from 'mongoose';
import { User } from '../src/models';
import config from 'config';
import pdf from 'html-pdf';
import moment from 'moment';
import 'moment/locale/th';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || config.MONGODB_URI);

import question from '../src/routes/static-question';
import { majorAsText } from '../src/utilities/helpers';

const pdfOption = {
  format: 'A4',
  border: {
    top: '0.8in',
    right: '0.6in',
    bottom: '0.8in',
    left: '0.6in'
  }
};

const renderName = user => `
  <div class="row">
    <div>
      <img class="user-img" style="background-image: url('https://api.ywc15.ywc.in.th/${user.picture}');" />
    </div>
    <div class="col" style="padding-left: 10px;">
      <h1>${user.title}${user.firstName} ${user.lastName} (น้อง${user.nickname})</h1>
      <h1><b>สาขา:</b> ${majorAsText(user.major)}</h1>
      <h1>Ref: M01</h1>
    </div>
  </div>
`;

const renderAcademicProfile = user => `
  <div class="col">
    <h1>การศึกษา</h1>
    <p><b>ชั้นปี:</b> ${user.academicYear}</p>
    <p><b>คณะ:</b> ${user.faculty}</p>
    <p><b>สาขาวิชา:</b> ${user.department}</p>
    <p><b>สถาบัน:</b> ${user.university}</p>
  </div>
`;

const renderContact = user => `
  <div class="col">
    <h1>ข้อมูลติดต่อ</h1>
    <p><b>ที่อยู่:</b> ${user.address} จังหวัด${user.province} ${user.postalCode}</p>
    <p><b>Email:</b> ${user.email}</p>
    <p><b>เบอร์ติดต่อ:</b> ${user.phone}</p>
    <p><b>ผู้ติดต่อฉุกเฉิน:</b> ${user.emergencyName} (${user.emergencyPhoneRelated})</p>
    <p><b>เบอร์ติดต่อฉุกเฉิน:</b> ${user.emergencyPhone}</p>
  </div>
`;

const renderAcademicAndProfile = user => `
  <div class="row">
    ${renderAcademicProfile(user)}
    ${renderContact(user)}
  </div>
`;


const renderMoreInfo = user => `
  <div>
    <h1>ข้อมูลเพิ่มเติม</h1>
    <div class="row">
      <div class="col col-2">
        <p><b>วันเกิด:</b> ${moment(user.birthdate).format('D MMMM YYYY')}</p>
        <p><b>กรุ๊ปเลือด:</b> ${user.blood}</p>
        <p><b>ศาสนา:</b> ${user.religion}</p>
        <p><b>ไซส์เสื้อ:</b> ${user.shirtSize}</p>
        <p><b>รู้จักค่ายได้ผ่านช่องทางไหน:</b> ${user.knowCamp.join(', ') || '-'}</p>
      </div>
      <div class="col col-3">
        <p><b>โรคประจำตัว:</b> ${user.disease || '-'}</p>
        <p><b>ยาที่ใช้ประจำ:</b> ${user.med || '-'}</p>
        <p><b>ยาที่แพ้:</b> ${user.medAllergy || '-'}</p>
        <p><b>อาหารที่รับประทาน:</b> ${user.food || '-'}</p>
        <p><b>อาหารที่แพ้:</b> ${user.foodAllergy || '-'}</p>
      </div>
    </div>
  </div>
`;

const renderActivity = user => `
  <div>
    <h1>กิจกรรมและความสามารถพืเศษ</h1>
    <p class="answer">${user.activities}</p>
  </div>
`;

const renderGeneralQuestion = answers => `
  <div>
    <h1>คำถามส่วนกลาง</h1>
    ${answers.generalQuestions.map((answer, idx) => (`
      <p><b>${(idx + 1)}.${question.generalQuestions[idx]}</b></p>
      <p class="answer">${answer.answer}</p>
    `)).join('<br>')}
  </div>
`;

const renderMajorQuestion = (answers, major) => `
  <div>
    <h1>คำถามสาขา</h1>
    ${answers.specialQuestions[major].map((answer, idx) => (`
      <p><b>${(idx + 1)}.${question.specialQuestions[major][idx]}</b></p>
      <p class="answer ${major === 'programming' && idx === 3 ? 'code' : ''}">${answer.answer}</p>
    `)).join('<br>')}
  </div>
`;

const generatePdf = user => `
<html>
<head>
  <link href="https://fonts.googleapis.com/css?family=Trirong:400,700" rel="stylesheet">
</head>
<body>
  ${renderName(user)}
  <br>
  ${renderAcademicAndProfile(user)}
  <br>
  ${renderMoreInfo(user)}
  <br>
  ${renderActivity(user)}
  <br>
  ${renderGeneralQuestion(user.questions)}
  <br>
  ${renderMajorQuestion(user.questions, user.major)}
  <style>html,body,p,ol,ul,li,dl,dt,dd,blockquote,figure,fieldset,legend,textarea,pre,iframe,hr,h1,h2,h3,h4,h5,h6{margin:0;padding:0}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:normal}ul{list-style:none}button,input,select,textarea{margin:0}html{box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}img,embed,iframe,object,audio,video{height:auto;max-width:100%}iframe{border:0}table{border-collapse:collapse;border-spacing:0}td,th{padding:0;text-align:left}</style>
  <style>
    @font-face {
      font-family: 'Sarabun';
      font-weight: bold;
      font-style: normal;
      src: url('https://ywc15.ywc.in.th/static/fonts/THSarabunChula-Bold.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Sarabun';
      font-weight: normal;
      font-style: normal;
      src: url('https://ywc15.ywc.in.th/static/fonts/THSarabunChula-Regular.ttf') format('truetype');
    }
  </style>
  <style>
    body {
      font-family: 'Sarabun';
      font-size: 12px;
      line-height: 16px;
    }
    h1, b { font-weight: bold; }
    h1 { font-size: 14px; margin-bottom: 2px; }
    .user-img { width: 50px; height: 50px; background-size: cover; background-position: 50%; border: none; }
    .answer { white-space: pre-line; }
    .answer.code { font-family: Monospace; white-space: pre; }
    .row {
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-flex-wrap: wrap;
      flex-wrap: wrap;
    }
    .col {
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      min-width: 0;
    }
    .col.col-2 {
      -webkit-box-flex: 2;
      -webkit-flex: 2;
      flex: 2;
      min-width: 0;
    }
    .col.col-3 {
      -webkit-box-flex: 3;
      -webkit-flex: 3;
      flex: 3;
    }
  </style>
</body>
</html>
`;

const createPDFPromise = user => new Promise((resolve, reject) => (
  pdf.create(generatePdf(user), pdfOption).toFile(`interview/${user.major}/${user._id}.pdf`, (err, info) => {
    if (err) return reject(err);
    return resolve(info);
  }
)));

(async () => {
  const users = await User.find({
    status: 'completed',
    isPassStageOne: true,
    isPassStageTwo: true,
    isPassStageThree: true
  })
  .populate('questions');
  await Promise.all(users.map(user => createPDFPromise(user)));
  console.log('DONE');
})();
