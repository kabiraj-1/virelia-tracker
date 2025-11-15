const express = require('express');
const router = express.Router();

// Get user profile
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    user: {
      id: 'user-123',
      name: 'Demo User',
      email: 'demo@virelia.com',
      karma: 1250,
      level: 'Explorer',
      eventsAttended: 12,
      badges: ['Early Adopter', 'Community Helper']
    }
  });
});

// Update user profile
router.put('/profile', (req, res) => {
  console.log('Updating profile:', req.body);
  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: 'user-123',
      ...req.body,
      karma: 1250
    }
  });
});

// Get user activities
router.get('/activities', (req, res) => {
  res.json({
    success: true,
    activities: [
      {
        id: 1,
        type: 'event_joined',
        title: 'Joined Community Cleanup',
        date: '2024-11-15',
        karma: 20
      },
      {
        id: 2,
        type: 'location_shared',
        title: 'Shared location with friends',
        date: '2024-11-14',
        karma: 10
      }
    ]
  });
});

// Get user friends
router.get('/friends', (req, res) => {
  res.json({
    success: true,
    friends: [
      {
        id: 'friend-1',
        name: 'Alice Johnson',
        karma: 1800,
        isOnline: true
      },
      {
        id: 'friend-2',
        name: 'Bob Smith',
        karma: 950,
        isOnline: false
      }
    ]
  });
});

module.exports = router;
