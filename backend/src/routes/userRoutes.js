const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users
router.get('/', userController.getAllUsers);

// GET /api/users/:id
router.get('/:id', userController.getUserById);

// GET /api/users/leaderboard
router.get('/leaderboard', userController.getLeaderboard);

module.exports = router;