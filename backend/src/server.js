import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { createServer } from 'http';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Trust proxy for Render deployment
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Enhanced User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  bio: String,
  website: String,
  location: String,
  avatar: String,
  coverImage: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }],
  online: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now }
}, {
  timestamps: true,
});

// Post Schema
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  image: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [String]
}, {
  timestamps: true,
});

// Message Schema
const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { type: String, enum: ['text', 'image'], default: 'text' }
}, {
  timestamps: true,
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['friend_request', 'friend_accepted', 'post_like', 'post_comment', 'message'],
    required: true 
  },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  message: String,
  read: { type: Boolean, default: false }
}, {
  timestamps: true,
});

// Create Models
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Message = mongoose.model('Message', messageSchema);
const Notification = mongoose.model('Notification', notificationSchema);

// In-memory storage fallback
let memoryUsers = [];
let memoryPosts = [];
let memoryMessages = [];
let memoryNotifications = [];
let memoryUserId = 1;
let memoryPostId = 1;
let memoryMessageId = 1;
let memoryNotificationId = 1;

// Socket.IO for real-time features
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user_online', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    
    // Update user online status
    if (mongoose.connection.readyState === 1) {
      User.findByIdAndUpdate(userId, { online: true, lastSeen: new Date() });
    } else {
      const userIndex = memoryUsers.findIndex(u => u.id == userId);
      if (userIndex !== -1) {
        memoryUsers[userIndex].online = true;
        memoryUsers[userIndex].lastSeen = new Date();
      }
    }

    io.emit('online_users', Array.from(onlineUsers.keys()));
  });

  socket.on('send_message', async (data) => {
    const { from, to, content } = data;
    
    try {
      let message;
      if (mongoose.connection.readyState === 1) {
        message = await Message.create({ from, to, content });
        message = await message.populate('from', 'name email avatar');
      } else {
        message = {
          id: memoryMessageId++,
          from: memoryUsers.find(u => u.id == from),
          to,
          content,
          createdAt: new Date()
        };
        memoryMessages.push(message);
      }

      // Send to recipient if online
      const recipientSocket = onlineUsers.get(to);
      if (recipientSocket) {
        io.to(recipientSocket).emit('new_message', message);
      }

      socket.emit('message_sent', message);
    } catch (error) {
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  socket.on('typing', (data) => {
    const recipientSocket = onlineUsers.get(data.to);
    if (recipientSocket) {
      io.to(recipientSocket).emit('user_typing', { from: data.from, typing: data.typing });
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      
      // Update user offline status
      if (mongoose.connection.readyState === 1) {
        User.findByIdAndUpdate(socket.userId, { online: false, lastSeen: new Date() });
      } else {
        const userIndex = memoryUsers.findIndex(u => u.id == socket.userId);
        if (userIndex !== -1) {
          memoryUsers[userIndex].online = false;
          memoryUsers[userIndex].lastSeen = new Date();
        }
      }

      io.emit('online_users', Array.from(onlineUsers.keys()));
    }
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const storageType = dbStatus === 'connected' ? 'MongoDB' : 'In-memory';
  
  res.json({
    message: 'Welcome to Virelia Tracker Backend API',
    status: 'operational',
    database: dbStatus,
    storage: storageType,
    onlineUsers: onlineUsers.size,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Auth routes (existing - keep as is)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.create({ name, email, password: hashedPassword });

      const token = jwt.sign(
        { userId: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } else {
      const existingUser = memoryUsers.find(user => user.email === email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = {
        id: memoryUserId++,
        name,
        email,
        password: hashedPassword,
        friends: [],
        friendRequests: [],
        online: false,
        lastSeen: new Date(),
        createdAt: new Date().toISOString()
      };

      memoryUsers.push(newUser);

      const token = jwt.sign(
        { userId: newUser.id }, 
        process.env.JWT_SECRET || 'fallback-secret', 
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully!',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt
        }
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = jwt.sign(
        { userId: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } else {
      const user = memoryUsers.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = jwt.sign(
        { userId: user.id }, 
        process.env.JWT_SECRET || 'fallback-secret', 
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful!',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Profile routes
app.put('/api/auth/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { name, bio, website, location } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (mongoose.connection.readyState === 1) {
      const user = await User.findByIdAndUpdate(
        decoded.userId,
        { name, bio, website, location },
        { new: true }
      ).select('-password');

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user
      });
    } else {
      const userIndex = memoryUsers.findIndex(u => u.id == decoded.userId);
      if (userIndex !== -1) {
        memoryUsers[userIndex] = {
          ...memoryUsers[userIndex],
          name: name || memoryUsers[userIndex].name,
          bio: bio || memoryUsers[userIndex].bio,
          website: website || memoryUsers[userIndex].website,
          location: location || memoryUsers[userIndex].location
        };
        
        res.json({
          success: true,
          message: 'Profile updated successfully (in-memory)',
          user: memoryUsers[userIndex]
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// Posts routes
app.get('/api/posts', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const posts = await Post.find()
        .populate('author', 'name email avatar')
        .populate('comments.author', 'name email avatar')
        .sort({ createdAt: -1 });
      
      res.json({
        success: true,
        posts
      });
    } else {
      const postsWithAuthors = memoryPosts.map(post => ({
        ...post,
        author: memoryUsers.find(u => u.id === post.author)
      }));
      
      res.json({
        success: true,
        posts: postsWithAuthors.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      });
    }
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts'
    });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { content, image } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Post content is required'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const post = await Post.create({
        author: decoded.userId,
        content,
        image
      });

      const populatedPost = await Post.findById(post._id)
        .populate('author', 'name email avatar');

      // Notify friends about new post
      io.emit('new_post', populatedPost);

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        post: populatedPost
      });
    } else {
      const newPost = {
        id: memoryPostId++,
        author: decoded.userId,
        content,
        image,
        likes: [],
        comments: [],
        createdAt: new Date()
      };

      memoryPosts.push(newPost);

      const postWithAuthor = {
        ...newPost,
        author: memoryUsers.find(u => u.id == decoded.userId)
      };

      io.emit('new_post', postWithAuthor);

      res.status(201).json({
        success: true,
        message: 'Post created successfully (in-memory)',
        post: postWithAuthor
      });
    }
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post'
    });
  }
});

app.post('/api/posts/:postId/like', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { postId } = req.params;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (mongoose.connection.readyState === 1) {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const hasLiked = post.likes.includes(decoded.userId);
      
      if (hasLiked) {
        post.likes = post.likes.filter(id => id.toString() !== decoded.userId);
      } else {
        post.likes.push(decoded.userId);
      }

      await post.save();

      res.json({
        success: true,
        message: hasLiked ? 'Post unliked' : 'Post liked',
        likes: post.likes.length
      });
    } else {
      const postIndex = memoryPosts.findIndex(p => p.id == postId);
      if (postIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const hasLiked = memoryPosts[postIndex].likes.includes(decoded.userId);
      
      if (hasLiked) {
        memoryPosts[postIndex].likes = memoryPosts[postIndex].likes.filter(id => id !== decoded.userId);
      } else {
        memoryPosts[postIndex].likes.push(decoded.userId);
      }

      res.json({
        success: true,
        message: hasLiked ? 'Post unliked' : 'Post liked',
        likes: memoryPosts[postIndex].likes.length
      });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking post'
    });
  }
});

app.post('/api/posts/:postId/comment', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { postId } = req.params;
    const { content } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (mongoose.connection.readyState === 1) {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      post.comments.push({
        author: decoded.userId,
        content
      });

      await post.save();

      const updatedPost = await Post.findById(postId)
        .populate('author', 'name email avatar')
        .populate('comments.author', 'name email avatar');

      res.json({
        success: true,
        message: 'Comment added successfully',
        post: updatedPost
      });
    } else {
      const postIndex = memoryPosts.findIndex(p => p.id == postId);
      if (postIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      memoryPosts[postIndex].comments.push({
        author: decoded.userId,
        content,
        createdAt: new Date()
      });

      res.json({
        success: true,
        message: 'Comment added successfully (in-memory)',
        post: memoryPosts[postIndex]
      });
    }
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment'
    });
  }
});

