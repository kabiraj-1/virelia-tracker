const express = require('express');
const router = express.Router();

// Update location
router.post('/update', (req, res) => {
  res.json({
    success: true,
    message: 'Location updated successfully',
    location: req.body
  });
});

// Get location
router.get('/:userId', (req, res) => {
  res.json({
    latitude: 27.7172,
    longitude: 85.3240,
    address: 'Kathmandu, Nepal',
    timestamp: new Date().toISOString()
  });
});

// Get location history
router.get('/history/:userId', (req, res) => {
  res.json([
    {
      latitude: 27.7172,
      longitude: 85.3240,
      timestamp: new Date().toISOString()
    }
  ]);
});

module.exports = router;
