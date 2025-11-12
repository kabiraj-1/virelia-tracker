import express from 'express';
import cors from 'cors';
import app from './app.js';
import { connectDB } from './config/database.js';
import { initializeSocket } from './socket/socketHandler.js';
import { logger } from './middleware/logger.js';

const PORT = process.env.PORT || 5000;

// CORS MUST BE AT THE TOP - before any routes
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

// Connect to Database
connectDB();

// Start Server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
});

// Initialize Socket.io
initializeSocket(server);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});