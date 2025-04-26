/**
 * MongoDB Seed Script for QuickRent Furnish
 * 
 * This script populates the MongoDB database with initial data.
 * Run with: npx tsx scripts/seed-mongodb.ts
 */

import mongoose from 'mongoose';
import { User, Category, Product } from '../shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/quickrent_furnish';

/**
 * Hashes a password using scrypt with a salt
 * @param password The password to hash
 * @returns A string in the format "hash.salt"
 */
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

/**
 * Seeds the MongoDB database with initial data
 */
async function seedDatabase() {
  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await hashPassword('admin123');
    const admin = new User({
      username: 'admin',
      password: adminPassword,
      name: 'Admin User',
      email: 'admin@example.com',
      createdAt: new Date()
    });
    await admin.save();

    // Create categories
    console.log('Creating categories...');
    const livingRoom = new Category({
      name: 'Living Room',
      slug: 'living-room',
      description: 'Comfortable and stylish furniture for your living room',
      imageUrl: '/src/assets/Sofa Set 5.jpeg',
      displayOrder: 1,
      active: true
    });
    await livingRoom.save();

    const diningRoom = new Category({
      name: 'Dining',
      slug: 'dining',
      description: 'Elegant dining furniture for family meals',
      imageUrl: '/src/assets/Dining Table.jpeg',
      displayOrder: 2,
      active: true
    });
    await diningRoom.save();

    const bedroom = new Category({
      name: 'Bedroom',
      slug: 'bedroom',
      description: 'Relaxing bedroom furniture for a good night sleep',
      imageUrl: '/src/assets/Bed 4.jpeg',
      displayOrder: 3,
      active: true
    });
    await bedroom.save();

    const office = new Category({
      name: 'Office',
      slug: 'office',
      description: 'Professional furniture for home office setup',
      imageUrl: '/src/assets/Office Room Setup.jpeg',
      displayOrder: 4,
      active: true
    });
    await office.save();

    const kitchen = new Category({
      name: 'Kitchen',
      slug: 'kitchen',
      description: 'Furniture and essentials for your kitchen',
      imageUrl: '/src/assets/kitchen.jpeg',
      displayOrder: 5,
      active: true
    });
    await kitchen.save();

    const study = new Category({
      name: 'Study',
      slug: 'study',
      description: 'Furniture for study and workspaces',
      imageUrl: '/src/assets/Study Table 3.jpeg',
      displayOrder: 6,
      active: true
    });
    await study.save();

    // Fetch category IDs
    const livingRoomCategory = await Category.findOne({ slug: 'living-room' });
    if (!livingRoomCategory) {
      throw new Error('Living Room category not found');
    }

    // Update products with correct categoryId
    const products = [
      {
        productCode: 'LRS001',
        name: 'Modern Sofa',
        category: livingRoomCategory._id, // Correct field name
        subcategory: 'Sofas',
        description: 'Comfortable modern sofa with premium fabric upholstery',
        materials: ['Fabric', 'Wood'],
        dimensions: {
          length: 180,
          width: 85,
          height: 75,
          unit: 'cm'
        },
        pricePerMonth: 8000,
        securityDeposit: 15000,
        minRentalPeriod: 3,
        stock: 5,
        images: ['modern-sofa.jpg'],
        featured: true,
        trending: true,
        isNewProduct: false
      },
      {
        productCode: 'LRT002',
        name: 'Glass Coffee Table',
        category: livingRoomCategory._id, // Correct field name
        subcategory: 'Tables',
        description: 'Elegant glass coffee table with metal frame',
        materials: ['Glass', 'Metal'],
        dimensions: {
          length: 90,
          width: 50,
          height: 45,
          unit: 'cm'
        },
        pricePerMonth: 3500,
        securityDeposit: 7000,
        minRentalPeriod: 3,
        stock: 8,
        images: ['glass-table.jpg'],
        featured: false,
        trending: true,
        isNewProduct: true
      },
      {
        productCode: 'BG207',
        name: 'Bed Getafe-207',
        category: 'Bedroom', // Replace with the actual category ID if available
        subcategory: 'Beds',
        description: 'Queen sized comfortable bed',
        materials: ['Wood', 'Foam'],
        dimensions: {
          length: 200,
          width: 150,
          height: 50,
          unit: 'cm'
        },
        pricePerMonth: 1000,
        securityDeposit: 2000,
        minRentalPeriod: 3,
        stock: 10,
        images: ['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
        featured: false,
        trending: false,
        isNewProduct: true
      }
      // Add more products as needed
    ];

    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();