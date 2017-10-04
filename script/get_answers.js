import mongoose from 'mongoose';
import User from '../src/models/user';
import Question from '../src/models/question';
import config from 'config';
import fs from 'fs';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || config.MONGODB_URI);

User
  .find({ status: 'completed', major: 'marketing' })
  .populate('questions')
  .then((users) => (
    users
      .map(user => ({
        answers: user.questions.specialQuestions.marketing.map(answer => answer.answer),
        id: user._id
      }))
    )
  )
  .then((users) => users.map(user => ({
    1: user.answers[0],
    2: user.answers[1],
    3: user.answers[2],
    id: user.id
  })))
  .then(users => {
    const body = users.map(user => `
ID:${user.id}
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
