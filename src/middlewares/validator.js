import expressValidator from 'express-validator';
import _ from 'lodash';

export const validator = () => expressValidator({
  customValidators: {
    isArray: target => _.isArray(target),
    isString: (target) => _.isString(target),
    isMajor: (target) => _.includes(['programming', 'design', 'content', 'marketing'], target),
    arraySize: (target, lower, upper) => target.length >= lower && target.length <= upper
  }
});

export const validateRegistrationStep = [
  (req, res, next) => {
    // STEP 1 Form Validation
    req.checkBody('title', 'Invalid').notEmpty();
    req.checkBody('firstName', 'Invalid').notEmpty();
    req.checkBody('lastName', 'Invalid').notEmpty();
    req.checkBody('nickname', 'Invalid').notEmpty();
    req.checkBody('faculty', 'Invalid').notEmpty();
    req.checkBody('department', 'Invalid').notEmpty();
    req.checkBody('academicYear', 'Invalid').notEmpty();
    req.checkBody('university', 'Invalid').notEmpty();
    req.checkBody('sex', 'Invalid').notEmpty();
    req.checkBody('birthdate', 'Invalid').notEmpty().isDate();

    req.sanitizeBody('title').toString();
    req.sanitizeBody('firstName').toString();
    req.sanitizeBody('lastName').toString();
    req.sanitizeBody('nickname').toString();
    req.sanitizeBody('faculty').toString();
    req.sanitizeBody('department').toString();
    req.sanitizeBody('academicYear').toString();
    req.sanitizeBody('university').toString();
    req.sanitizeBody('sex').toString();
    req.sanitizeBody('birthdate').toDate();

    const errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
    return next();
  },
  (req, res, next) => {
    // STEP 2 Form Validation
    req.checkBody('address', 'Invalid').notEmpty();
    req.checkBody('province', 'Invalid').notEmpty();
    req.checkBody('postalCode', 'Invalid').notEmpty();
    req.checkBody('phone', 'Invalid').notEmpty();
    req.checkBody('email', 'Invalid').notEmpty().isEmail();
    req.checkBody('blood', 'Invalid').notEmpty();
    req.checkBody('foodAllergy', 'Invalid').notEmpty();
    req.checkBody('medAllergy', 'Invalid').notEmpty();
    req.checkBody('disease', 'Invalid').notEmpty();

    req.sanitizeBody('address').toString();
    req.sanitizeBody('province').toString();
    req.sanitizeBody('postalCode').toString();
    req.sanitizeBody('phone').toString();
    req.sanitizeBody('email').toString();
    req.sanitizeBody('blood').toString();
    req.sanitizeBody('foodAllergy').toString();
    req.sanitizeBody('medAllergy').toString();
    req.sanitizeBody('disease').toString();

    const errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
    return next();
  },
  (req, res, next) => {
    // STEP 3 Form Validation
    req.checkBody('knowCamp', 'Invalid').notEmpty();
    req.checkBody('whyJoinYWC', 'Invalid').notEmpty();
    req.checkBody('expectation', 'Invalid').notEmpty();

    req.sanitizeBody('knowCamp').toString();
    req.sanitizeBody('whyJoinYWC').toString();
    req.sanitizeBody('expectation').toString();

    const errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
    return next();
  },
  (req, res, next) => {
    // TODO: STEP 4: General question
    req.checkBody('answers', 'Invalid').isArray().arraySize(3, 3);
    const errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
    return next();
  },
  (req, res, next) => {
    // TODO: STEP 5: Major Question
    req.checkBody('major', 'Invalid role').notEmpty().isMajor();
    const errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
    return next();
  },
  (req, res, next) => {
    // TODO: FINAL STEP: Confirm
    req.checkBody('major', 'Invalid').notEmpty().isMajor();
    req.sanitizeBody('major').toString();

    const errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
    return next();
  }
];

