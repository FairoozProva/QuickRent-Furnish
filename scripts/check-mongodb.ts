import mongoose from 'mongoose';
import { User, Category, Product, Rental, Wishlist, Cart } from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

async function checkMongoDBConnection() {
  console.log('MongoDB Connection Check');
  console.log('=======================');
  
  const connectionString = 'mongodb://localhost:27017/quickrent_furnish';
  console.log('Using local MongoDB connection for VSCode compatibility');
  
  try {
    console.log(`Attempting to connect to MongoDB: ${connectionString.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`);
    
    await mongoose.connect(connectionString);
    console.log(' MongoDB connected successfully');
    
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
    
    console.log('\nMongoDB setup information for VSCode:');
    console.log('1. To create a new local database:');
    console.log('   - Install MongoDB Community Edition: https://www.mongodb.com/try/download/community');
    console.log('   - Install MongoDB Compass: https://www.mongodb.com/products/compass');
    console.log('   - Start your local MongoDB server');
    console.log('   - Connect to mongodb://localhost:27017/ in MongoDB Compass');
    console.log('   - Create a new database named "quickrent_furnish"');
    console.log('   - Populate with sample data using: npx tsx scripts/seed-mongodb.ts');
    
  } catch (error) {
    console.error(' Failed to connect to MongoDB');
    console.error(error);
    
    console.log('\nTroubleshooting steps for VSCode:');
    console.log('1. Ensure MongoDB server is installed and running:');
    console.log('   - Windows: Check MongoDB service in Services management console');
    console.log('   - macOS: Check using `brew services list` command');
    console.log('   - Linux: Check using `systemctl status mongod` command');
    console.log('2. Verify MongoDB Compass connection:');
    console.log('   - Open MongoDB Compass');
    console.log('   - Connect to mongodb://localhost:27017/');
    console.log('   - If connection fails, check your firewall settings');
    console.log('3. Create database manually if needed:');
    console.log('   - In MongoDB Compass, click "+ Create Database"');
    console.log('   - Database Name: quickrent_furnish');
    console.log('   - Collection Name: users');
    console.log('4. Run the seed script after database creation:');
    console.log('   - npx tsx scripts/seed-mongodb.ts');
  } finally {
    await mongoose.disconnect();
    console.log('\nConnection check complete');
  }
}

checkMongoDBConnection().catch(console.error);
