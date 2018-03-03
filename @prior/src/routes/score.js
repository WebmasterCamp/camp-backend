import { Router } from 'express'
import { Score } from '../models'

import { adminAuthen } from '../middlewares/authenticator'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const lists = await Score.find({})
    return res.send(lists)
  } catch (e) {
    return res.error(e)
  }
})

router.post('/:group', adminAuthen('score'), async (req, res) => {
  const { group } = req.params
  const { score } = req.body
  try {
    const groupScore = await Score.findOne({ group })
    groupScore.score += score
    await groupScore.save()
    req.ioSendScore()
    return res.send({ success: true })
  } catch (e) {
    return res.error(e)
  }
})

export default router
