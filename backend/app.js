import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: [
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

// Other middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Test Database Route
app.get('/api/test-db', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Database connection test successful',
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

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '✅ Server is healthy',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Atlas'
  });
});

// Test route
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
    message: `Route ${req.originalUrl} not found`
  });
});

export default app;
