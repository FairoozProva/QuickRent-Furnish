/**
 * This file provides a factory function to get the appropriate mongoose implementation
 * based on the current environment.
 */

// Check if running in Replit environment
const isReplitEnv = process.env.REPLIT_DB_URL ? true : false;

// Dynamically import the right mongoose implementation
async function getMongoose() {
  if (isReplitEnv) {
    console.log('🔧 Using mocked mongoose implementation for Replit environment');
    const { default: mockedMongoose } = await import('./mock-mongoose');
    return mockedMongoose;
  } else {
    console.log('🔧 Using real mongoose implementation');
    const mongoose = await import('mongoose');
    return mongoose.default;
  }
}

// Export the factory function
export { getMongoose, isReplitEnv };