const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.io configuration for production
const io = socketIo(server, {
  cors: {
    origin: [
      "https://virelia-tracker-frontend-oipev2u8i-kabiraj-1s-projects.vercel.app",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: [
    "https://virelia-tracker-frontend-oipev2u8i-kabiraj-1s-projects.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Virelia Tracker API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    version: '2.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Virelia Tracker Backend API',
    documentation: 'https://github.com/Kabiraj1s/virelia-tracker',
    health: '/api/health',
    status: 'operational'
  });
});

// Socket.io
require('./socket/socketHandlers')(io);

// MongoDB Connection (without deprecated options)
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.warn('‚ö†Ô∏è  MONGODB_URI not found in environment variables');
      console.log('Ì≤° Using in-memory storage (data will reset on server restart)');
      return;
    }

    console.log('Ì¥ó Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`‚úÖ MongoDB Connected: ${conn.connection.host}`);
    console.log(`Ì≥ä Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('‚ùå MongoDB Connection Error:', error.message);
    
    // In production, we want the server to fail if DB connection fails
    if (process.env.NODE_ENV === 'production') {
      console.log('Ìªë Production: Exiting due to database connection failure');
      process.exit(1);
    }
    
    console.log('Ì≤° Development: Continuing without database');
  }
};

// Start server
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();
  
  server.listen(PORT, () => {
    console.log(`Ì∫Ä Server running on port ${PORT}`);
    console.log(`Ìºê Environment: ${process.env.NODE_ENV}`);
    console.log(`Ì≥ä MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log(`Ì¥ó Health check: http://localhost:${PORT}/api/health`);
    
    if (mongoose.connection.readyState !== 1) {
      console.log('Ì¥∂ Running in demo mode - data will not persist');
    }
  });
};

startServer();

module.exports = app;
