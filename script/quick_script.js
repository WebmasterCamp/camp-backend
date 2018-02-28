import mongoose from 'mongoose'
import fs from 'fs'
import { User, Question } from '../src/models'
import config from 'config'
import _ from 'lodash'
import 'moment/locale/th'

mongoose.Promise = global.Promise
mongoose.connect(
  process.env.MONGODB_URI || process.env.MONGOLAB_URI || config.MONGODB_URI,
)

;(async () => {
  const users = await User.find({
    status: 'completed',
    isPassStageOne: true,
    isPassStageTwo: true,
    isPassStageThree: false,
    major: 'content',
  })
    .populate('questions')
    .sort('completed_at')
  const x = users
    .map(user =>
      Object.assign(user, {
        pPong: user.questions.stageThree.filter(
          item =>
            item.grader_id.toString() === '59e06bc47d0f5a6f21a6c301' &&
            item.isPass,
        ),
      }),
    )
    .map(user => user._id)
  console.log(x)
  fs.writeFileSync('dummy.txt', x.join('\n'))
  // for (const user of users) {
  // const question = await Question.findOne({ _id: user.questions });
  // const { stageThree } = question;
  // stageThree.filter(item => item.grader_id.toString() === '59e06c537d0f5a6f21a6c303').filter(item => item.)
  // }
  // console.log('DONE');
  // console.log(users.map(user => user.questions.stageThree));
})()
