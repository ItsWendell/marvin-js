import { Router } from 'express';

const router = new Router();

router.get('/', function(req, res) {
    res.json({ message: 'Hi Slack!' });   
});

export default router;