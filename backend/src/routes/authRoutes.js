const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/profile
router.get('/profile', authController.getProfile);

// PUT /api/auth/profile
router.put('/profile', authController.updateProfile);

// POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router;