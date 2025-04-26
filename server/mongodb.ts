import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Check if running in Replit environment
const isReplitEnv = process.env.REPLIT_DB_URL ? true : false;

// MONKEY PATCH FOR REPLIT ENVIRONMENT
// This completely bypasses MongoDB connections in Replit
if (isReplitEnv) {
  console.log('🐒 Monkey-patching mongoose for Replit environment');
  
  // Create mock connection object
  const mockConnection = {
    db: { 
      databaseName: 'mock_db',
      collections: () => Promise.resolve([]),
      collection: () => ({})
    },
    on: function() { return this; },
    once: function() { return this; },
    model: function() { return {}; }
  };
  
  // Override connect method with mock implementation that returns immediately
  const originalConnect = mongoose.connect;
  mongoose.connect = async function() {
    console.log('⚠️ Mongoose connect bypassed in Replit environment');
    return Promise.resolve(mongoose as any);
  };
  
  // @ts-ignore - Override mongoose.connection with mock
  mongoose.connection = mockConnection;
  
  // Override createConnection to return our mock
  // @ts-ignore
  mongoose.createConnection = function() {
    console.log('⚠️ Mongoose createConnection bypassed in Replit environment');
    return mockConnection;
  };
  
  // Override Mongoose's internal MongoClient to prevent any attempt to connect
  try {
    // @ts-ignore - Attempt to patch MongoClient if possible
    mongoose.MongoClient = {
      connect: () => Promise.resolve({ db: () => mockConnection.db })
    };
  } catch (err) {
    console.warn('⚠️ Could not fully patch MongoClient');
  }
}

// Get MongoDB connection string
const MONGODB_URI = isReplitEnv 
  ? process.env.MONGODB_URI || 'mongodb://localhost:27017/quickrent_furnish'
  : 'mongodb://localhost:27017/quickrent_furnish';

const connectionSource = isReplitEnv ? 'Replit Environment' : 'Local MongoDB';

// MongoDB configuration options for VSCode compatibility
const mongooseConfig: mongoose.ConnectOptions = {
  // Set reasonable timeouts for local development
  serverSelectionTimeoutMS: 2000, // 2 seconds - faster timeout for local connections
  connectTimeoutMS: 5000,         // 5 seconds
  socketTimeoutMS: 30000,         // 30 seconds
  
  // Application name for monitoring
  appName: 'QuickRent Furnish',
  
  // Auto create indexes and collections
  autoCreate: true,
  autoIndex: true,
  
  // The following options are specifically for VSCode compatibility
  // They ensure the connection works well in a local development environment
  family: 4,               // Use IPv4, avoiding IPv6 issues
  maxPoolSize: 10,         // Limit number of connections for dev
  minPoolSize: 1,          // Ensure we have at least one connection
  maxIdleTimeMS: 30000     // Close idle connections after 30 seconds
};

// Debug the connection string (hide username/password)
const debugUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
console.log(`Using MongoDB connection: ${debugUri}`);
console.log(`Connection source: ${connectionSource}`);

// Connect to MongoDB
export async function connectToDatabase() {
  // For Replit environment, return a mock connection that doesn't actually connect
  if (isReplitEnv) {
    console.log('Running in Replit environment - using in-memory storage instead of MongoDB');
    
    // Set up mock schemas without actual connection
    try {
      // In Replit environment, monkey-patch the mongoose module to avoid actual connection
      // Replace the models in shared/schema with mock models from mock-schema
      // For ES modules, we dynamically import instead of using require
      await import('./mock-schema');
      console.log('✅ Mock MongoDB setup complete for Replit environment');
    } catch (error) {
      console.warn('⚠️ Warning: Failed to load mock schemas for Replit environment:', error);
      console.error(error);
    }
    
    return Promise.resolve({ db: { databaseName: 'mock_db' } });
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, mongooseConfig);
    
    // Connection successful
    console.log('✅ Connected to MongoDB');
    
    // Output database information
    if (mongoose.connection.db) {
      console.log(`Database name: ${mongoose.connection.db.databaseName}`);
    }
    
    // Check for existing collections
    const collections = await mongoose.connection.db?.collections();
    if (collections && collections.length > 0) {
      console.log(`Found ${collections.length} collections`);
    } else {
      console.log('No collections found - database may be empty');
      console.log('Run the seed script to populate the database: npx tsx scripts/seed-mongodb.ts');
    }
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    
    // Provide clear troubleshooting information for VSCode development
    console.error('\nTroubleshooting local MongoDB connection:');
    console.error('1. Ensure MongoDB is installed and running locally');
    console.error('   - Windows: Check MongoDB service in Services management console');
    console.error('   - macOS: Check with brew services list');
    console.error('   - Linux: Check with systemctl status mongod');
    console.error('2. Verify connection in MongoDB Compass:');
    console.error('   - Connect to mongodb://localhost:27017/');
    console.error('   - Create the "quickrent_furnish" database if it doesn\'t exist');
    console.error('3. Populate database with seed data:');
    console.error('   - Run: npx tsx scripts/seed-mongodb.ts');
    
    throw error;
  }
}

// Disconnect from MongoDB
export async function disconnectFromDatabase() {
  // For Replit environment, skip disconnection
  if (isReplitEnv) {
    console.log('Mock disconnection from MongoDB in Replit environment');
    return;
  }
  
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Failed to disconnect from MongoDB:', error);
    throw error;
  }
}

// Export the Mongoose instance
export { mongoose };
