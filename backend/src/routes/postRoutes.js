const express = require('express');
const router = express.Router();

// Get all posts
router.get('/', (req, res) => {
  res.json({
    success: true,
    posts: [
      {
        id: 1,
        user: {
          name: 'Alice Johnson',
          avatar: 'https://via.placeholder.com/40'
        },
        content: 'Just had an amazing time at the community cleanup! í¼¿',
        timestamp: '2024-11-15T10:30:00Z',
        likes: 12,
        comments: 3,
        shares: 2
      },
      {
        id: 2,
        user: {
          name: 'Bob Smith',
          avatar: 'https://via.placeholder.com/40'
        },
        content: 'Looking forward to the yoga session tomorrow! í·˜â€â™€ï¸',
        timestamp: '2024-11-14T15:45:00Z',
        likes: 8,
        comments: 1,
        shares: 0
      }
    ]
  });
});

// Create new post
router.post('/', (req, res) => {
  console.log('Creating post:', req.body);
  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    post: {
      id: Date.now(),
      user: {
        name: 'Current User',
        avatar: 'https://via.placeholder.com/40'
      },
      ...req.body,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0
    }
  });
});

// Like a post
router.post('/:id/like', (req, res) => {
  console.log(`Liking post ${req.params.id}`);
  res.json({
    success: true,
    message: 'Post liked successfully'
  });
});

// Add comment to post
router.post('/:id/comments', (req, res) => {
  console.log(`Adding comment to post ${req.params.id}:`, req.body);
  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    comment: {
      id: Date.now(),
      user: {
        name: 'Current User',
        avatar: 'https://via.placeholder.com/40'
      },
      ...req.body,
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;
