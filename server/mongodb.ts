import dotenv from 'dotenv';

dotenv.config();

// Check if running in Replit environment
const isReplitEnv = process.env.REPLIT_DB_URL ? true : false;

// Types for our MongoDB connection
type MongooseConnection = {
  db: { 
    databaseName: string;
    collections: () => Promise<any[]>;
    collection: (name: string) => any;
  };
  on: (event: string, callback: Function) => any;
  once: (event: string, callback: Function) => any;
};

type MockModel = {
  find: (query?: any) => Promise<any[]>;
  findOne: (query?: any) => Promise<any | null>;
  findById: (id: string) => Promise<any | null>;
  create: (data: any) => Promise<any>;
  deleteOne: (query: any) => Promise<{ deletedCount: number }>;
  updateOne: (query: any, update: any) => Promise<{ modifiedCount: number }>;
};

// Create a mock mongoose for Replit
const mockMongoose = {
  connect: () => Promise.resolve(mockMongoose),
  disconnect: () => Promise.resolve(),
  connection: {
    db: { 
      databaseName: 'mock_db',
      collections: () => Promise.resolve([]),
      collection: () => ({})
    },
    on: function() { return this; },
    once: function() { return this; },
  },
  Schema: function() { 
    return { 
      index: () => ({}),
      pre: () => ({}),
      virtual: () => ({}),
    }; 
  },
  model: function(): MockModel { 
    return {
      find: () => Promise.resolve([]),
      findOne: () => Promise.resolve(null),
      findById: () => Promise.resolve(null),
      create: (data: any) => Promise.resolve(data),
      deleteOne: () => Promise.resolve({ deletedCount: 0 }),
      updateOne: () => Promise.resolve({ modifiedCount: 0 }),
    };
  },
  createConnection: () => ({
    model: () => ({
      find: () => Promise.resolve([]),
      findOne: () => Promise.resolve(null),
      findById: () => Promise.resolve(null),
      create: (data: any) => Promise.resolve(data),
      deleteOne: () => Promise.resolve({ deletedCount: 0 }),
      updateOne: () => Promise.resolve({ modifiedCount: 0 }),
    }),
    on: function() { return this; },
    once: function() { return this; },
  }),
};

// Re-export our mock mongoose when in Replit
export const mongoose = isReplitEnv ? mockMongoose : null;

// Get MongoDB connection string (even though we won't use it in Replit)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickrent_furnish';
const connectionSource = isReplitEnv ? 'Replit Environment' : 'Local MongoDB';

// Debug the connection string (hide username/password)
const debugUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
console.log(`Using MongoDB connection: ${debugUri}`);
console.log(`Connection source: ${connectionSource}`);

// Connect to MongoDB (or return mock in Replit)
export async function connectToDatabase(): Promise<any> {
  // For Replit environment, return a mock connection
  if (isReplitEnv) {
    console.log('Running in Replit environment - using in-memory storage instead of MongoDB');
    
    // Set up mock schemas
    try {
      await import('./mock-schema');
      console.log('✅ Mock MongoDB setup complete for Replit environment');
    } catch (error) {
      console.warn('⚠️ Warning: Failed to load mock schemas for Replit environment:', error);
      console.error(error);
    }
    
    return Promise.resolve({ db: { databaseName: 'mock_db' } });
  }

  // We shouldn't reach here in Replit, but keep the code for VSCode environment
  try {
    console.log('Attempting to connect to MongoDB...');
    // We'll need to import the real mongoose dynamically
    const { default: realMongoose } = await import('mongoose');
    
    // Connect using real mongoose
    await realMongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      appName: 'QuickRent Furnish',
      autoCreate: true,
      autoIndex: true,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000
    });
    
    console.log('✅ Connected to MongoDB');
    return realMongoose.connection;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Disconnect from MongoDB
export async function disconnectFromDatabase(): Promise<void> {
  // For Replit environment, skip disconnection
  if (isReplitEnv) {
    console.log('Mock disconnection from MongoDB in Replit environment');
    return;
  }
  
  try {
    const { default: realMongoose } = await import('mongoose');
    await realMongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Failed to disconnect from MongoDB:', error);
    throw error;
  }
}