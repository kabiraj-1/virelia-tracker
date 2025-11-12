import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('MONGODB_URI not set, running without database');
      return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.log('MongoDB connection failed, running without database');
  }
};
