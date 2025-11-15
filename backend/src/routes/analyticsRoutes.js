const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET /api/analytics/dashboard
router.get('/dashboard', analyticsController.getDashboardData);

// GET /api/analytics/karma
router.get('/karma', analyticsController.getKarmaMetrics);

// GET /api/analytics/traffic
router.get('/traffic', analyticsController.getTrafficData);

module.exports = router;