// Friends routes
app.get('/api/users', async (req, res) => {
  try {
    const { search } = req.query;

    if (mongoose.connection.readyState === 1) {
      let users = await User.find().select('name email avatar bio online lastSeen');
      
      if (search) {
        users = users.filter(user => 
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      }

      res.json({
        success: true,
        users
      });
    } else {
      let users = memoryUsers.map(({ password, ...user }) => user);
      
      if (search) {
        users = users.filter(user => 
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      }

      res.json({
        success: true,
        users
      });
    }
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

app.post('/api/friends/request', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { toUserId } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (mongoose.connection.readyState === 1) {
      const fromUser = await User.findById(decoded.userId);
      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if request already exists
      const existingRequest = toUser.friendRequests.find(
        req => req.from.toString() === decoded.userId && req.status === 'pending'
      );

      if (existingRequest) {
        return res.status(400).json({
          success: false,
          message: 'Friend request already sent'
        });
      }

      toUser.friendRequests.push({
        from: decoded.userId,
        status: 'pending'
      });

      await toUser.save();

      // Create notification
      await Notification.create({
        user: toUserId,
        type: 'friend_request',
        fromUser: decoded.userId,
        message: `${fromUser.name} sent you a friend request`
      });

      res.json({
        success: true,
        message: 'Friend request sent successfully'
      });
    } else {
      const fromUser = memoryUsers.find(u => u.id == decoded.userId);
      const toUser = memoryUsers.find(u => u.id == toUserId);

      if (!toUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const existingRequest = toUser.friendRequests.find(
        req => req.from == decoded.userId && req.status === 'pending'
      );

      if (existingRequest) {
        return res.status(400).json({
          success: false,
          message: 'Friend request already sent'
        });
      }

      toUser.friendRequests.push({
        from: decoded.userId,
        status: 'pending',
        createdAt: new Date()
      });

      // Create notification
      memoryNotifications.push({
        id: memoryNotificationId++,
        user: toUserId,
        type: 'friend_request',
        fromUser: decoded.userId,
        message: `${fromUser.name} sent you a friend request`,
        read: false,
        createdAt: new Date()
      });

      res.json({
        success: true,
        message: 'Friend request sent successfully (in-memory)'
      });
    }
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending friend request'
    });
  }
});

app.post('/api/friends/respond', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { requestId, accept } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.userId);
      const requestIndex = user.friendRequests.findIndex(
        req => req._id.toString() === requestId
      );

      if (requestIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Friend request not found'
        });
      }

      const request = user.friendRequests[requestIndex];
      
      if (accept) {
        request.status = 'accepted';
        // Add to friends list
        user.friends.push(request.from);
        
        const fromUser = await User.findById(request.from);
        fromUser.friends.push(decoded.userId);
        await fromUser.save();

        // Create notification
        await Notification.create({
          user: request.from,
          type: 'friend_accepted',
          fromUser: decoded.userId,
          message: `${user.name} accepted your friend request`
        });
      } else {
        request.status = 'rejected';
      }

      await user.save();

      res.json({
        success: true,
        message: accept ? 'Friend request accepted' : 'Friend request rejected'
      });
    } else {
      const user = memoryUsers.find(u => u.id == decoded.userId);
      const requestIndex = user.friendRequests.findIndex(
        req => req.id == requestId
      );

      if (requestIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Friend request not found'
        });
      }

      const request = user.friendRequests[requestIndex];
      
      if (accept) {
        request.status = 'accepted';
        user.friends.push(request.from);
        
        const fromUser = memoryUsers.find(u => u.id == request.from);
        fromUser.friends.push(decoded.userId);

        // Create notification
        memoryNotifications.push({
          id: memoryNotificationId++,
          user: request.from,
          type: 'friend_accepted',
          fromUser: decoded.userId,
          message: `${user.name} accepted your friend request`,
          read: false,
          createdAt: new Date()
        });
      } else {
        request.status = 'rejected';
      }

      res.json({
        success: true,
        message: accept ? 'Friend request accepted' : 'Friend request rejected'
      });
    }
  } catch (error) {
    console.error('Respond to friend request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error responding to friend request'
    });
  }
});

