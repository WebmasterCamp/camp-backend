import { Router } from 'express';
import jwt from 'express-jwt';
import config from 'config';
import { login, me, confirm, slip, update } from '../controllers/auth';
import { singleUpload, isAuthenticated } from '../middlewares';

const router = Router();

router.post('/confirm', singleUpload('slip', 'jpg', 'jpeg', 'png'), confirm);
router.post('/slip', slip);
router.post('/update', update);

router.post('/login', login);
router.get('/me', isAuthenticated, me);

export default router;
