import app from './app.js';
import { connectDB } from './config/database.js';

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Start Server
const server = app.listen(PORT, () => {
  console.log(`íº€ Server running on port ${PORT}`);
  console.log(`í³Š Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
