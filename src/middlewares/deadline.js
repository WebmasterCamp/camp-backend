import moment from 'moment';

export const closeAfterDeadline = (req, res, next) => {
  if (moment().isAfter('2017-11-13T00:00:00')) {
    return res.error('Registration is now close');
  }
  return next();
};
