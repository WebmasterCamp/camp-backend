import { Router } from 'express';
import { requireRoles } from '../middlewares';
import { adminAuthen } from '../middlewares/authenticator';
import { Affiliate } from '../models';
import { respondResult, respondSuccess, respondErrors } from '../utilities';

const router = Router();
router.get('/', adminAuthen('admin'), async (req, res) => {
  try {
    const affiliates = await Affiliate.find();
    respondResult(res)(affiliates);
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, url } = req.body;
    const newAffiliate = new Affiliate({
      name,
      url,
      approved: false
    });
    await newAffiliate.save();
    return res.send({ success: true });
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.get('/approved', async (req, res) => {
  try {
    const affiliates = await Affiliate.find({ approved: true });
    respondResult(res)(affiliates);
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.delete('/:id', adminAuthen('admin'), async (req, res) => {
  try {
    await Affiliate.remove({ _id: req.params.id });
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

router.put('/:id/approved', adminAuthen('admin'), async (req, res) => {
  try {
    await Affiliate.findOneAndUpdate({ _id: req.params.id }, { approved: req.body.approved });
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

// router.post('/update', requireRoles('SuperAdmin', 'Supporter'), async (req, res) => {
//   try {
//     const { affiliates } = req.body;
//     affiliates.map(async (aff) => {
//       const affiliate = await Affiliate.findOne({ name: aff.name });
//       affiliate.approved = aff.approved;
//       return await affiliate.save();
//     });
//     respondSuccess(res)();
//   } catch (err) {
//     respondErrors(res)(err);
//   }
// });

export default router;
