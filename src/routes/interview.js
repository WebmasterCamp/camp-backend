import { Router } from 'express';
import fb from 'fb';
import config from 'config';

import { User } from '../models';
import { confirm } from '../controllers/interview';
import { singleUpload, validateConfirm } from '../middlewares';
import { adminAuthen } from '../middlewares/authenticator';

import programmingQuestion from './announcement.json';

const router = Router();

// router.get('/', async (req, res) => {
//   try {
//     const queryPromise = major => User.find({
//       isPassStageOne: true,
//       isPassStageTwo: true,
//       isPassStageThree: true,
//       major,
//       interviewRef: { $exists: true }
//     })
//     .select('firstName lastName interviewRef')
//     .sort('interviewRef');
//     const [programming, design, content, marketing] = await Promise.all([
//       queryPromise('programming'),
//       queryPromise('design'),
//       queryPromise('content'),
//       queryPromise('marketing')
//     ]);
//     return res.send({
//       programming,
//       design,
//       content,
//       marketing
//     });
//   } catch (e) {
//     return res.error(e);
//   }
// });

router.get('/', (req, res) => {
  return res.send(programmingQuestion);
});

router.get('/:refId', adminAuthen(['admin', 'programming', 'design', 'marketing', 'content']), async (req, res) => {
  try {
    const user = await User.findOne({ interviewRef: req.params.refId })
      .populate('questions');
    if (!user) return res.error('Not found');
    return res.send(user);
  } catch (e) {
    return res.error(e);
  }
});
// router.post('/confirm', singleUpload('slip', 'jpg', 'png', 'jpeg'), validateConfirm, confirm);

export default router;
