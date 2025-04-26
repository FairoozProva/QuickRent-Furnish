import mongoose from 'mongoose';
import { User, Category, Product, Rental, Wishlist, Cart } from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

/**
 * This script is specifically for checking a local MongoDB connection with MongoDB Compass.
 * It only checks the local connection regardless of environment variables.
 * 
 * Run with: npx tsx scripts/check-mongodb-compass.ts
 */
async function checkMongoDBCompassConnection() {
  console.log('MongoDB Compass Connection Check');
  console.log('================================');
  
  // Always use the local connection string for Compass
  const connectionString = 'mongodb://localhost:27017/quickrent_furnish';
  
  try {
    console.log(`Attempting to connect to MongoDB Compass: ${connectionString}`);
    
    await mongoose.connect(connectionString);
    console.log('✅ MongoDB Compass connected successfully');
    
    // Check for collections and document counts
    console.log('\nChecking collections:');
    const collections = [
      { model: User, name: 'users' },
      { model: Category, name: 'categories' },
      { model: Product, name: 'products' },
      { model: Rental, name: 'rentals' },
      { model: Wishlist, name: 'wishlists' },
      { model: Cart, name: 'carts' }
    ];
    
    for (const collection of collections) {
      const count = await collection.model.countDocuments();
      console.log(`- ${collection.name}: ${count} documents`);
    }
    
    // Output connection and database information
    console.log('\nDatabase details:');
    if (mongoose.connection.db) {
      console.log(`- Database name: ${mongoose.connection.db.databaseName}`);
    }
    console.log(`- Connection state: ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}`);
    
    console.log('\nMongoDB Compass setup steps:');
    console.log('1. Install MongoDB Compass from https://www.mongodb.com/products/compass');
    console.log('2. Launch MongoDB Compass and connect to mongodb://localhost:27017/');
    console.log('3. In MongoDB Compass, click on "Databases" and then "+ Create Database"');
    console.log('4. Enter "quickrent_furnish" as the database name and "users" as the collection name');
    console.log('5. Run the seed script: npx tsx scripts/seed-mongodb.ts');
    console.log('6. Refresh MongoDB Compass to see the newly created collections and documents');
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Compass');
    console.error(error);
    
    console.log('\nTroubleshooting steps:');
    console.log('1. Ensure MongoDB is installed and running locally:');
    console.log('   - On Windows, check MongoDB service in Services management console');
    console.log('   - On macOS/Linux, check with: ps aux | grep mongod');
    console.log('2. Try starting MongoDB manually:');
    console.log('   - mongod --dbpath=/path/to/data/directory');
    console.log('3. If MongoDB Compass is installed but the database is not created:');
    console.log('   - Open MongoDB Compass');
    console.log('   - Connect to mongodb://localhost:27017/');
    console.log('   - Create the "quickrent_furnish" database manually');
    console.log('4. Other potential issues:');
    console.log('   - Port 27017 is blocked by another application or firewall');
    console.log('   - MongoDB is not installed correctly');
    
  } finally {
    await mongoose.disconnect();
    console.log('\nConnection check complete');
  }
}

checkMongoDBCompassConnection().catch(console.error);