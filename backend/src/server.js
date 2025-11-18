require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const app = express();

// Security Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});
app.use(limiter);

// CORS Configuration
app.use(cors({
  origin: [
    'https://virelia-tracker-frontend.vercel.app',
    'https://virelia-tracker-frontend-git-main-kabiraj-1s-projects.vercel.app',
    'https://kabirajbhatt.com.np',
    'http://localhost:3000'
  ],
  credentials: true
}));

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with Retry Logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('ÌæØ MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Premium Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Ì∫Ä Virelia Tracker API is running perfectly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '2.0.0'
  });
});

// Premium 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ì¥ç Route not found',
    suggested: 'Check API documentation at /api/docs'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Ì∫® Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n
  Ì∫Ä VIRELIA TRACKER SERVER STARTED
  Ì≥ç Port: ${PORT}
  Ìºê Environment: ${process.env.NODE_ENV}
  Ì∑ÑÔ∏è Database: ${mongoose.connection.readyState === 1 ? 'Connected ‚úÖ' : 'Disconnected ‚ùå'}
  ‚è∞ Started: ${new Date().toLocaleString()}
  \n`);
});

module.exports = app;
