import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log('Ì¥ó Attempting to connect to MongoDB Atlas...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Add connection timeout and error handling
    const options = {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 10000, // 10 seconds socket timeout
    };

    console.log('‚è≥ Connecting to MongoDB (5s timeout)...');
    
    // Set a timeout for the connection
    const connectionPromise = mongoose.connect(process.env.MONGODB_URI, options);
    
    // Add a timeout to the connection attempt
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('MongoDB connection timeout')), 8000);
    });

    const conn = await Promise.race([connectionPromise, timeoutPromise]);
    
    console.log(`‚úÖ MongoDB Connected: ${conn.connection.host}`);
    console.log(`Ì≥ä Database: ${conn.connection.name}`);
    console.log('ÌæØ Database connection successful!');
    
  } catch (error) {
    console.error('‚ùå Database connection failed:', error.message);
    console.log('‚ö†Ô∏è  Continuing without database connection...');
    // Don't exit process, let server start without DB
  }
};

mongoose.connection.on('connected', () => {
  console.log('Ì¥ó Mongoose connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.log('Ì¥å MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('‚ùå MongoDB connection error:', err);
});
