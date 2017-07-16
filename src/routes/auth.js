import { Router } from 'express';
import { login, me, confirm, slip, update } from '../controllers/auth';
import { singleUpload } from '../middlewares';
import jwt from 'express-jwt';

const router = Router();

router.post('/confirm', singleUpload('slip', 'jpg', 'jpeg', 'png'), confirm);
router.post('/slip', slip);
router.post('/update', update);

router.post('/login', login);
router.get('/me', jwt({ secret: 'ywc14token' }), me);

export default router;
