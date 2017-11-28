import mongoose from 'mongoose';
import { User } from '../src/models';
import config from 'config';
import _ from 'lodash';
import 'moment/locale/th';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import Papa from 'papaparse';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || config.MONGODB_URI);

const queryPromise = major => User.find({ isFinalist: true, major })
  .select('interviewRef firstName lastName nickname phone email shirtSize')
  .sort('firstName')
  .lean()
  .then((users) => Papa.unparse({
    fields: ['interviewRef', 'firstName', 'lastName', 'nickname', 'phone', 'email', 'shirtSize'],
    data: users
  }))
  .then(data => writeFileSync(`finalist/${major}.csv`, data, { encoding: 'utf-8' }));

Promise.all([
  queryPromise('programming'),
  queryPromise('design'),
  queryPromise('marketing')
]).then(() => console.log('done'));
