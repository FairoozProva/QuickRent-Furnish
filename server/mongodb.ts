import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Skip MongoDB connection for now
console.log('Using in-memory storage, MongoDB connection disabled');

// Placeholder for MongoDB URI (not actually used)
const MONGODB_URI = 'mongodb://localhost:27017/quickrent';

// MongoDB Atlas configuration options
const mongooseConfig = {
  // Connection timeouts and settings
  serverSelectionTimeoutMS: 30000, // 30 seconds
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  
  // Application name for monitoring
  appName: 'CreativeCanvas',
  
  // Auto create indexes and collections
  autoCreate: true,
  autoIndex: true,
  
  // Optimize for resilience
  family: 4,               // Use IPv4
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 60000,    // Close idle connections after 60 seconds
};

// Track if we've already attempted to connect
let isConnecting = false;
let connectionEstablished = false;

// Mock connect to database - do not actually connect
export async function connectToDatabase() {
  console.log('Using in-memory storage instead of MongoDB');
  return mongoose.connection;
}

// Disconnect from MongoDB
export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('Failed to disconnect from MongoDB Atlas:', error);
    throw error;
  }
}

// Export mongoose
export { mongoose };