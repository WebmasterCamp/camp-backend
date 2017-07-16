import { Router } from 'express';
import { requireRoles } from '../middlewares';
import { Affiliate } from '../models';
import { respondResult, respondSuccess, respondErrors } from '../utilities';

const router = Router();
router.get('/', requireRoles('SuperAdmin', 'Supporter'), async (req, res) => {
  try {
    const affiliates = await Affiliate.find();
    respondResult(res)(affiliates);
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

router.post('/register', async (req, res) => {
  try {
    const { name, url } = req.body;
    const newAffiliate = new Affiliate({
      name,
      url,
      approved: false
    });
    await newAffiliate.save();
    respondResult(res)({ name, url });
  } catch (err) {
    respondErrors(res)(err);
  }
});

router.post('/update', requireRoles('SuperAdmin', 'Supporter'), async (req, res) => {
  try {
    const { affiliates } = req.body;
    affiliates.map(async (aff) => {
      const affiliate = await Affiliate.findOne({ name: aff.name });
      affiliate.approved = aff.approved;
      return await affiliate.save();
    });
    respondSuccess(res)();
  } catch (err) {
    respondErrors(res)(err);
  }
});

export default router;
