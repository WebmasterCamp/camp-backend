import HelloService from './hello'

function rootHandler(req, res) {
  return res.status(200).send({status: 'OK'})
}

export default async function services(app) {
  app.use('/', rootHandler)
  app.use('/hello', new HelloService())
}
