import { Router } from 'express';
import fb from 'fb';
import config from 'config';

import { User } from '../models';
import { confirm } from '../controllers/interview';
import { singleUpload, validateConfirm } from '../middlewares';

const router = Router();

router.get('/:refId', async (req, res) => {
  try {
    const user = await User.findOne({ interviewRef: req.params.refId })
      .populate('questions');
    if (!user) return res.error('Not found');
    // const { access_token } = await new Promise((resolve, reject) => {
    //   fb.napi('oauth/access_token', {
    //     client_id: config.FACEBOOK_ID,
    //     client_secret: config.FACEBOOK_SECRET.toString(),
    //     grant_type: 'client_credentials',
    //     permissions: 'email'
    //   }, (err, data) => err ? reject(err) : resolve(data));
    // });
    // const fbUser = await new Promise((resolve, reject) => {
    //   fb.napi(`/${user.facebook}`, {
    //     access_token
    //   }, (err, data) => err ? reject(err) : resolve(data));
    // });
    // return res.send(Object.assign(user, {
    //   fbLink: fbUser.link
    // }));
    return res.send(user);
  } catch (e) {
    return res.error(e);
  }
});
// router.post('/confirm', singleUpload('slip', 'jpg', 'png', 'jpeg'), validateConfirm, confirm);

export default router;
