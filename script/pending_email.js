import fs from 'fs'
import mongoose from 'mongoose'
import config from 'config'
import { User } from '../src/models'

mongoose.Promise = global.Promise
mongoose.connect(
  process.env.MONGODB_URI || process.env.MONGOLAB_URI || config.MONGODB_URI,
)

const mapUsers = users =>
  users
    .filter(user => user.email)
    .map(
      user =>
        `${user._id},${user.firstName} ${user.lastName}, ${user.email}, ${
          user.phone
        }`,
    )
    .join('\n')

const mapString = data => {
  const header = 'REF ID,ชื่อ-นามสกุล,อีเมล,เบอร์โทรศัพท์'
  return `${header}\n${data}`
}

const writeFile = (data, filename) =>
  new Promise((resolve, reject) => {
    fs.writeFile(`${filename}.csv`, data, { encoding: 'utf-8' }, err => {
      if (err) return reject(err)
      return resolve()
    })
  })

const createQuery = query =>
  User.find(query).select('firstName lastName email phone')

Promise.all([
  createQuery({
    status: 'in progress',
    completed: [false, false, false, false, false],
  }),
  createQuery({
    status: 'in progress',
    completed: [true, false, false, false, false],
  }),
  createQuery({
    status: 'in progress',
    completed: [true, true, false, false, false],
  }),
  createQuery({
    status: 'in progress',
    completed: [true, true, true, false, false],
  }),
  createQuery({
    status: 'in progress',
    completed: [true, true, true, true, false],
  }),
  createQuery({
    status: 'in progress',
    completed: [true, true, true, true, true],
  }),
  createQuery({
    status: 'completed',
    major: 'design',
    designPortfolio: { $exists: false },
  }),
])
  .then(results => results.map(result => mapUsers(result)))
  .then(results => results.map(result => mapString(result)))
  .then(([nothing, first, second, third, doneGeneral, doneAll, design]) =>
    Promise.all([
      writeFile(nothing, 'nothing'),
      writeFile(first, 'first'),
      writeFile(second, 'second'),
      writeFile(third, 'third'),
      writeFile(doneGeneral, 'general'),
      writeFile(doneAll, 'all'),
      writeFile(design, 'design'),
    ]),
  )
  .then(() => console.log('done'))
