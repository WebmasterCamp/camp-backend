import { Router } from 'express'
import {
  result,
  getVote,
  postVoteBoy,
  postVoteGirl,
  postVoteSpecial,
} from '../controllers/member'

const router = Router()

router.get('/result', result)
router.get('/:type', getVote)

router.post('/vote/boy', postVoteBoy)
router.post('/vote/girl', postVoteGirl)
router.post('/vote/special', postVoteSpecial)

export default router
