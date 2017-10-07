import mongoose from 'mongoose';
import User from '../src/models/user';
import Question from '../src/models/question';
import config from 'config';
import fs from 'fs';
import moment from 'moment';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || config.MONGODB_URI);

User
  .find({ status: 'completed', major: 'marketing' })
  .populate('questions')
  .then((users) => (
    users
      .map(user => ({
        answers: user.questions.specialQuestions.marketing.map(answer => answer.answer),
        id: user._id,
        academicYear: user.academicYear,
        faculty: user.faculty,
        department: user.department,
        university: user.university,
        age: Math.abs(moment(user.birthdate).diff(moment(), 'years'))
      }))
    )
  )
  .then((users) => users.map(user => ({
    1: user.answers[0],
    2: user.answers[1],
    3: user.answers[2],
    id: user.id,
    academicYear: user.academicYear,
    faculty: user.faculty,
    department: user.department,
    university: user.university,
    age: user.age
  })))
  .then(users => {
    const body = users.map(user => `
ID:${user.id}
ชั้นปี: ${user.academicYear} / อายุ ${user.age} ปี
คณะ: ${user.faculty} สาขาวิชา: ${user.department} มหาวิทยาลัย: ${user.university}
ข้อที่ 1\n${user[1]}
ข้อที่ 2\n${user[2]}
ข้อที่ 3\n${user[3]}
`).join('------------------------------\n');
    return new Promise((resolve, reject) => {
      fs.writeFile('marketing.txt', body, { encoding: 'utf-8' }, (e) => {
        if (e) reject(e);
        resolve();
      });
    });
  })
  .then(() => console.log('DONE'));