export const registerValidator = (req, res, next) => {
  req.checkBody('title', 'Invalid').notEmpty();
  req.checkBody('firstName', 'Invalid').notEmpty();
  req.checkBody('lastName', 'Invalid').notEmpty();
  req.checkBody('nickname', 'Invalid').notEmpty();
  req.checkBody('address', 'Invalid').notEmpty();
  req.checkBody('province', 'Invalid').notEmpty();
  req.checkBody('postCode', 'Invalid').notEmpty();
  req.checkBody('phone', 'Invalid').notEmpty();
  req.checkBody('email', 'Invalid').notEmpty().isEmail();
  req.checkBody('facebook', 'Invalid').notEmpty();
  req.checkBody('twitter', 'Invalid').notEmpty();
  req.checkBody('line', 'Invalid').notEmpty();
  req.checkBody('faculty', 'Invalid').notEmpty();
  req.checkBody('department', 'Invalid').notEmpty();
  req.checkBody('academicYear', 'Invalid').notEmpty();
  req.checkBody('university', 'Invalid').notEmpty();
  req.checkBody('disease', 'Invalid').notEmpty();
  req.checkBody('food', 'Invalid').notEmpty();
  req.checkBody('event', 'Invalid').notEmpty();
  req.checkBody('works', 'Invalid').notEmpty();
  req.checkBody('knowCamp', 'Invalid').notEmpty();
  req.checkBody('whyJoinYwc', 'Invalid').notEmpty();
  req.checkBody('prominentPoint', 'Invalid').notEmpty();
  req.checkBody('sex', 'Invalid').notEmpty();
  req.checkBody('birthDay', 'Invalid').notEmpty().isDate();

  req.sanitizeBody('title').toString();
  req.sanitizeBody('firstName').toString();
  req.sanitizeBody('lastName').toString();
  req.sanitizeBody('nickname').toString();
  req.sanitizeBody('address').toString();
  req.sanitizeBody('province').toString();
  req.sanitizeBody('postCode').toString();
  req.sanitizeBody('phone').toString();
  req.sanitizeBody('email').toString();
  req.sanitizeBody('facebook').toString();
  req.sanitizeBody('twitter').toString();
  req.sanitizeBody('line').toString();
  req.sanitizeBody('faculty').toString();
  req.sanitizeBody('department').toString();
  req.sanitizeBody('academicYear').toString();
  req.sanitizeBody('university').toString();
  req.sanitizeBody('disease').toString();
  req.sanitizeBody('food').toString();
  req.sanitizeBody('event').toString();
  req.sanitizeBody('works').toString();
  req.sanitizeBody('knowCamp').toString();
  req.sanitizeBody('whyJoinYwc').toString();
  req.sanitizeBody('prominentPoint').toString();
  req.sanitizeBody('sex').toString();
  req.sanitizeBody('birthDay').toDate();

  const errors = req.validationErrors();
  if (errors) return res.status(400).send(errors);
  return next();
};

export const validateUserStep1 = (req, res, next) => {
  req.checkBody('answer1', 'Invalid answer1').notEmpty();
  req.checkBody('answer2', 'Invalid answer2').notEmpty();
  req.checkBody('answer3', 'Invalid answer3').notEmpty();
  req.sanitizeBody('answer1').toString();
  req.sanitizeBody('answer2').toString();
  req.sanitizeBody('answer3').toString();
  const errors = req.validationErrors();
  if (errors) return res.status(400).send(errors);
  return next();
};

export const validateUserStep2 = (req, res, next) => {
  req.checkBody('major', 'Invalid major').isMajor();
  req.checkBody('answer1', 'Invalid answer1').notEmpty();
  req.checkBody('answer2', 'Invalid answer2').notEmpty();
  req.checkBody('answer3', 'Invalid answer3').notEmpty();
  req.sanitizeBody('major').toString();
  req.sanitizeBody('answer1').toString();
  req.sanitizeBody('answer2').toString();
  req.sanitizeBody('answer3').toString();
  if (req.body.major === 'design') {
    req.checkBody('answer4', 'Invalid answer4').notEmpty();
    req.sanitizeBody('answer4').toString();
  }
  const errors = req.validationErrors();
  if (errors) return res.status(400).send(errors);
  return next();
};

