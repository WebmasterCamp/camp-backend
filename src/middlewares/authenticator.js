import { User } from '../models';
import { respondErrors } from '../utilities';
import { getUserInfoFromToken } from '../services';

export const authenticator = (req, res, next) => {
  next();
};

export const isAuthenticated = async (req, res, next) => {
  try {
    // const { facebook } = req.session;
    const accessToken = req.get('accessToken');
    const facebook = (await getUserInfoFromToken(accessToken)).id;
    req.facebook = facebook;
    const user = await User.findOne({ facebook }).populate('questions');
    if (user) {
      req.user = user;
      next();
    } else {
      respondErrors(res)({ code: 403, message: 'Forbidden' });
    }
  } catch (err) {
    respondErrors(res)(err);
  }
};

export const isInterviewMember = async (req, res, next) => {
  try {
    const { user } = req;

    if (user.status === 'interview1' || user.status === 'interview2') {
      next();
    } else {
      respondErrors(res)({ code: 403, message: 'Forbidden' });
    }
  } catch (err) {
    respondErrors(res)(err);
  }
};

export const afterAnnounce = async (req, res, next) => {
  const announceTime = new Date(2016, 10, 16, 19, 0, 0);

  if (Date.now() < announceTime.getTime()) {
    respondErrors(res)({ code: 403, message: 'Forbidden' });
  } else {
    next();
  }
};

export default authenticator;
