const express = require('express');
const router = express.Router();

// Register route
router.post('/register', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'User registration successful',
    user: {
      id: 'demo-user-123',
      name: req.body.name,
      email: req.body.email,
      karma: 100
    },
    token: 'demo-jwt-token'
  });
});

// Login route
router.post('/login', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: {
      id: 'demo-user-123',
      name: 'Demo User',
      email: req.body.email,
      karma: 1250
    },
    token: 'demo-jwt-token'
  });
});

// Profile route
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    user: {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@virelia.com',
      karma: 1250
    }
  });
});

module.exports = router;
