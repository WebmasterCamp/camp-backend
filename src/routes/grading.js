import { Router } from 'express';
import _ from 'lodash';
import { Admin, User, Question } from '../models';
import { adminAuthen } from '../middlewares/authenticator';

const router = Router();

const majorToPass = {
  programming: 3,
  marketing: 1,
  content: 2,
  design: 1
};

const maximumMajor = {
  programming: 4,
  marketing: 2,
  content: 3,
  design: 2
};

router.get('/stage-one', adminAuthen(['admin', 'stage-1']), async (req, res) => {
  const { _id: graderId } = req.admin;
  const completedUsers = await User.find({ status: 'completed' })
    .sort('-completed_at')
    .populate('questions')
    .select('_id questions')
    .lean();
  return res.send(completedUsers.map(user => Object.assign(user, {
    questions: {
      generalQuestions: user.questions.generalQuestions,
      stageOne: user.questions.stageOne ?
        user.questions.stageOne.find(item => item.grader_id.toString() === graderId.toString()) : {}
    }
  })));
});

router.get('/stage-one/stat', adminAuthen(['admin']), async (req, res) => {
  const completedUsersPromise = User.find({ status: 'completed' })
    .populate('questions')
    .select('_id questions')
    .lean();
  const gradersPromise = Admin.find({ role: 'stage-1' });
  const [completedUsers, graders] = await Promise.all([completedUsersPromise, gradersPromise]);
  const graderIdMapping = graders.reduce((prev, curr) => {
    prev[curr._id] = curr.username;
    return prev;
  }, {});
  const groupedByGraderId = graders.reduce((prev, curr) => {
    prev[curr._id] = [];
    return prev;
  }, {});
  completedUsers.forEach(user => {
    user.questions.stageOne.forEach(gradedItem => {
      groupedByGraderId[gradedItem.grader_id] = [...groupedByGraderId[gradedItem.grader_id], gradedItem];
    });
  });
  const gradersStat = Object.keys(groupedByGraderId).reduce((prev, graderId) => {
    prev[graderIdMapping[graderId]] = groupedByGraderId[graderId].length;
    return prev;
  }, {});
  return res.send({
    all: completedUsers.length,
    graded: gradersStat
  });
});

router.get('/stage-one/:id', adminAuthen(['admin', 'stage-1']), async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      status: 'completed'
    });
    if (!user) return res.error({ message: 'User not found' });
    const answers = await Question.findById(user.questions);
    return res.send({
      answers: answers.generalQuestions,
      note: answers.stageOne.find(item => item.grader_id.toString() === req.admin._id.toString()),
      activities: user.activities,
      academicYear: user.academicYear,
      faculty: user.faculty,
      department: user.department,
      university: user.university
    });
  } catch (e) {
    return res.error(e);
  }
});

