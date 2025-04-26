// This file provides mock implementations for MongoDB in Replit environment
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Using mock MongoDB implementation for Replit environment');

// Setup fake connection and models
class MockConnection {
  db = {
    databaseName: 'mock_db',
    collections: () => Promise.resolve([])
  };
}

// Create a fake mongoose connection that won't actually try to connect
mongoose.connection = new MockConnection() as any;

// Mock the connect method to avoid actual connection attempts
mongoose.connect = async () => {
  console.log('Mock MongoDB connection successful (no actual connection made)');
  return mongoose.connection;
};

// Mock the disconnect method
mongoose.disconnect = async () => {
  console.log('Mock MongoDB disconnection successful');
  return;
};

// Export connect/disconnect functions that don't actually try to connect
export async function connectToDatabase() {
  console.log('Using mock MongoDB implementation - no actual connection will be made');
  return mongoose.connection;
}

export async function disconnectFromDatabase() {
  console.log('Mock disconnection from MongoDB');
  return;
}

// Export the Mongoose instance
export { mongoose };