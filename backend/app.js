
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
// app.js मा
import express from 'express';
import cors from 'cors';

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
import authRoutes from './routes/authRoutes.js';
app.use(express.json());
app.use('/api/auth', authRoutes);