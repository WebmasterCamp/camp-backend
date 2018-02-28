import { Router } from 'express'
import { Queue } from '../models'

import { adminAuthen } from '../middlewares/authenticator'

const router = Router()

router.get('/:major', adminAuthen('queue'), async (req, res) => {
  const { major } = req.params
  try {
    const majorQueue = await Queue.findOne({ major })
    return res.send(majorQueue)
  } catch (e) {
    return res.error(e)
  }
})

router.post('/:major', adminAuthen('queue'), async (req, res) => {
  const { major } = req.params
  const { isDecrease = false } = req.body
  try {
    const majorQueue = await Queue.findOne({ major })
    if (isDecrease) {
      majorQueue.order -= 1
    } else {
      majorQueue.order += 1
    }
    await majorQueue.save()
    req.ioSendQueue()
    return res.send({ success: true })
  } catch (e) {
    return res.error(e)
  }
})

export default router
