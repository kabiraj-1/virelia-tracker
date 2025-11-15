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

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.log('í´¶ Running in demo mode - no database connection');
      return;
    }

    console.log('í´— Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`âœ… MongoDB Connected: ${conn.connection.host}`);
    console.log(`í³Š Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error('âŒ MongoDB Connection Error:', error.message);
    console.log('í²¡ Tip: Whitelist your IP in MongoDB Atlas or use demo mode');
    console.log('í´¶ Continuing in demo mode without database');
    return false;
  }
};

// Start server
const PORT = process.env.PORT || 5002;

const startServer = async () => {
  // Try to connect to DB, but continue even if it fails
  const dbConnected = await connectDB();
  
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`íº€ Server running on port ${PORT}`);
    console.log(`í¼ Environment: ${process.env.NODE_ENV}`);
    console.log(`í¿  Local URL: http://localhost:${PORT}`);
    console.log(`â¤ï¸ Health check: http://localhost:${PORT}/api/health`);
    
    if (!dbConnected) {
      console.log('í´¶ Running in demo mode - data will not persist');
      console.log('í³ To enable database, whitelist your IP in MongoDB Atlas');
    } else {
      console.log('âœ… Database connected - data will persist');
    }
  });
};

// Don't let MongoDB errors crash the app
process.on('unhandledRejection', (err, promise) => {
  console.log('í´¶ Unhandled Promise Rejection:', err.message);
  console.log('í²¡ Application continues running in demo mode');
});

process.on('uncaughtException', (err) => {
  console.log('í´¶ Uncaught Exception:', err.message);
  console.log('í²¡ Application continues running in demo mode');
});

startServer();

module.exports = app;
