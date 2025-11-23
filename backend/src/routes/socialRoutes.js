import express from 'express';
import Post from '../models/Post.js';
import Friend from '../models/Friend.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Simple in-memory storage for demo (replace with proper file storage in production)
const storage = {};

// Create a post (without file uploads for now to simplify deployment)
router.post('/posts', auth, async (req, res) => {
  try {
    const { content, goalId, scheduledPublish, visibility = 'friends' } = req.body;
    
    const postData = {
      user: req.user.id,
      content,
      visibility,
      isPublished: !scheduledPublish
    };

    if (goalId) {
      postData.goal = goalId;
    }

    if (scheduledPublish) {
      postData.scheduledPublish = new Date(scheduledPublish);
      postData.isPublished = false;
    }

    const post = new Post(postData);
    await post.save();

    await post.populate('user', 'username');
    if (goalId) {
      await post.populate('goal', 'title');
    }

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get feed (posts from friends)
router.get('/feed', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get user's friends
    const friends = await Friend.find({
      user: req.user.id,
      status: 'accepted'
    }).select('friend');

    const friendIds = friends.map(f => f.friend);
    friendIds.push(req.user.id); // Include user's own posts

    const posts = await Post.find({
      user: { $in: friendIds },
      isPublished: true,
      $or: [
        { visibility: 'public' },
        { visibility: 'friends' }
      ]
    })
    .populate('user', 'username')
    .populate('goal', 'title')
    .populate('likes.user', 'username')
    .populate('comments.user', 'username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Post.countDocuments({
      user: { $in: friendIds },
      isPublished: true,
      $or: [
        { visibility: 'public' },
        { visibility: 'friends' }
      ]
    });

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Failed to get feed' });
  }
});

// Like a post
router.post('/posts/:postId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if already liked
    const alreadyLiked = post.likes.some(like => 
      like.user.toString() === req.user.id
    );

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(like => 
        like.user.toString() !== req.user.id
      );
    } else {
      // Like
      post.likes.push({ user: req.user.id });
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Comment on a post
router.post('/posts/:postId/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({
      user: req.user.id,
      content
    });

    await post.save();
    await post.populate('comments.user', 'username');

    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get user's posts
router.get('/posts/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check friendship status or if it's the user's own profile
    const isOwnProfile = userId === req.user.id;
    const isFriend = await Friend.findOne({
      user: req.user.id,
      friend: userId,
      status: 'accepted'
    });

    let query = { user: userId, isPublished: true };

    if (!isOwnProfile) {
      if (!isFriend) {
        query.visibility = 'public';
      } else {
        query.$or = [
          { visibility: 'public' },
          { visibility: 'friends' }
        ];
      }
    }

    const posts = await Post.find(query)
      .populate('user', 'username')
      .populate('goal', 'title')
      .populate('likes.user', 'username')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Failed to get user posts' });
  }
});

// Schedule post
router.put('/posts/:postId/schedule', auth, async (req, res) => {
  try {
    const { scheduledPublish } = req.body;
    const post = await Post.findOne({
      _id: req.params.postId,
      user: req.user.id
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.scheduledPublish = new Date(scheduledPublish);
    post.isPublished = false;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Schedule post error:', error);
    res.status(500).json({ error: 'Failed to schedule post' });
  }
});

export default router;
