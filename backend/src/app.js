import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Allow ALL origins for production
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'íº€ Virelia Tracker Backend is running!',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'âœ… Server is healthy',
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

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

export default app;
