import { Router } from 'express';
import { Queue } from '../models';

const router = Router();

router.get('/:major', async (req, res) => {
  console.log('come to me');
  const { major } = req.params;
  try {
    const majorQueue = await Queue.findOne({ major });
    majorQueue.order += 1;
    await majorQueue.save();
    req.ioSendQueue();
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

export default router;
