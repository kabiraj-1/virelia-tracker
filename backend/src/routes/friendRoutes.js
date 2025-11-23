import express from 'express';
import Friend from '../models/Friend.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Send friend request
router.post('/request/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Can't send request to yourself
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if friend request already exists
    const existingRequest = await Friend.findOne({
      $or: [
        { user: req.user.id, friend: userId },
        { user: userId, friend: req.user.id }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already exists' });
    }

    // Create friend request
    const friendRequest = new Friend({
      user: req.user.id,
      friend: userId,
      requestedBy: req.user.id,
      status: 'pending'
    });

    await friendRequest.save();

    // Also create reverse entry for the other user
    const reverseRequest = new Friend({
      user: userId,
      friend: req.user.id,
      requestedBy: req.user.id,
      status: 'pending'
    });

    await reverseRequest.save();

    res.status(201).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

// Get friend requests (received)
router.get('/requests', auth, async (req, res) => {
  try {
    const friendRequests = await Friend.find({
      user: req.user.id,
      status: 'pending',
      requestedBy: { $ne: req.user.id } // Only requests received from others
    }).populate('requestedBy', 'username email');

    res.json(friendRequests);
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ error: 'Failed to get friend requests' });
  }
});

// Accept friend request
router.put('/accept/:requestId', auth, async (req, res) => {
  try {
    const { requestId } = req.params;

    // Find and update the request
    const friendRequest = await Friend.findOneAndUpdate(
      {
        _id: requestId,
        user: req.user.id,
        status: 'pending'
      },
      { status: 'accepted' },
      { new: true }
    );

    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    // Also update the reverse entry
    await Friend.findOneAndUpdate(
      {
        user: friendRequest.friend,
        friend: req.user.id
      },
      { status: 'accepted' }
    );

    res.json({ message: 'Friend request accepted successfully' });
  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
});

// Reject friend request
router.put('/reject/:requestId', auth, async (req, res) => {
  try {
    const { requestId } = req.params;

    const friendRequest = await Friend.findOneAndUpdate(
      {
        _id: requestId,
        user: req.user.id,
        status: 'pending'
      },
      { status: 'rejected' }
    );

    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    // Also update the reverse entry
    await Friend.findOneAndUpdate(
      {
        user: friendRequest.friend,
        friend: req.user.id
      },
      { status: 'rejected' }
    );

    res.json({ message: 'Friend request rejected successfully' });
  } catch (error) {
    console.error('Reject friend request error:', error);
    res.status(500).json({ error: 'Failed to reject friend request' });
  }
});

// Get friends list
router.get('/', auth, async (req, res) => {
  try {
    const friends = await Friend.find({
      user: req.user.id,
      status: 'accepted'
    }).populate('friend', 'username email');

    res.json(friends);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Failed to get friends list' });
  }
});

// Remove friend
router.delete('/:friendId', auth, async (req, res) => {
  try {
    const { friendId } = req.params;

    // Remove friendship from both sides
    await Friend.deleteMany({
      $or: [
        { user: req.user.id, friend: friendId },
        { user: friendId, friend: req.user.id }
      ]
    });

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

// Search users (for adding friends)
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user.id } }, // Exclude current user
        {
          $or: [
            { username: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    }).select('username email').limit(10);

    // Check friendship status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const friendship = await Friend.findOne({
          $or: [
            { user: req.user.id, friend: user._id },
            { user: user._id, friend: req.user.id }
          ]
        });

        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          friendshipStatus: friendship ? friendship.status : 'none'
        };
      })
    );

    res.json(usersWithStatus);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

export default router;
