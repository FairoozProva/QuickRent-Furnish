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
      image: 'living-room.jpg',
      displayOrder: 1,
      active: true
    });
    await livingRoom.save();

    const diningRoom = new Category({
      name: 'Dining Room',
      slug: 'dining-room',
      description: 'Elegant dining furniture for family meals',
      image: 'dining-room.jpg',
      displayOrder: 2,
      active: true
    });
    await diningRoom.save();

    const bedroom = new Category({
      name: 'Bedroom',
      slug: 'bedroom',
      description: 'Relaxing bedroom furniture for a good night sleep',
      image: 'bedroom.jpg',
      displayOrder: 3,
      active: true
    });
    await bedroom.save();

    const office = new Category({
      name: 'Office',
      slug: 'office',
      description: 'Professional furniture for home office setup',
      image: 'office.jpg',
      displayOrder: 4,
      active: true
    });
    await office.save();

    // Create products
    console.log('Creating products...');
    
    // Living Room Products
    const products = [
      {
        productCode: 'LRS001',
        name: 'Modern Sofa',
        category: 'Living Room',
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
        category: 'Living Room',
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
        productCode: 'DRT001',
        name: 'Wooden Dining Table Set',
        category: 'Dining Room',
        subcategory: 'Dining Sets',
        description: 'Beautiful wooden dining table with 6 chairs',
        materials: ['Wood', 'Fabric'],
        dimensions: {
          length: 150,
          width: 90,
          height: 75,
          unit: 'cm'
        },
        pricePerMonth: 6500,
        securityDeposit: 12000,
        minRentalPeriod: 3,
        stock: 3,
        images: ['dining-table.jpg'],
        featured: true,
        trending: false,
        isNewProduct: false
      },
      {
        productCode: 'BED001',
        name: 'Queen Size Bed',
        category: 'Bedroom',
        subcategory: 'Beds',
        description: 'Comfortable queen size bed with headboard',
        materials: ['Wood', 'Metal'],
        dimensions: {
          length: 200,
          width: 150,
          height: 60,
          unit: 'cm'
        },
        pricePerMonth: 5500,
        securityDeposit: 10000,
        minRentalPeriod: 3,
        stock: 4,
        images: ['queen-bed.jpg'],
        featured: true,
        trending: true,
        isNewProduct: false
      },
      {
        productCode: 'OFF001',
        name: 'Ergonomic Office Chair',
        category: 'Office',
        subcategory: 'Chairs',
        description: 'Comfortable ergonomic office chair with adjustable height',
        materials: ['Mesh', 'Metal', 'Plastic'],
        dimensions: {
          width: 65,
          depth: 65,
          height: 110,
          unit: 'cm'
        },
        pricePerMonth: 2500,
        securityDeposit: 5000,
        minRentalPeriod: 3,
        stock: 10,
        images: ['office-chair.jpg'],
        featured: false,
        trending: true,
        isNewProduct: true
      }
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