import { Router } from 'express';

import { User } from '../models';
import { confirm } from '../controllers/interview';
import { singleUpload, validateConfirm } from '../middlewares';

const router = Router();

router.get('/:refId', async (req, res) => {
  try {
    const user = await User.findOne({ interviewRef: req.params.refId })
      .populate('questions');
    return res.send(user);
  } catch (e) {
    return res.error(e);
  }
});
// router.post('/confirm', singleUpload('slip', 'jpg', 'png', 'jpeg'), validateConfirm, confirm);

export default router;
