import dotenv from 'dotenv';
// Load env vars first - this must be at the top
dotenv.config();

import app from './app.js';
import { connectDB } from '../config/database.js';
import { initializeSocket } from './socket/socketHandler.js';
import { logger } from './middleware/logger.js';

const PORT = process.env.PORT || 5000;

console.log('í´§ Starting server with configuration:');
console.log('   Port:', PORT);
console.log('   Node Env:', process.env.NODE_ENV || 'development');

// Connect to Database (but don't block server startup)
connectDB().catch(err => {
  console.log('âš ï¸  Server starting without database connection');
});

// Start Server
const server = app.listen(PORT, () => {
  logger.info(`íº€ Server running on port ${PORT}`);
  logger.info(`í³Š Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`âœ… Server is now accessible at: http://localhost:${PORT}`);
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
