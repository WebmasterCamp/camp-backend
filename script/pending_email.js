import fs from 'fs';
import mongoose from 'mongoose';
import config from 'config';
import { User } from '../src/models';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || config.MONGODB_URI);

User
  .find({ status: 'in progress' })
  .select('firstName lastName email phone')
  .then((users) => {
    const data = users
      .filter(user => user.email)
      .map(user => `${user.firstName} ${user.lastName}, ${user.email}, ${user.phone}`).join('\n');
    console.log(data);
    return data;
  })
  .then((data) => {
    const header = 'ชื่อ-นามสกุล,อีเมล,เบอร์โทรศัพท์';
    return `${header}\n${data}`;
  })
  .then(result => new Promise((resolve, reject) => {
    fs.writeFile('pending.csv', result, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  }))
  .then(() => console.log('done'))
  .catch(e => console.log(e));
