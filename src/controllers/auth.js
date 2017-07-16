import jwt from 'jsonwebtoken';
import { respondResult, respondErrors } from '../utilities';
import { User, Slip } from '../models';

export const login = async (req, res) => {
  try {
    const { facebook } = req.body;
    const count = await User.count({ facebook });

    if (count === 0) throw new Error('member not found');

    const token = jwt.sign({ facebook }, 'ywc14token');

    respondResult(res)(token);
  } catch (err) {
    respondErrors(res)(err);
  }
};

export const me = async (req, res) => {
  try {
    const { facebook } = req.user;
    const user = await User.findOne({ facebook }).populate('questions');

    respondResult(res)(user);
  } catch (err) {
    respondErrors(res)(err);
  }
};

export const confirm = async (req, res) => {
  try {
    const { money } = req.body;
    const user = await User.findOne({ transfer_money: money });

    user.slips.push(req.file.path);

    const slip = new Slip();
    slip.transfer_money = user.transfer_money;
    slip.no = user.no;
    slip.name = req.file.path;
    slip.status = 'waiting';

    await user.save();
    await slip.save();

    respondResult(res)('ok');
  } catch (err) {
    respondErrors(res)(err);
  }
};

export const slip = async (req, res) => {
  try {
    const { money } = req.body;
    const user = await User.findOne({ transfer_money: money });

    if (!user) throw new Error('not found.');
    if (user.slips.length !== 0) throw new Error('already sent slip.');

    respondResult(res)('ok');
  } catch (err) {
    respondErrors(res)(err);
  }
};

export const update = async (req, res) => {
  try {
    const { no, money } = req.body;
    const user = await User.findOne({ no });

    if (!user) throw new Error('not found.');
    user.transfer_money = money;

    await user.save();

    respondResult(res)('ok');
  } catch (err) {
    respondErrors(res)(err);
  }
};
