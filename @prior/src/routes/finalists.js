import { Router } from 'express'
import moment from 'moment'
import { singleUpload } from '../middlewares'
import { authen, adminAuthen } from '../middlewares/authenticator'
import { Slip } from '../models'

const router = Router()

router.get('/slip', adminAuthen(['admin', 'slips']), async (req, res) => {
  try {
    const slips = await Slip.find()
    return res.send(slips)
  } catch (e) {
    return res.error(e)
  }
})

router.post(
  '/slip',
  singleUpload('slip', 'jpg', 'png', 'jpeg'),
  async (req, res) => {
    if (!req.file) {
      return res.error('No Slip. Try Again')
    }
    try {
      const slip = new Slip(req.body)
      slip.file_path = req.file.path
      await slip.save()
      return res.send({ success: true })
    } catch (e) {
      return res.error(e)
    }
  },
)

router.post(
  '/slip/:id/approve',
  adminAuthen(['admin', 'slips']),
  async (req, res) => {
    try {
      const slip = await Slip.findOne({ _id: req.params.id })
      if (!slip) return res.error('Slip not found')
      if (req.body.isApprove) {
        slip.status = 'approve'
      } else {
        slip.status = 'not approve'
      }
      await slip.save()
      return res.send({ success: true })
    } catch (e) {
      return res.error(e)
    }
  },
)

export default router
