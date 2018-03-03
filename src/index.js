import express from 'express'
import {HOST, PORT} from 'config'

import logger from './core/logger'

const app = express()

app.get('/', (req, res) => {
  res.send({data: 'Hello, World!'})
})

logger.info(`Starting server at port: ${PORT}`)

app.listen(PORT, HOST)
