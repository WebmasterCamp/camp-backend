import mongoose from 'mongoose';
import { User } from '../src/models';
import config from 'config';
import _ from 'lodash';
import 'moment/locale/th';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || config.MONGODB_URI);

const finalists = readFileSync(path.join(__dirname, './eng_name.csv')).toString().split('\n');
// console.log(finalists);

let out = '';

Promise.all(
  finalists.map(f => (
    User.findById(f)
      .then(user => out += `${user.firstNameEN} ${user.lastNameEN},${user.major}\n`)
  ))
)
.then(() => writeFileSync(path.join(__dirname, './eng_name_final.csv'), out));