// Messages routes
app.get('/api/messages/:userId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { userId } = req.params;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (mongoose.connection.readyState === 1) {
      const messages = await Message.find({
        $or: [
          { from: decoded.userId, to: userId },
          { from: userId, to: decoded.userId }
        ]
      })
      .populate('from', 'name email avatar')
      .populate('to', 'name email avatar')
      .sort({ createdAt: 1 });

      res.json({
        success: true,
        messages
      });
    } else {
      const messages = memoryMessages.filter(msg =>
        (msg.from.id == decoded.userId && msg.to == userId) ||
        (msg.from.id == userId && msg.to == decoded.userId)
      ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      res.json({
        success: true,
        messages
      });
    }
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
});

// Notifications routes
app.get('/api/notifications', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (mongoose.connection.readyState === 1) {
      const notifications = await Notification.find({ user: decoded.userId })
        .populate('fromUser', 'name email avatar')
        .populate('post')
        .sort({ createdAt: -1 })
        .limit(50);

      res.json({
        success: true,
        notifications
      });
    } else {
      const notifications = memoryNotifications
        .filter(notif => notif.user == decoded.userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 50);

      res.json({
        success: true,
        notifications
      });
    }
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { id } = req.params;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (mongoose.connection.readyState === 1) {
      await Notification.findByIdAndUpdate(id, { read: true });
    } else {
      const notifIndex = memoryNotifications.findIndex(n => n.id == id && n.user == decoded.userId);
      if (notifIndex !== -1) {
        memoryNotifications[notifIndex].read = true;
      }
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read'
    });
  }
});

// MongoDB connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('‚ö†Ô∏è  MONGODB_URI not found - using in-memory storage');
      return;
    }

    console.log('Ì¥ó Attempting MongoDB connection...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log('‚úÖ Connected to MongoDB Atlas');
    await User.createIndexes();
    console.log('‚úÖ Database indexes created');
    
  } catch (error) {
    console.error('‚ùå MongoDB connection failed:', error.message);
    console.log('Ì≤° Using in-memory storage as fallback');
  }
};

// Connect to database
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Ì∫Ä Server is running on port ${PORT}`);
  console.log(`Ì≥ä Health check: https://virelia-tracker.onrender.com/api/health`);
  console.log(`Ì∑ÑÔ∏è  Database: ${mongoose.connection.readyState === 1 ? 'MongoDB Atlas' : 'In-memory (fallback)'}`);
  console.log(`Ì¥ê JWT: ${process.env.JWT_SECRET ? 'Custom secret' : 'Fallback secret'}`);
  console.log(`Ìºç Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`‚è∞ Started at: ${new Date().toISOString()}`);
  console.log(`Ì¥å WebSocket server running on port ${PORT}`);
});
