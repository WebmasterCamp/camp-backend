import { Router } from 'express'
import jwt from 'express-jwt'
import config from 'config'
import {
  login,
  adminLogin,
  me,
  confirm,
  slip,
  update,
} from '../controllers/auth'
import { singleUpload, isAuthenticated } from '../middlewares'
import { closeAfterDeadline } from '../middlewares/deadline'

const router = Router()

// router.post('/confirm', singleUpload('slip', 'jpg', 'jpeg', 'png'), confirm);
// router.post('/slip', slip);
// router.post('/update', update);

router.post('/login', closeAfterDeadline, login)
router.post('/login/admin', adminLogin)
// router.get('/me', isAuthenticated, me);

export default router
