import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Routes
import authRoutes from './routes/authRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import socialRoutes from './routes/socialRoutes.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/social', socialRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Virelia Tracker API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('âœ… MongoDB Connected'))
  .catch(err => {
    console.error('âŒ MongoDB connection error:', err);
    process.exit(1);
  });

// Create uploads directory if it doesn't exist
import fs from 'fs';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`íº€ Server running on port ${PORT}`);
  console.log(`í´— Health check: http://localhost:${PORT}/api/health`);
});
