import mongoose from 'mongoose'
import {databaseURL} from 'config'

import hello from './hello'
import registration from './registration'

function connect() {
  try {
    mongoose.connect(databaseURL)
  } catch (err) {
    console.warn('Unable to connect to MongoDB:', err.message)
  }

  mongoose.Promise = global.Promise
}

export default function services(app) {
  connect()

  app.configure(registration)
  app.configure(hello)
}
