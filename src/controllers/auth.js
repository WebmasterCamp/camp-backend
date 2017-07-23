import jwt from 'jsonwebtoken';
import fb from 'fb';
import _ from 'lodash';
import config from 'config';
import { respondResult, respondErrors } from '../utilities';
import { User, Question, Slip } from '../models';
// export const login = async (req, res) => {
//   try {
//     const { facebook } = req.body;
//     const count = await User.count({ facebook });

//     if (count === 0) throw new Error('member not found');

//     const token = jwt.sign({ facebook }, 'ywc14token');

//     respondResult(res)(token);
//   } catch (err) {
//     respondErrors(res)(err);
//   }
// };

export const login = async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) return respondErrors(res)('Not Token Provide');
  try {
    fb.setAccessToken(accessToken);
    await new Promise((resolve, reject) => {
      fb.napi('oauth/access_token', {
        client_id: config.FACEBOOK_ID,
        client_secret: config.FACEBOOK_SECRET.toString(),
        grant_type: 'fb_exchange_token',
        fb_exchange_token: accessToken
      }, (err, data) => err ? reject(err) : resolve(data));
    });
    const fbUser = await new Promise((resolve, reject) => {
      fb.napi('/me', {
        fields: 'id,first_name,last_name,email'
      }, (err, data) => err ? reject(err) : resolve(data));
    });
    let user = await User.findOne({ facebook: fbUser.id });
    if (!user) {
      console.log('NO USER: CREATE ONE');
      const questions = new Question();
      const q = await questions.save();
      const newUser = new User({
        facebook: fbUser.id,
        questions: q._id,
        completed: _.range(6).map(() => false),
        status: 'in progress',
        firstName: fbUser.first_name,
        lastName: fbUser.last_name
      });
      user = await newUser.save();
    }
    console.log(user);
    const token = jwt.sign(user.toObject(), config.JWT_SECRET);
    return res.send({ token });
  } catch (e) {
    return respondErrors(res)(e);
  }
};

export const me = async (req, res) => {
  console.log(req.user);
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
