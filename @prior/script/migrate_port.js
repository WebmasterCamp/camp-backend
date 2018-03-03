import fs from 'fs'
import mongoose from 'mongoose'
import _ from 'lodash'
import config from 'config'
import { User, Question } from '../src/models'

mongoose.Promise = global.Promise
mongoose.connect(
  process.env.MONGODB_URI || process.env.MONGOLAB_URI || config.MONGODB_URI,
)

const files = fs.readdirSync(
  '/Users/benz/Downloads/drive-download-20171111T033351Z-001',
)

Promise.all(
  files
    .filter(file => file !== '.DS_Store')
    .map(file => ({
      firstNameEN: { $regex: file.split('-')[0], $options: 'i' },
      lastNameEN: {
        $regex: file.split('-')[1].split('.pdf')[0],
        $options: 'i',
      },
      major: 'design',
      filename: file,
    }))
    .map(query =>
      User.findOne(_.omit(query, 'filename')).then(user => {
        // user.designPortfolio = `uploads/file/eCT30By1-1504793289563.pdf`;
        // console.log(user.firstNameEN, query.firstNameEN.$regex);
        return Question.findOne({ _id: user.questions }).then(question => {
          // console.log(user.firstNameEN, question.stageThree, query.filename);
          user.designPortfolio = `uploads/file/${query.filename}`
          question.stageThree = []
          return Promise.all([user.save(), question.save()])
        })
      }),
    ),
).then(() => console.log('done'))
