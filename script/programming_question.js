import mongoose from 'mongoose';
import fs from 'fs';
import { User } from '../src/models';
import config from 'config';
import _ from 'lodash';
import 'moment/locale/th';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || config.MONGODB_URI);

(async () => {
  let interviewer = await User.find({
    status: 'completed',
    isPassStageOne: true,
    isPassStageTwo: true,
    isPassStageThree: true,
    interviewRef: { $exists: true }
  })
  .select('firstName lastName interviewRef major')
  .lean();
  interviewer = interviewer.map(item => _.omit(item, ['_id']));
  fs.writeFileSync('announcement.json', JSON.stringify(interviewer));
})();
