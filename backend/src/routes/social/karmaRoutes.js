const express = require('express');
const router = express.Router();
const karmaController = require('../../controllers/social/karmaController');
const auth = require('../../middleware/auth');

router.get('/leaderboard', karmaController.getLeaderboard);
router.get('/user/:userId', auth, karmaController.getUserKarma);

module.exports = router;