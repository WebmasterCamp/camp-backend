import mongoose from 'mongoose';
import { User } from '../src/models';
import config from 'config';
import _ from 'lodash';
import 'moment/locale/th';
import { readFileSync } from 'fs';
import path from 'path';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || config.MONGODB_URI);

const finalists = readFileSync(path.join(__dirname, './backup.txt')).toString().split('\n');
// console.log(finalists);

finalists.map(user => (
  User.findOne({ interviewRef: user })
    .then()
));

Promise.all(
  finalists.map(user => User.findOneAndUpdate({ interviewRef: user }, { isFinalistBackup: true }))
)
.then(() => console.log('done'));
