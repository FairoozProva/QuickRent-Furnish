import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Get MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://QuickRent-Furnish:TukiMeow18%26@cluster0.xtppfyc.mongodb.net/QuickRent-Furnish?retryWrites=true&w=majority&appName=Cluster0';

// Debug the connection string (hide username/password)
const debugUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
console.log(`Using MongoDB Atlas connection: ${debugUri}`);

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

// Connect to MongoDB Atlas
export async function connectToDatabase() {
  // If already connecting or connected, don't try again
  if (isConnecting) {
    console.log('MongoDB Atlas connection already in progress...');
    // Wait for existing connection attempt to finish
    while (isConnecting && !connectionEstablished) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return mongoose.connection;
  }
  
  // If already connected, return the connection
  if (mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB Atlas connection');
    connectionEstablished = true;
    return mongoose.connection;
  }
  
  isConnecting = true;
  
  try {
    console.log('Connecting to MongoDB Atlas...');
    
    // Close any existing connection first
    if (mongoose.connection.readyState !== 0) {
      console.log('Closing existing connection before reconnecting...');
      await mongoose.disconnect();
    }
    
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_URI, mongooseConfig);
    
    // Connection successful
    console.log('✅ Connected to MongoDB Atlas');
    connectionEstablished = true;
    
    // Output database information
    if (mongoose.connection.db) {
      console.log(`Database name: ${mongoose.connection.db.databaseName}`);
    }
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Atlas:', error);
    throw new Error('Unable to connect to MongoDB Atlas. Please check your connection string and network.');
  } finally {
    isConnecting = false;
  }
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