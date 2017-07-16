import { Router } from 'express';
import { confirm } from '../controllers/interview';
import { singleUpload, validateConfirm } from '../middlewares';

const router = Router();


router.post('/confirm', singleUpload('slip', 'jpg', 'png', 'jpeg'), validateConfirm, confirm);

export default router;
