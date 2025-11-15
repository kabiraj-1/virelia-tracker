const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// POST /api/location/update
router.post('/update', locationController.updateLocation);

// GET /api/location/:userId
router.get('/:userId', locationController.getLocation);

// GET /api/location/history/:userId
router.get('/history/:userId', locationController.getLocationHistory);

module.exports = router;