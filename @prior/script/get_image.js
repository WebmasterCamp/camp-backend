import mongoose from 'mongoose'
import { User } from '../src/models'
import config from 'config'
import _ from 'lodash'
import 'moment/locale/th'
import fs from 'fs'
import path from 'path'

mongoose.Promise = global.Promise
mongoose.connect(
  process.env.MONGODB_URI || process.env.MONGOLAB_URI || config.MONGODB_URI,
)

;(async () => {
  const list = fs
    .readFileSync(path.join(__dirname, './image.txt'))
    .toString()
    .split('\n')
    .map(s => s.trim())
  console.log(list)
  for (const id of list) {
    const user = await User.findOne({ _id: id })
    console.log(`https://api.ywc15.ywc.in.th/${user.picture}`)
  }
})()
