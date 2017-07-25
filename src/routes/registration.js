import { Router } from 'express';
import { authen } from '../middlewares/authenticator';
import { validateRegistrationStep, hasFile } from '../middlewares/validator';
import { User, Question } from '../models';
import { singleUpload } from '../middlewares';

const updateRegisterStep = async (id, step) => {
  const user = await User.findOne({ _id: id });
  user.completed[step - 1] = true;
  user.markModified('completed');
  return await user.save();
};

const router = Router();

// STEP 1: Personal Info
router.put('/step1', authen('in progress'), singleUpload('profilePic', 'jpg', 'png', 'jpeg'), validateRegistrationStep[0], hasFile, async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id });
    const fields = [
      'title',
      'firstName',
      'lastName',
      'nickname',
      'faculty',
      'department',
      'academicYear',
      'university',
      'sex',
      'birthdate'
    ];
    fields.forEach(field => {
      user[field] = req.body[field];
    });
    user.picture = (req.file || {}).path;
    await Promise.all([user.save(), updateRegisterStep(_id, 1)]);
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

// STEP 2: Contact Info and ETC
router.put('/step2', authen('in progress'), validateRegistrationStep[1], async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id });
    const fields = [
      'address',
      'province',
      'postalCode',
      'phone',
      'email',
      'blood',
      'foodAllergy',
      'medAllergy',
      'disease'
    ];
    fields.forEach(field => {
      user[field] = req.body[field];
    });
    await Promise.all([user.save(), updateRegisterStep(_id, 2)]);
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

// STEP 3: Portfolio and How did you know YWC?
router.put('/step3', authen('in progress'), validateRegistrationStep[2], async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id });
    const fields = [
      'knowCamp',
      'whyJoinYWC',
      'expectation'
    ];
    fields.forEach(field => {
      user[field] = req.body[field];
    });
    await Promise.all([user.save(), updateRegisterStep(_id, 3)]);
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

// STEP 4: General Question
router.put('/step4', authen('in progress'), validateRegistrationStep[3], async (req, res) => {
  try {
    // TO CHECK: If role as affect on general question -> check role
    const { answers } = req.body;
    const { _id } = req.user;
    const user = await User.findOne({ _id }).select('questions');
    const questions = await Question.findOne({ _id: user.questions });
    questions.generalQuestions = answers.map(answer => ({ answer }));
    await Promise.all([questions.save(), updateRegisterStep(_id, 4)]);
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

router.put('/step5', authen('in progress'), validateRegistrationStep[4], async (req, res) => {
  try {
    // TODO: FILE UPLOAD FOR SURE
    const { answers, major } = req.body;
    const { _id } = req.user;
    const user = await User.findOne({ _id }).select('questions');
    const question = await Question.findOne({ _id: user.questions });
    question.specialQuestions[major] = answers.map(answer => ({ answer }));
    if (question.completedMajor.indexOf(major) === -1) {
      question.completedMajor.push(major);
    }
    await Promise.all([question.save(), updateRegisterStep(_id, 5)]);
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

router.post('/confirm', authen('in progress'), async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id }).populate('questions');
    if (user.completed.filter(isDone => !isDone).length !== 0) {
      return res.error('Non completed registration form.');
    }
    const { major } = req.body;
    if (user.questions.completedMajor.indexOf(major) === -1) {
      return res.error('You did not completed major questions yet.');
    }
    const majorSpecialQuestions = user.questions.specialQuestions[major];
    const question = await Question.findOne({ _id: user.questions._id });
    question.specialQuestions = {
      [major]: majorSpecialQuestions
    };
    question.confirmedMajor = major;
    user.status = 'completed';
    user.major = req.body.major;
    await Promise.all([user.save(), question.save()]);
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

export default router;
