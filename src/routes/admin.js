import { Router } from 'express';
import bcrypt from 'bcrypt';

import { adminAuthen } from '../middlewares/authenticator';
import { requireRoles, adminAuthorize } from '../middlewares';
import { respondResult, respondSuccess, respondErrors } from '../utilities';
import { Admin } from '../models';

const router = Router();

// router.post('/', requireRoles('SuperAdmin', 'Supporter'), async (req, res) => {
//   try {
//     req.checkBody('username', 'Invalid username').notEmpty().isString();
//     req.checkBody('password', 'Invalid password').notEmpty().isString();
//     req.checkBody('role', 'Invalid role').notEmpty().isString();
//     req.sanitizeBody('username').toString();
//     req.sanitizeBody('password').toString();
//     req.sanitizeBody('role').toString();
//     const errors = req.validationErrors();
//     if (errors) respondErrors(errors, 400);
//     else {
//       const { username, password, role } = req.body;
//       const admin = new Admin({
//         username,
//         password, /* todo : Bcrypt*/
//         role
//       });
//       admin.save();
//       respondResult(res)(admin);
//     }
//   } catch (err) {
//     respondErrors(res)(err);
//   }
// });
// router.put('/:id', requireRoles('SuperAdmin', 'Supporter'), async (req, res) => {
//   try {
//     req.checkBody('username', 'Invalid username').optional().isString();
//     req.checkBody('password', 'Invalid password').optional().isString();
//     req.checkBody('role', 'Invalid role').optional().isString();
//     req.sanitizeBody('username').toString();
//     req.sanitizeBody('password').toString();
//     req.sanitizeBody('role').toString();
//     const errors = req.validationErrors();
//     if (errors) respondErrors(errors, 400);
//     else {
//       const admin = await Admin.findById(req.params.id);
//       const { password, role } = req.body;
//       if (password) admin.password = password;
//       if (role) admin.role = role;
//       await admin.save();
//       const result = await Admin.findById(req.params.id);
//       respondResult(res)(result);
//     }
//   } catch (err) {
//     respondErrors(res)(err);
//   }
// });
// router.delete('/:id', requireRoles('SuperAdmin'), async (req, res) => {
//   try {
//     await Admin.findByIdAndRemove(req.params.id);
//     respondSuccess(res)();
//   } catch (err) {
//     respondErrors(res)(err);
//   }
// });
// router.post('/login', async (req, res) => {
//   try {
//     req.checkBody('username', 'Invalid username').notEmpty().isString();
//     req.checkBody('password', 'Invalid password').notEmpty().isString();
//     req.sanitizeBody('username').toString();
//     req.sanitizeBody('password').toString();
//     const errors = req.validationErrors();
//     if (errors) respondErrors(errors, 400);
//     else {
//       const { username, password } = req.body;
//       // todo : Bcrypt
//       const admin = await Admin.findOne({ username, password });
//       if (admin) {
//         respondResult(res)(admin);
//       }
//     }
//   } catch (err) {
//     respondErrors(res)(err);
//   }
// });

// router.post('/logout', (req, res) => {
//   req.session.destroy(() => {
//     req.session = null;
//     res.send({ logout: true });
//   });
// });
router.get('/', adminAuthen('admin'), async (req, res) => {
  try {
    const adminUsers = await Admin.find();
    return res.send(adminUsers);
  } catch (err) {
    return res.error(err);
  }
});

router.post('/', adminAuthen('admin'), async (req, res) => {
  try {
    await Admin.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      role: req.body.role
    });
    return res.send({ success: true });
  } catch (err) {
    return res.error(err);
  }
});

router.get('/me', adminAuthen('any'), (req, res) => {
  res.send(req.admin);
});

router.delete('/:id', adminAuthen('admin'), async (req, res) => {
  try {
    await Admin.remove({ _id: req.params.id });
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

// router.get('/:id', requireRoles('SuperAdmin', 'Supporter'), async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.params.id);
//     respondResult(res)(admin);
//   } catch (err) {
//     respondErrors(res)(err);
//   }
// });
export default router;
