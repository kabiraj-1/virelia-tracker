import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// CORS configuration with preflight support
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Handle preflight requests explicitly
app.options('*', cors());

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
  // Add CORS headers manually for extra safety
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
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

// Catch all handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

export default app;
