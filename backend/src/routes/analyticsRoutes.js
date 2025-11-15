const express = require('express');
const router = express.Router();

// Dashboard data
router.get('/dashboard', (req, res) => {
  res.json({
    totalUsers: 2847,
    activeUsers: 143,
    totalKarma: 125000,
    engagementRate: 78
  });
});

// Karma metrics
router.get('/karma', (req, res) => {
  res.json({
    userKarma: 1250,
    rank: 42,
    weeklyChange: 125
  });
});

// Traffic data
router.get('/traffic', (req, res) => {
  res.json({
    dailyVisits: 1542,
    uniqueUsers: 847,
    pageViews: 8921
  });
});

module.exports = router;
