import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy for Render deployment
app.set('trust proxy', 1);

// Rate limiting with proxy fix
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
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
app.use(express.json());

// User Schema
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
}, {
  timestamps: true,
});

// Create User model
const User = mongoose.model('User', userSchema);

// In-memory storage fallback
let memoryUsers = [];
let memoryUserId = 1;

// Routes
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const storageType = dbStatus === 'connected' ? 'MongoDB' : 'In-memory';
  
  res.json({
    message: 'Welcome to Virelia Tracker Backend API',
    status: 'operational',
    database: dbStatus,
    storage: storageType,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
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

    // Use MongoDB if connected, otherwise use in-memory
    if (mongoose.connection.readyState === 1) {
      console.log('í³ Attempting MongoDB registration for:', email);
      
      // MongoDB registration
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

      console.log('âœ… MongoDB registration successful for:', email);
      
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
      console.log('í³ Using in-memory registration for:', email);
      
      // In-memory registration
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
        createdAt: new Date().toISOString()
      };

      memoryUsers.push(newUser);

      const token = jwt.sign(
        { userId: newUser.id }, 
        process.env.JWT_SECRET || 'fallback-secret', 
        { expiresIn: '7d' }
      );

      console.log('âœ… In-memory registration successful for:', email);
      
      res.status(201).json({
        success: false, // Mark as false to indicate fallback
        message: 'Registration successful (using temporary storage - MongoDB not connected)',
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
    console.error('âŒ Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // If MongoDB fails, fallback to in-memory
    console.log('í´„ Falling back to in-memory registration due to MongoDB error');
    
    try {
      const { name, email, password } = req.body;
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
        createdAt: new Date().toISOString()
      };

      memoryUsers.push(newUser);

      const token = jwt.sign(
        { userId: newUser.id }, 
        process.env.JWT_SECRET || 'fallback-secret', 
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: false,
        message: 'Registration successful (fallback mode - MongoDB unavailable)',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt
        }
      });
    } catch (fallbackError) {
      res.status(500).json({
        success: false,
        message: 'Server error during registration'
      });
    }
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Try MongoDB first
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
      // Fallback to in-memory
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
        success: false,
        message: 'Login successful (temporary storage - MongoDB unavailable)',
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
    
    // Fallback to in-memory on error
    try {
      const { email, password } = req.body;
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
        success: false,
        message: 'Login successful (fallback mode)',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (fallbackError) {
      res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }
  }
});

// MongoDB connection with better error handling and timeout
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('âš ï¸  MONGODB_URI not found - using in-memory storage');
      return;
    }

    console.log('í´— Attempting MongoDB connection...');
    
    // Increased timeout and better connection options
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    
    console.log('âœ… Connected to MongoDB Atlas');
    await User.createIndexes();
    console.log('âœ… Database indexes created');
    
  } catch (error) {
    console.error('âŒ MongoDB connection failed:', error.message);
    console.log('ï¿½ï¿½ Using in-memory storage as fallback');
    console.log('í´§ To fix: Whitelist Render IP in MongoDB Atlas Network Access');
    console.log('   - Go to MongoDB Atlas â†’ Network Access â†’ Add IP Address');
    console.log('   - Add 0.0.0.0/0 to allow all IPs (or specific Render IP ranges)');
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
app.listen(PORT, () => {
  console.log(`íº€ Server is running on port ${PORT}`);
  console.log(`í³Š Health check: https://virelia-tracker.onrender.com/api/health`);
  console.log(`í·„ï¸  Database: ${mongoose.connection.readyState === 1 ? 'MongoDB Atlas' : 'In-memory (fallback)'}`);
  console.log(`í´ JWT: ${process.env.JWT_SECRET ? 'Custom secret' : 'Fallback secret'}`);
  console.log(`í¼ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`â° Started at: ${new Date().toISOString()}`);
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
      // Update in MongoDB
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
      // Update in memory
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
