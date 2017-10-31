import { Router } from 'express';
import moment from 'moment';
import { authen, adminAuthen } from '../middlewares/authenticator';
import { User } from '../models';
// import slackUtils from '../utilities/slack';

const router = Router();

router.get('/', adminAuthen('admin'), async (req, res) => {
  const users = await User.find().select('_id major title firstName lastName firstNameEN lastNameEN email nickname completed_at status major completed');
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

router.get('/by-day-stat', adminAuthen('admin'), async (req, res) => {
  try {
    const { sort = 'desc' } = req.query;
    const statistics = await User.aggregate([
      { $match: { status: 'completed' } },
      { $sort: { completed_at: sort === 'desc' ? -1 : 1 } },
      { $project: { dateString: { $dateToString: { format: '%Y-%m-%d', date: '$completed_at' } } } },
      { $group: { _id: '$dateString', count: { $sum: 1 } } }
    ]);
    return res.send(statistics.sort((a, b) => {
      if (moment(a._id, 'YYYY-MM-DD').isBefore(moment(b._id, 'YYYY-MM-DD'))) return -1;
      else if (moment(a._id, 'YYYY-MM-DD').isSame(moment(b._id, 'YYYY-MM-DD'))) return 0;
      return 1;
    }));
  } catch (e) {
    return res.error(e);
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
