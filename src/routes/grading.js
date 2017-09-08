import { Router } from 'express';
import _ from 'lodash';
import { User, Question } from '../models';
import { adminAuthen } from '../middlewares/authenticator';

const router = Router();

router.get('/stage-one', adminAuthen(['admin', 'stage-1']), async (req, res) => {
  const completedUsers = await User.find({ status: 'completed' })
    .populate('questions')
    .select('_id questions')
    .lean();
  return res.send(completedUsers.map(user => Object.assign(user, {
    questions: {
      generalQuestions: user.questions.generalQuestions,
      stageOne: user.questions.stageOne
    }
  })));
});

router.get('/stage-one/:id', adminAuthen(['admin', 'stage-1']), async (req, res) => {
  const answers = await Question.findById(req.params.id);
  return res.send(answers.generalQuestions);
});

router.put('/stage-one/:id', adminAuthen('stage-1'), async (req, res) => {
  const { pass, note = '' } = req.body;
  const { _id: graderId } = req.admin;
  try {
    const answers = await Question.findById(req.params.id);
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
    await answers.save();
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

export default router;
