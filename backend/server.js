import app from './app.js';
import { connectDB } from './config/database.js';
import { initializeSocket } from './socket/socketHandler.js';
import { logger } from './middleware/logger.js';

const PORT = process.env.PORT || 5000;

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
// Database Connection
import connectDB from './config/database.js';
connectDB();

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
