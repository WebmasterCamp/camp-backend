import mongoose from 'mongoose';
import { User } from '../src/models';
import config from 'config';
import _ from 'lodash';
import 'moment/locale/th';
import { writeFileSync } from 'fs';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || config.MONGODB_URI);

(async () => {
  // const interviewer = await User.find({
  //   status: 'completed',
  //   isPassStageOne: true,
  //   isPassStageTwo: true,
  //   isPassStageThree: true,
  //   major: 'design'
  // });
  // const shuffledList = _.shuffle(interviewer);
  // let idx = 1;
  // for (const list of shuffledList) {
  //   // console.log(list);
  //   const ref = `DS${_.padStart(idx, 2, '0')}`;
  //   idx += 1;
  //   list.interviewRef = ref;
  //   await list.save();
  // }
  const queryPromise = major => User.find({
    isPassStageOne: true,
    isPassStageTwo: true,
    isPassStageThree: true,
    major,
    interviewRef: { $exists: true }
  })
  .select('firstName lastName interviewRef')
  .sort('interviewRef')
  .lean()
  .then(res => res.map(item => _.omit(item, ['_id'])));
  const [programming, design, content, marketing] = await Promise.all([
    queryPromise('programming'),
    queryPromise('design'),
    queryPromise('content'),
    queryPromise('marketing')
  ]);
  writeFileSync('finalist.json', JSON.stringify({ programming, design, content, marketing }));
  console.log('done');
})();
