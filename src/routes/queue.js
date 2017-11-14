import { Router } from 'express';
import { Queue } from '../models';

const router = Router();

router.post('/:major', async (req, res) => {
  const { major } = req.params;
  const { isDecrease = false } = req.body;
  try {
    const majorQueue = await Queue.findOne({ major });
    if (isDecrease) {
      majorQueue.order -= 1;
    } else {
      majorQueue.order += 1;
    }
    await majorQueue.save();
    req.ioSendQueue();
    return res.send({ success: true });
  } catch (e) {
    return res.error(e);
  }
});

export default router;
