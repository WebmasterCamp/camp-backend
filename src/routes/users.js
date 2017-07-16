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
import { respondResult, respondErrors } from '../utilities';
import { getUserInfoFromToken } from '../services';
import { User, Question } from '../models';
import { singleUpload } from '../middlewares';
import _ from 'lodash';

const updateRegisterStep = async (facebook, step) => {
  const user = await User.findOne({ facebook });
  user.completed[step - 1] = true;
  user.markModified('completed');
  if (_.sum(user.completed.map(v => v ? 1 : 0)) === 6) user.status = 'completed';
  return await user.save();
};

const router = Router();
// Require Admin
// router.get('/', (req, res) => {
//   res.send('okkkk');
// });

router.put('/me/step4', isAuthenticated, validateUserStep1, async (req, res) => {
  try {
    // const { facebook } = req.session;
    const facebook = req.facebook;
    const { answer1, answer2, answer3 } = req.body;
    const generalQuestions = [answer1, answer2, answer3].map(answer => ({ answer }));
    const id = (await User.findOne({ facebook }).select('questions')).questions;
    const questions = await Question.findById(id);
    questions.generalQuestions = generalQuestions;
    await questions.save();
    await updateRegisterStep(facebook, 1);
    const result = await User.findOne({ facebook }).populate('questions');
    respondResult(res)(result);
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.put('/me/step5', isAuthenticated, singleUpload('answerFile', 'zip', 'rar', 'x-rar'), validateUserStep2, async (req, res) => {
  try {
    // const { facebook } = req.session;
    const facebook = req.facebook;
    const { major, answer1, answer2, answer3, answer4, answerFileUrl } = req.body;
    const specialQuestions = [answer1, answer2, answer3, answer4 || (req.file || {}).path].map(answer => ({ answer }));
    const id = (await User.findOne({ facebook }).select('questions')).questions;
    const questions = await Question.findById(id);
    questions.specialQuestions = specialQuestions.filter(q => !!q.answer);
    questions.major = major;
    if ((major === 'programming' || major === 'design')) {
      questions.answerFileUrl = answerFileUrl;
      if (req.file) {
        questions.answerFile = (req.file || {}).path;
      }
    }
    await questions.save();
    await updateRegisterStep(facebook, 2);
    const result = await User.findOne({ facebook }).populate('questions');
    respondResult(res)(result);
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.put('/me/step1', isAuthenticated, singleUpload('profilePic', 'jpg', 'png', 'jpeg'), validateUserStep3, hasFile, async (req, res) => {
  try {
    // const { facebook } = req.session;
    const facebook = req.facebook;
    const availbleFields = [
      'title',
      'firstName',
      'lastName',
      'nickName',
      'faculty',
      'department',
      'academicYear',
      'university',
      'sex',
      'birthdate'
    ];
    const user = await User.findOne({ facebook });
    _.map(availbleFields, (field) => {
      user[field] = req.body[field];
    });
    user.picture = (req.file || {}).path;
    await user.save();
    await updateRegisterStep(facebook, 3);
    const result = await User.findOne({ facebook }).populate('questions');
    respondResult(res)(result);
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.put('/me/step2', isAuthenticated, validateUserStep4, async (req, res) => {
  try {
    // const { facebook } = req.session;
    const facebook = req.facebook;
    const availbleFields = [
      'address',
      'province',
      'postCode',
      'phone',
      'email',
      'interview',
      'idInterview'
    ];
    const user = await User.findOne({ facebook });
    _.map(availbleFields, (field) => {
      user[field] = req.body[field];
    });
    await user.save();
    await updateRegisterStep(facebook, 4);
    const result = await User.findOne({ facebook }).populate('questions');
    respondResult(res)(result);
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.put('/me/step3', isAuthenticated, singleUpload('portfolio', 'pdf'), validateUserStep5, async (req, res) => {
  try {
    // const { facebook } = req.session;
    const facebook = req.facebook;
    const availbleFields = [
      'blood',
      'foodAllergy',
      'disease',
      'medicine',
      'knowCamp',
      'knowCampAnother',
      'whyJoinYwc',
      'prominentPoint',
      'event',
      'portfolioUrl'
    ];
    const user = await User.findOne({ facebook });
    _.map(availbleFields, (field) => {
      user[field] = req.body[field];
    });
    if (req.file) {
      user.portfolio = (req.file || {}).path;
    }
    await user.save();
    await updateRegisterStep(facebook, 5);
    const result = await User.findOne({ facebook }).populate('questions');
    respondResult(res)(result);
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.put('/me/step6', isAuthenticated, async (req, res) => {
  try {
    // const { facebook } = req.session;
    const facebook = req.facebook;
    const user = await User.findOne({ facebook });
    user.updated_at = new Date();
    user.save();
    await updateRegisterStep(facebook, 6);
    const result = await User.findOne({ facebook }).populate('questions');
    respondResult(res)(result);
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.put('/me/personal', isAuthenticated, async (req, res) => {
  try {
    // const { facebook } = req.session;
    const facebook = req.facebook;
    const availbleFields = [
      'phone',
      'email',
      'blood',
      'disease',
      'foodAllergy',
      'medicine'
    ];
    const user = await User.findOne({ facebook });
    _.map(availbleFields, (field) => {
      user[field] = req.body[field];
    });
    await user.save();
    const result = await User.findOne({ facebook }).populate('questions');
    respondResult(res)(result);
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    req.checkBody('accessToken', 'Invalid accessToken').notEmpty().isString();
    const errors = req.validationErrors();
    if (errors) respondErrors(errors, 400);
    else {
      const { accessToken } = req.body;
      const { id, email } = await getUserInfoFromToken(accessToken);
      const user = await User.findOne({ facebook: id });
      // req.session.accessToken = accessToken;
      // req.session.facebook = id;
      if (!user) {
        const questions = new Question();
        const q = await questions.save();
        const newUser = new User({
          facebook: id,
          email,
          questions: q._id,
          completed: _.range(6).map(() => false),
          status: 'in progress'
        });
        await newUser.save();
      }
      const NewUser = await User.findOne({ facebook: id });
      respondResult(res)(NewUser);
    }
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.get('/me', isAuthenticated, async (req, res) => {
  respondResult(res)(req.user);
});

router.get('/testme/:token', async (req, res) => {
  try {
    const facebookInfo = await getUserInfoFromToken(req.params.token);
    const facebook = facebookInfo.id;
    const user = await User.findOne({ facebook });
    respondResult(res)(user);
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.get('/logout', (req, res) => {
  // req.session.destroy(() => {
  //   req.session = null;
  //   res.send({ logout: true });
  // });
  res.status(200).send({ logout: true });
});

router.get('/stat', async (req, res) => {
  try {
    const counts = { content: 191, design: 199, marketing: 324, programming: 375 };
    respondResult(res)({ register: counts });
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.get('/', requireRoles('SuperAdmin', 'Supporter'), async (req, res) => {
  try {
    let status = req.query.status;
    const userDocs = await User.find(status === 'all' ? {} : { status }).populate('questions');
    const users = _.map(userDocs, (userDoc) => {
      const user = userDoc.toObject();
      user.major = _.get(user, 'questions.major');
      if (req.session.role !== 'SuperAdmin') delete user.questions;
      return user;
    });
    respondResult(res)(users);
  } catch (err) {
    respondErrors(res)(err);
  }
});
router.get('/step', async (req, res) => {
  try {
    const users = await User.find({});
    const counts = users.reduce((prev, cur) => {
      const count = cur.completed.filter((d) => d === true);
      prev[count.length]++;
      return prev;
    }, [0, 0, 0, 0, 0, 0, 0]);
    respondResult(res)({ register: counts });
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.get('/:id', requireRoles(
  'SuperAdmin',
  'Supporter',
  'JudgeDev',
  'JudgeMarketing',
  'JudgeContent',
  'JudgeDesign'
), async (req, res) => {
  try {
    const userDoc = await User.findById(req.params.id).populate('questions');
    const user = userDoc.toObject();
    respondResult(res)(user);
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.put('/:id', requireRoles(
  'SuperAdmin',
  'Supporter',
  'JudgeDev',
  'JudgeMarketing',
  'JudgeContent',
  'JudgeDesign'
), async (req, res) => {
  try {
    delete req.body.questions;
    const user = await User.findById(req.params.id);
    _.map(Object.keys(req.body), key => {
      user[key] = req.body[key];
      if (key === 'status' && req.body[key] === 'in progress') {
        user.completed[1] = false;
        user.completed[5] = false;
        user.markModified('completed');
      }
      user.markModified(key);
    });
    await user.save();
    const resultDoc = await User.findById(req.params.id);
    const result = resultDoc.toObject();
    delete result.questions;
    respondResult(res)(result);
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.get('/profile/:no', async (req, res) => {
  try {
    const user = await User.findOne({ no: req.params.no }).populate('questions');
    respondResult(res)(user);
  } catch (err) {
    respondErrors(res)(err);
  }
});


export default router;