router.put('/stage-one/:id', adminAuthen('stage-1'), async (req, res) => {
  const { pass, note = '' } = req.body;
  const { _id: graderId } = req.admin;
  try {
    const user = await User.findOne({
      _id: req.params.id,
      status: 'completed'
    });
    if (!user) return res.error({ message: 'User not found' });
    const answers = await Question.findById(user.questions);
    const { stageOne } = answers;
    const gradedItemIdx = _.findIndex(stageOne, item => item.grader_id.toString() === graderId.toString());
    if (gradedItemIdx !== -1) {
      answers.stageOne[gradedItemIdx] = {
        grader_id: graderId,
        note,
        isPass: pass
      };
    } else {
      answers.stageOne.push({
        grader_id: graderId,
        note,
        isPass: pass
      });
    }
    if (answers.stageOne.filter(item => item.isPass).length >= 2) {
      user.isPassStageOne = true;
    } else {
      user.isPassStageOne = false;
    }
    await [user.save(), answers.save()];
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

router.post('/stage-one/calculate', adminAuthen('admin'), async (req, res) => {
  try {
    const completedUsers = await User.find({ status: 'completed' })
      .populate('questions')
      .lean();
    await Promise.all(completedUsers.map((user) => {
      const { stageOne } = user.questions;
      // console.log(stageOne);
      if (stageOne && stageOne.filter(gradedItem => gradedItem.isPass).length >= 2) {
        return User.findOneAndUpdate({ _id: user._id }, { isPassStageOne: true });
      }
      return User.findOneAndUpdate({ _id: user._id }, { isPassStageOne: false });
    }));
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

router.get('/stage-two', adminAuthen(['admin', 'stage-2']), async (req, res) => {
  try {
    const completedUsers = await User.find({ status: 'completed', isPassStageOne: true })
    .populate('questions')
    .sort('-completed_at')
    .lean();
    return res.send(completedUsers.map(user => ({
      ...user,
      questions: {
        generalQuestions: user.questions.generalQuestions
      }
    })));
  } catch (e) {
    return res.error(e);
  }
});

router.put('/stage-two/:id', adminAuthen('stage-2'), async (req, res) => {
  const { pass, note = '' } = req.body;
  try {
    const user = await User.findOne({
      _id: req.params.id,
      status: 'completed',
      isPassStageOne: true
    });
    if (!user) return res.error({ message: 'User not found' });
    user.isJudgeStageTwo = true;
    user.isPassStageTwo = pass;
    user.noteStageTwo = note;
    await user.save();
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

router.get('/stage-two/stat', adminAuthen(['admin']), async (req, res) => {
  const stageOnePassedUsers = await User.find({ status: 'completed', isPassStageOne: true })
    .lean();
  return res.send({
    all: stageOnePassedUsers.length,
    graded: stageOnePassedUsers.filter(user => user.isJudgeStageTwo).length
  });
});

router.get('/major/:major', adminAuthen(['admin', 'programming', 'design', 'content', 'marketing']), async (req, res) => {
  const { _id: graderId } = req.admin;
  const { major } = req.params;
  const completedUsers = await User.find({
    status: 'completed',
    isPassStageOne: true,
    isPassStageTwo: true,
    major
  })
    .sort('-completed_at')
    .populate('questions')
    .select('_id questions')
    .lean();
  return res.send(completedUsers.map(user => Object.assign(user, {
    questions: {
      specialQuestions: user.questions.specialQuestions[major],
      stageThree: user.questions.stageThree ?
        user.questions.stageThree.find(item => item.grader_id.toString() === graderId.toString()) : {}
    }
  })));
});

router.get('/major/:major/stat', adminAuthen(['admin']), async (req, res) => {
  const completedUsersPromise = User.find({
    status: 'completed',
    isPassStageOne: true,
    isPassStageTwo: true,
    major: req.params.major
  })
  .populate('questions')
  .select('_id questions')
  .lean();
  const gradersPromise = Admin.find({ role: req.params.major });
  const [completedUsers, graders] = await Promise.all([completedUsersPromise, gradersPromise]);
  const graderIdMapping = graders.reduce((prev, curr) => {
    prev[curr._id] = curr.username;
    return prev;
  }, {});
  const groupedByGraderId = graders.reduce((prev, curr) => {
    prev[curr._id] = [];
    return prev;
  }, {});
  completedUsers.forEach(user => {
    user.questions.stageThree.forEach(gradedItem => {
      groupedByGraderId[gradedItem.grader_id] = [...groupedByGraderId[gradedItem.grader_id], gradedItem];
    });
  });
  const gradersStat = Object.keys(groupedByGraderId).reduce((prev, graderId) => {
    prev[graderIdMapping[graderId]] = groupedByGraderId[graderId].length;
    return prev;
  }, {});
  return res.send({
    all: completedUsers.length,
    graded: gradersStat
  });
});

router.get('/major/:major/pass-stat', adminAuthen(['admin', 'programming', 'design', 'content', 'marketing']), async (req, res) => {
  try {
    const { major } = req.params;
    if (major !== req.admin.role) {
      return res.error({ message: 'Role Mismatch' });
    }
    const interviewCandidateCount = await User.count({
      status: 'completed',
      isPassStageOne: true,
      isPassStageTwo: true,
      isPassStageThree: true,
      major: req.params.major
    });
    return res.send({ count: interviewCandidateCount });
  } catch (e) {
    return res.error(e);
  }
});

router.get('/major/:major/:id', adminAuthen(['programming', 'design', 'content', 'marketing']), async (req, res) => {
  try {
    const { major } = req.params;
    if (major !== req.admin.role) {
      return res.error({ message: 'Role Mismatch' });
    }
    const user = await User.findOne({
      _id: req.params.id,
      status: 'completed',
      isPassStageOne: true,
      isPassStageTwo: true,
      major
    });
    if (!user) return res.error({ message: 'User not found' });
    const answers = await Question.findById(user.questions);
    return res.send({
      answers: major === 'design' ? [
        ...answers.specialQuestions[major],
        { answer: user.designPortfolio }
      ] : answers.specialQuestions[major],
      note: answers.stageThree.find(item => item.grader_id.toString() === req.admin._id.toString()),
      activities: user.activities,
      academicYear: user.academicYear,
      faculty: user.faculty,
      department: user.department,
      university: user.university
    });
  } catch (e) {
    return res.error(e);
  }
});

router.put('/major/:major/:id', adminAuthen(['programming', 'design', 'content', 'marketing']), async (req, res) => {
  const { pass, note = '' } = req.body;
  const { _id: graderId } = req.admin;
  const { major } = req.params;
  try {
    const user = await User.findOne({
      status: 'completed',
      isPassStageOne: true,
      isPassStageTwo: true,
      major,
      _id: req.params.id
    });
    if (!user) return res.error({ message: 'User not found' });
    const answers = await Question.findById(user.questions);
    const { stageThree } = answers;
    const gradedItemIdx = _.findIndex(stageThree, item => item.grader_id.toString() === graderId.toString());
    if (gradedItemIdx !== -1) {
      answers.stageThree[gradedItemIdx] = {
        grader_id: graderId,
        note,
        isPass: pass
      };
    } else {
      answers.stageThree.push({
        grader_id: graderId,
        note,
        isPass: pass
      });
    }
    if (answers.stageThree.filter(item => item.isPass).length >= majorToPass[major]) {
      user.isPassStageThree = true;
    } else {
      user.isPassStageThree = false;
    }
    await [user.save(), answers.save()];
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

router.get('/criteria-analyze', adminAuthen('admin'), async (req, res) => {
  try {
    const queryCreator = major => User.find({
      status: 'completed',
      isPassStageOne: true,
      isPassStageTwo: true,
      major
    })
      .populate('questions', 'stageThree')
      .select('questions')
      .then(users => users.map(user => user.questions.stageThree.filter(graded => graded.isPass).length))
      .then(stats => _.range(0, maximumMajor[major] + 1)
        .map(passCount => stats.filter(stat => stat === passCount).length)
      );
    const [programming, marketing, design, content] = await Promise.all([
      queryCreator('programming'),
      queryCreator('marketing'),
      queryCreator('design'),
      queryCreator('content')
    ]);
    return res.send({
      programming,
      marketing,
      design,
      content
    });
  } catch (e) {
    return res.error(e);
  }
});

export default router;
