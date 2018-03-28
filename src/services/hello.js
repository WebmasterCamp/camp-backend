function handler(req, res) {
  res.status(200).send({message: 'JWCx Backend is now active.'})
}

export default async function hello(app) {
  app.use('/', handler)
}
