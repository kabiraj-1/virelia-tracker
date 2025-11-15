const express = require('express');
const router = express.Router();

// Get all events
router.get('/', (req, res) => {
  res.json({
    success: true,
    events: [
      {
        id: 1,
        title: 'Community Cleanup',
        description: 'Help clean up the local park',
        date: '2024-11-20',
        location: 'Central Park',
        organizer: 'Community Group',
        participants: 15,
        maxParticipants: 30
      },
      {
        id: 2,
        title: 'Yoga Session',
        description: 'Morning yoga for beginners',
        date: '2024-11-22',
        location: 'Community Center',
        organizer: 'Wellness Group',
        participants: 8,
        maxParticipants: 20
      }
    ]
  });
});

// Create new event
router.post('/', (req, res) => {
  console.log('Creating event:', req.body);
  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    event: {
      id: Date.now(),
      ...req.body,
      participants: 0
    }
  });
});

// Get event by ID
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    event: {
      id: req.params.id,
      title: 'Sample Event',
      description: 'This is a sample event',
      date: '2024-11-25',
      location: 'Sample Location',
      organizer: 'Sample Organizer',
      participants: 10,
      maxParticipants: 50
    }
  });
});

// Join event
router.post('/:id/join', (req, res) => {
  console.log(`User joining event ${req.params.id}:`, req.body);
  res.json({
    success: true,
    message: 'Successfully joined the event'
  });
});

module.exports = router;
