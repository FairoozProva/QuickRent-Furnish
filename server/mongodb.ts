import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Using in-memory storage, MongoDB connection disabled');

// Placeholder for MongoDB URI 
const MONGODB_URI = 'mongodb://localhost:27017/quickrent';

// MongoDB Atlas configuration options
const mongooseConfig = {
  serverSelectionTimeoutMS: 30000, 
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  appName: 'CreativeCanvas',
  autoCreate: true,
  autoIndex: true,
  family: 4,               // Use IPv4
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 60000,    
};

// Track if we've already attempted to connect
let isConnecting = false;
let connectionEstablished = false;

//Mock connection
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
