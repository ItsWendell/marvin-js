import { Router } from 'express';

const router = new Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hi Slack!' });
});

export default router;
