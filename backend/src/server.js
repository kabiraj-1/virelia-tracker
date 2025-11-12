import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - ALL DOMAINS ADD गर्नुहोस्
app.use(cors({
  origin: [
    'https://virelia-tracker-frontend-5zn5ccucn-kabiraj-1s-projects.vercel.app', // NEW DEPLOYMENT
    'https://www.kabirajbhatt.com.np',
    'https://kabirajbhatt.com.np',
    'https://virelia-tracker-frontend-2frcwk7h8-kabiraj-1s-projects.vercel.app',
    'https://virelia-tracker-frontend-mj8i5zvl7-kabiraj-1s-projects.vercel.app',
    'https://virelia-tracker-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware
app.use(express.json());

// Connect to Database
connectDB();

// ==================== AUTH ROUTES ====================
app.get('/api/auth/health', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes are working!',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('Registration attempt:', { name, email });

    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Temporary success response (no database)
    res.status(201).json({
      success: true,
      message: 'User registered successfully! (Demo Mode)',
      data: {
        user: {
          id: 'demo-' + Date.now(),
          name: name,
          email: email,
          karmaPoints: 100
        },
        token: 'demo-jwt-token-' + Date.now()
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Temporary success response (no database)
    res.json({
      success: true,
      message: 'Login successful! (Demo Mode)',
      data: {
        user: {
          id: 'demo-user-id',
          name: 'Demo User',
          email: email,
          karmaPoints: 150
        },
        token: 'demo-jwt-token-' + Date.now()
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// EXISTING ROUTES
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Atlas'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is working!',
    data: {
      server: 'Express.js',
      status: 'running',
      database: 'MongoDB Atlas',
      features: ['User Authentication', 'Event Tracking', 'Karma System'],
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found: ' + req.originalUrl
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  console.log('Environment: ' + process.env.NODE_ENV);
  console.log('CORS enabled for multiple domains including new deployment');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
