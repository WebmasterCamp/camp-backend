import { Router } from 'express';
import sample from './sample';
import users from './users';
import count from './count';
import admin from './admin';
import questions from './questions';
import affiliates from './affiliates';
import auth from './auth';
import slip from './slip';
import interview from './interview';
import member from './member';

const router = Router();
router.get('/', (req, res) => {
  res.status(200).send({ status: 'Server API Running' });
});
router.use('/sample', sample);
router.use('/users', users);
router.use('/count', count);
router.use('/admin', admin);
router.use('/questions', questions);
router.use('/affiliates', affiliates);
router.use('/auth', auth);
router.use('/slip', slip);
router.use('/interview', interview);
router.use('/member', member);

export default router;
