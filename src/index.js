import express from 'express'

const app = express()

console.log('Hello')

app.get('/', (req, res) => {
  res.send({data: 'Hello'})
})

app.listen(3000)
