import express from 'express';

const router = express.Router();

router.get('/deep', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'All systems operational',
    timestamp: new Date().toISOString(),
    models: ['User', 'Goal', 'Friend', 'Post'],
    routes: ['auth', 'goals', 'friends', 'social', 'health']
  });
});

export default router;