export const validateFileStep2 = (req, res, next) => {
  if (_.includes(['design'], req.body.major) && !req.file) {
    return res.status(400).send({ code: 400, message: 'require file' });
  }
  return next();
};
export const validateFileStep3 = (req, res, next) => {
  if (_.includes(['design'], req.body.major) && !req.file) {
    return res.status(400).send({ code: 400, message: 'require file' });
  }
  return next();
};

export const validateUserStep3 = (req, res, next) => {
  req.checkBody('title', 'Invalid').notEmpty();
  req.checkBody('firstName', 'Invalid').notEmpty();
  req.checkBody('lastName', 'Invalid').notEmpty();
  req.checkBody('nickName', 'Invalid').notEmpty();
  req.checkBody('faculty', 'Invalid').notEmpty();
  req.checkBody('department', 'Invalid').notEmpty();
  req.checkBody('academicYear', 'Invalid').notEmpty();
  req.checkBody('university', 'Invalid').notEmpty();
  req.checkBody('sex', 'Invalid').notEmpty();
  req.checkBody('birthdate', 'Invalid').notEmpty().isDate();

  req.sanitizeBody('title').toString();
  req.sanitizeBody('firstName').toString();
  req.sanitizeBody('lastName').toString();
  req.sanitizeBody('nickName').toString();
  req.sanitizeBody('faculty').toString();
  req.sanitizeBody('department').toString();
  // req.sanitizeBody('academicYear').toString();
  req.sanitizeBody('university').toString();
  req.sanitizeBody('sex').toString();
  req.sanitizeBody('birthdate').toDate();

  const errors = req.validationErrors();
  if (errors) return res.status(400).send(errors);
  return next();
};

export const validateUserStep4 = (req, res, next) => {
  req.checkBody('address', 'Invalid').notEmpty();
  req.checkBody('province', 'Invalid').notEmpty();
  req.checkBody('postCode', 'Invalid').notEmpty();
  req.checkBody('phone', 'Invalid').notEmpty();
  req.checkBody('email', 'Invalid').notEmpty();
  req.checkBody('interview', 'Invalid').notEmpty();

  req.sanitizeBody('address').toString();
  req.sanitizeBody('province').toString();
  req.sanitizeBody('postCode').toString();
  req.sanitizeBody('phone').toString();
  req.sanitizeBody('email').toString();
  req.sanitizeBody('interview').toString();

  if (req.body.interview === 'other') {
    req.checkBody('idInterview', 'Invalid').notEmpty();
    req.sanitizeBody('idInterview').toString();
  }

  const errors = req.validationErrors();
  if (errors) return res.status(400).send(errors);
  return next();
};
export const validateUserStep5 = (req, res, next) => {
  req.checkBody('blood', 'Invalid').notEmpty();
  req.checkBody('knowCamp', 'Invalid').notEmpty();
  req.checkBody('whyJoinYwc', 'Invalid').notEmpty();
  req.checkBody('prominentPoint', 'Invalid').notEmpty();
  req.checkBody('event', 'Invalid').notEmpty();
  req.checkBody('major', 'Invalid').notEmpty();

  req.sanitizeBody('blood').toString();
  req.sanitizeBody('knowCamp').toString();
  req.sanitizeBody('whyJoinYwc').toString();
  req.sanitizeBody('prominentPoint').toString();
  req.sanitizeBody('event').toString();
  req.sanitizeBody('major').toString();

  if (req.body.knowCamp === 'other') {
    req.checkBody('knowCampAnother', 'Invalid').notEmpty();
    req.sanitizeBody('knowCampAnother').toString();
  }

  const errors = req.validationErrors();
  if (errors) return res.status(400).send(errors);
  return next();
};

export const hasFile = (req, res, next) => {
  if (!req.file) res.status(400).send({ code: 400, message: 'require file' });
  else next();
};

export const validateConfirm = (req, res, next) => {
  req.checkBody('major', 'Invalid major').notEmpty();
  req.sanitizeBody('major').toString();

  const errors = req.validationErrors();
  if (errors) return res.status(400).send(errors);
  return next();
};
