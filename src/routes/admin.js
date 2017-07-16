import { Router } from 'express';
import { requireRoles, adminAuthorize } from '../middlewares';
import { respondResult, respondSuccess, respondErrors } from '../utilities';
import { Admin } from '../models';

const router = Router();

router.get('/', requireRoles('SuperAdmin', 'Supporter'), async (req, res) => {
  try {
    const adminUsers = await Admin.find();
    respondResult(res)(adminUsers);
  } catch (err) {
    respondErrors(res)(err);
  }
});
router.post('/', requireRoles('SuperAdmin', 'Supporter'), async (req, res) => {
  try {
    req.checkBody('username', 'Invalid username').notEmpty().isString();
    req.checkBody('password', 'Invalid password').notEmpty().isString();
    req.checkBody('role', 'Invalid role').notEmpty().isString();
    req.sanitizeBody('username').toString();
    req.sanitizeBody('password').toString();
    req.sanitizeBody('role').toString();
    const errors = req.validationErrors();
    if (errors) respondErrors(errors, 400);
    else {
      const { username, password, role } = req.body;
      const admin = new Admin({
        username,
        password, /* todo : Bcrypt*/
        role
      });
      admin.save();
      respondResult(res)(admin);
    }
  } catch (err) {
    respondErrors(res)(err);
  }
});
router.put('/:id', requireRoles('SuperAdmin', 'Supporter'), async (req, res) => {
  try {
    req.checkBody('username', 'Invalid username').optional().isString();
    req.checkBody('password', 'Invalid password').optional().isString();
    req.checkBody('role', 'Invalid role').optional().isString();
    req.sanitizeBody('username').toString();
    req.sanitizeBody('password').toString();
    req.sanitizeBody('role').toString();
    const errors = req.validationErrors();
    if (errors) respondErrors(errors, 400);
    else {
      const admin = await Admin.findById(req.params.id);
      const { password, role } = req.body;
      if (password) admin.password = password;
      if (role) admin.role = role;
      await admin.save();
      const result = await Admin.findById(req.params.id);
      respondResult(res)(result);
    }
  } catch (err) {
    respondErrors(res)(err);
  }
});
router.delete('/:id', requireRoles('SuperAdmin'), async (req, res) => {
  try {
    await Admin.findByIdAndRemove(req.params.id);
    respondSuccess(res)();
  } catch (err) {
    respondErrors(res)(err);
  }
});
router.post('/login', async (req, res) => {
  try {
    req.checkBody('username', 'Invalid username').notEmpty().isString();
    req.checkBody('password', 'Invalid password').notEmpty().isString();
    req.sanitizeBody('username').toString();
    req.sanitizeBody('password').toString();
    const errors = req.validationErrors();
    if (errors) respondErrors(errors, 400);
    else {
      const { username, password } = req.body;
      // todo : Bcrypt
      const admin = await Admin.findOne({ username, password });
      if (admin) {
        respondResult(res)(admin);
      }
    }
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    req.session = null;
    res.send({ logout: true });
  });
});

router.get('/me', requireRoles(
  'SuperAdmin',
  'Supporter',
  'JudgeDev',
  'JudgeMarketing',
  'JudgeContent',
  'JudgeDesign'
), adminAuthorize, (req, res) => {
  respondResult(res)(req.admin);
});

router.get('/:id', requireRoles('SuperAdmin', 'Supporter'), async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    respondResult(res)(admin);
  } catch (err) {
    respondErrors(res)(err);
  }
});
export default router;
