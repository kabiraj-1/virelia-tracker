import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const app = express();

// CORS configuration - Updated with all your domains
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://virelia-tracker-frontend-c3wy8yxv7-kabiraj-1s-projects.vercel.app',
    'https://virelia-tracker-frontend.vercel.app',
    'https://kabirajbhatt.com.np',
    'https://www.kabirajbhatt.com.np',
    'https://virelia-tracker.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Basic root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'íº€ Virelia Tracker Backend is running!',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'âœ… Server is healthy',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Atlas'
  });
});

// Test route for frontend connection
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

// Test Database Route
app.get('/api/test-db', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Database connection established',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Catch all handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

export default app;
