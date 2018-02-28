import { Router } from 'express'
import { requireRoles } from '../middlewares'
import { respondResult, respondSuccess, respondErrors } from '../utilities'
import { Slip } from '../models'

const router = Router()

router.get('/', requireRoles('SuperAdmin', 'Supporter'), async (req, res) => {
  try {
    const slip = await Slip.find()
    respondResult(res)(slip)
  } catch (err) {
    respondErrors(res)(err)
  }
})

router.get(
  '/:status',
  requireRoles('SuperAdmin', 'Supporter'),
  async (req, res) => {
    try {
      const slip = await Slip.find({ status: req.params.status })
      respondResult(res)(slip)
    } catch (err) {
      respondErrors(res)(err)
    }
  },
)

router.post(
  '/update',
  requireRoles('SuperAdmin', 'Supporter'),
  async (req, res) => {
    try {
      const { slips } = req.body
      slips.map(async slip => {
        const newSlip = await Slip.findOne({ name: slip.name })
        newSlip.status = slip.status
        return await newSlip.save()
      })
      respondSuccess(res)()
    } catch (err) {
      respondErrors(res)(err)
    }
  },
)

export default router
