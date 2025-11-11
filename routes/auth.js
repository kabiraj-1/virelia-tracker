import express from 'express';
const router = express.Router();

router.post('/register', (req, res) => {
  res.json({ 
    success: true,
    message: 'Register endpoint working!',
    timestamp: new Date().toISOString()
  });
});

router.post('/login', (req, res) => {
  res.json({ 
    success: true,
    message: 'Login endpoint working!',
    timestamp: new Date().toISOString()
  });
});

export default router;
