const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/social/eventController');
const auth = require('../../middleware/auth');

router.post('/', auth, eventController.createEvent);
router.get('/', eventController.getEvents);
router.post('/:id/join', auth, eventController.joinEvent);

module.exports = router;