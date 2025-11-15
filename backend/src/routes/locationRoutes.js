const express = require('express');
const router = express.Router();

// Share location
router.post('/share', (req, res) => {
  console.log('Sharing location:', req.body);
  res.json({
    success: true,
    message: 'Location shared successfully',
    location: {
      id: Date.now(),
      ...req.body,
      timestamp: new Date().toISOString()
    }
  });
});

// Get nearby users
router.get('/nearby', (req, res) => {
  const { lat, lng, radius = 5 } = req.query;
  console.log(`Finding users near ${lat}, ${lng} within ${radius}km`);
  
  res.json({
    success: true,
    users: [
      {
        id: 'user-1',
        name: 'Alice Johnson',
        distance: '0.5 km',
        isOnline: true,
        lastSeen: new Date().toISOString()
      },
      {
        id: 'user-2',
        name: 'Bob Smith',
        distance: '1.2 km',
        isOnline: false,
        lastSeen: '2024-11-15T08:30:00Z'
      },
      {
        id: 'user-3',
        name: 'Carol Davis',
        distance: '2.8 km',
        isOnline: true,
        lastSeen: new Date().toISOString()
      }
    ]
  });
});

// Get location history
router.get('/history', (req, res) => {
  res.json({
    success: true,
    history: [
      {
        id: 1,
        lat: 27.7172,
        lng: 85.3240,
        address: 'Kathmandu, Nepal',
        timestamp: '2024-11-15T10:00:00Z'
      },
      {
        id: 2,
        lat: 27.7000,
        lng: 85.3000,
        address: 'Patan, Nepal',
        timestamp: '2024-11-14T15:30:00Z'
      }
    ]
  });
});

// Update location
router.put('/update', (req, res) => {
  console.log('Updating location:', req.body);
  res.json({
    success: true,
    message: 'Location updated successfully',
    location: {
      ...req.body,
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;
