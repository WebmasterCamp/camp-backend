import { Router } from 'express';
import {
  validateUserStep1,
  validateUserStep2,
  validateUserStep3,
  validateUserStep4,
  validateUserStep5,
  isAuthenticated,
  hasFile,
  requireRoles
} from '../middlewares';
import { authen, adminAuthen } from '../middlewares/authenticator';
import { respondResult, respondErrors } from '../utilities';
import { getUserInfoFromToken } from '../services';
import { User, Question } from '../models';
import { singleUpload } from '../middlewares';
import _ from 'lodash';
import slackUtils from '../utilities/slack';

const router = Router();

router.get('/', adminAuthen('admin'), async (req, res) => {
  const users = await User.find().select('_id major title firstName lastName firstNameEN lastNameEN email nickname completed_at status');
  return res.send(users);
});

router.get('/me', authen(), async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).populate('questions');
  if (!user) {
    return res.error('User Not Found');
  }
  return res.send(user);
});

router.get('/stat', async (req, res) => {
  try {
    const programmingCompleted = User.count({ status: 'completed', major: 'programming' });
    const designCompleted = User.count({ status: 'completed', major: 'design' });
    const contentCompleted = User.count({ status: 'completed', major: 'content' });
    const marketingCompleted = User.count({ status: 'completed', major: 'marketing' });
    const [programming, design, content, marketing] = await Promise.all([programmingCompleted, designCompleted, contentCompleted, marketingCompleted]);
    return res.send({
      programming,
      design,
      content,
      marketing
    });
  } catch (err) {
    return res.error(err);
  }
});


router.get('/programming', adminAuthen(['admin', 'programming']), async (req, res) => {
  try {
    const users = await User.find({ status: 'completed', major: 'programming' });
    return res.send(users);
  } catch (err) {
    return res.error(err);
  }
});

router.get('/design', adminAuthen(['admin', 'design']), async (req, res) => {
  try {
    const users = await User.find({ status: 'completed', major: 'design' });
    return res.send(users);
  } catch (err) {
    return res.error(err);
  }
});

router.get('/marketing', adminAuthen(['admin', 'marketing']), async (req, res) => {
  try {
    const users = await User.find({ status: 'completed', major: 'marketing' });
    return res.send(users);
  } catch (err) {
    return res.error(err);
  }
});

router.get('/content', adminAuthen(['admin', 'content']), async (req, res) => {
  try {
    const users = await User.find({ status: 'completed', major: 'content' });
    return res.send(users);
  } catch (err) {
    return res.error(err);
  }
});

router.get('/interview', async (req, res) => {
  try {
    const interviewCandidate = await User.find({
      status: 'completed',
      isPassStageOne: true,
      isPassStageTwo: true,
      isPassStageThree: true
    })
    .select('_id major title firstName lastName firstNameEN lastNameEN email nickname completed_at')
    .sort('firstName');
    return res.send({
      programming: interviewCandidate.filter(user => user.major === 'programming'),
      design: interviewCandidate.filter(user => user.major === 'design'),
      marketing: interviewCandidate.filter(user => user.major === 'marketing'),
      content: interviewCandidate.filter(user => user.major === 'content')
    });
  } catch (err) {
    return res.error(err);
  }
});

router.get('/:id', adminAuthen('admin'), async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).populate('questions');
  return res.send(user);
});

router.get('/stat/all', adminAuthen('admin'), async (req, res) => {
  try {
    const programmingCompleted = User.count({ status: 'completed', major: 'programming' });
    const designCompleted = User.count({ status: 'completed', major: 'design' });
    const contentCompleted = User.count({ status: 'completed', major: 'content' });
    const marketingCompleted = User.count({ status: 'completed', major: 'marketing' });
    const pendingPromise = User.count({ status: { $ne: 'completed' }, completed: { $ne: [true, true, true, true, true] } });
    const notConfirmPromise = User.count({ status: { $ne: 'completed' }, completed: [true, true, true, true, true] });
    const [programming, design, content, marketing, pending, notConfirm] = await Promise.all([programmingCompleted, designCompleted, contentCompleted, marketingCompleted, pendingPromise, notConfirmPromise]);
    return res.send({
      programming,
      design,
      content,
      marketing,
      pending,
      notConfirm
    });
  } catch (err) {
    return res.error(err);
  }
});

export default router;
