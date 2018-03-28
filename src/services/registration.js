import mongoose from 'mongoose'

import Camper from '../models/camper'

class RegistrationService {
  async create(data, params) {
    console.log('Data', data)
    console.log('Params', params)

    return {status: 'ACTIVE', data, params}
  }
}

export default async function register(app) {
  app.use('/register', new RegistrationService())
}
