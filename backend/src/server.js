import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS - allow frontend domains
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://virelia-tracker-frontend.vercel.app',
    'https://kabirajbhatt.com.np'
  ],
  credentials: true
}));

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Virelia Tracker Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// API routes
app.use('/api/auth', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'íº€ Virelia Tracker Backend API',
    version: '2.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      docs: 'Coming soon...'
    }
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'API endpoint not found'
  });
});

// All other routes - return simple message
app.use('*', (req, res) => {
  res.json({
    message: 'Virelia Tracker Backend API',
    note: 'Frontend is served separately from Vercel',
    frontend: 'https://virelia-tracker-frontend.vercel.app'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    console.log('í´— Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('âœ… MongoDB Connected Successfully');
    return true;
  } catch (error) {
    console.error('âŒ MongoDB Connection Error:', error.message);
    return false;
  }
};

// Start server
const startServer = async () => {
  console.log('íº€ Starting Virelia Tracker Backend...');
  
  await connectDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`í¾¯ Backend API running on port ${PORT}`);
    console.log(`ï¿½ï¿½ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`í´ JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
    console.log(`í³Š MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log(`í¾¨ Frontend: https://virelia-tracker-frontend.vercel.app`);
  });
};

// Error handlers
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! í²¥', err);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! í²¥', err);
});

startServer();
