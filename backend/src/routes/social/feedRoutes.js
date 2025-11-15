const express = require('express');
const router = express.Router();
const feedController = require('../../controllers/social/feedController');
const auth = require('../../middleware/auth');

router.post('/posts', auth, feedController.createPost);
router.get('/posts', feedController.getFeed);
router.post('/posts/:postId/comments', auth, feedController.addComment);

module.exports = router;