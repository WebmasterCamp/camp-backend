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

const backup = {
  programming: ['PG21', 'PG28', 'PG23', 'PG40', 'PG32', 'PG16', 'PG48', 'PG45'],
  // design: ['DS26', 'DS33', 'DS38', 'DS22', 'DS10'],
  design: [],
  marketing: ['MK31', 'MK45', 'MK28', 'MK36', 'MK19', 'MK50', 'MK44'],
  content: ['CT49', 'CT10', 'CT33', 'CT24', 'CT45', 'CT42']
};

const queryPromise = major =>
  User.find({ isFinalist: true, major })
  // Promise.all(backup[major].map(interviewRef => User.findOne({ interviewRef, major }).select('interviewRef firstName lastName').lean()))
    // .then(users => users.reduce((prev, curr) => [...prev, curr], []))
    .select('interviewRef firstName lastName')
    .sort('firstName')
    .lean()
    .then((users) => writeFileSync(`finalist/${major}.json`, JSON.stringify(users)))
    // .then((users) => Papa.unparse({
    //   fields: ['interviewRef', 'firstName', 'lastName', 'nickname', 'phone', 'email', 'shirtSize'],
    //   data: users
    // }))
  // .then(data => writeFileSync(`finalist/backup/${major}.csv`, data, { encoding: 'utf-8' }));

Promise.all([
  queryPromise('programming'),
  queryPromise('design'),
  queryPromise('marketing'),
  queryPromise('content')
]).then(() => console.log('done'));
