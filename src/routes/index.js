import { Router } from 'express';

import users from './users';
// import count from './count';
import admin from './admin';
// import questions from './questions';
import affiliates from './affiliates';
import auth from './auth';
// import slip from './slip';
import interview from './interview';
// import member from './member';
import registration from './registration';
import grading from './grading';
import file from './file';
import queue from './queue';

const router = Router();
router.get('/', (req, res) => {
  res.status(200).send({ status: 'YWC API Server is running!' });
});
router.use('/users', users);
// router.use('/count', count);
router.use('/admin', admin);
// router.use('/questions', questions);
router.use('/affiliates', affiliates);
router.use('/auth', auth);
// router.use('/slip', slip);
router.use('/interview', interview);
// router.use('/member', member);
router.use('/registration', registration);
router.use('/grading', grading);
router.use('/files', file);
router.use('/queues', queue);

export default router;
