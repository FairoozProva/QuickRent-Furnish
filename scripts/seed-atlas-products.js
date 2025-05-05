import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Category, Product } from '../shared/schema.js';

dotenv.config();

// Connection URI from .env file
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://QuickRent-Furnish:TukiMeow18%26@cluster0.xtppfyc.mongodb.net/QuickRent-Furnish?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Atlas
async function connectToAtlas() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      appName: 'CreativeCanvas Seeder'
    });
    console.log(' Connected to MongoDB Atlas');
    return true;
  } catch (error) {
    console.error(' Failed to connect to MongoDB Atlas:', error);
    return false;
  }
}


async function createCategories() {
  const categories = [
    {
      name: 'Living Room',
      slug: 'living-room',
      description: 'Stylish and comfortable furniture for your living room',
      imageUrl: 'https://images.unsplash.com/photo-1486304873000-235643847519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80'
    },
    {
      name: 'Bedroom',
      slug: 'bedroom',
      description: 'Cozy and elegant furniture for your bedroom',
      imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80'
    },
    {
      name: 'Dining Room',
      slug: 'dining-room',
      description: 'Elegant dining sets for memorable meals',
      imageUrl: 'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80'
    },
    {
      name: 'Office',
      slug: 'office',
      description: 'Professional furniture for your home office',
      imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80'
    }
  ];

  const categoryMap = new Map();

  for (const categoryData of categories) {
    // Check if category already exists
    let category = await Category.findOne({ slug: categoryData.slug });
    
    if (!category) {
      // Create new category
      category = new Category(categoryData);
      await category.save();
      console.log(`Created new category: ${category.name}`);
    } else {
      console.log(`Category already exists: ${category.name}`);
    }
    
    // Store category ID for reference when creating products
    categoryMap.set(category.slug, category._id);
  }
  
  return categoryMap;
}

// Create products
async function createProducts(categoryMap) {
  const products = [
    {
      name: 'Modern Sofa',
      description: 'A comfortable and stylish modern sofa perfect for your living room. Features high-quality fabric and sturdy construction.',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
      price: 199,
      material: 'Fabric',
      categorySlug: 'living-room',
      trending: true,
      isNewProduct: false
    },
    {
      name: 'Wooden Coffee Table',
      description: 'Sturdy wooden coffee table with a modern design. Perfect centerpiece for your living room.',
      imageUrl: 'https://images.unsplash.com/photo-1601391703731-43651f2eb9bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
      price: 99,
      material: 'Wood',
      categorySlug: 'living-room',
      trending: false,
      isNewProduct: true
    },
    {
      name: 'King Size Bed',
      description: 'Luxurious king size bed with headboard. Provides comfort and style for your bedroom.',
      imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
      price: 299,
      material: 'Wood and Fabric',
      categorySlug: 'bedroom',
      trending: true,
      isNewProduct: true
    },
    {
      name: 'Dining Table Set',
      description: '6-seater dining table with chairs. Perfect for family dinners and entertaining guests.',
      imageUrl: 'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
      price: 349,
      material: 'Wood',
      categorySlug: 'dining-room',
      trending: false,
      isNewProduct: true
    },
    {
      name: 'Office Desk',
      description: 'Modern office desk with drawers. Ideal for productive work from home.',
      imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
      price: 199,
      material: 'Wood and Metal',
      categorySlug: 'office',
      trending: true,
      isNewProduct: false
    },
    {
      name: 'Ergonomic Office Chair',
      description: 'Comfortable ergonomic office chair with adjustable height and lumbar support.',
      imageUrl: 'https://images.unsplash.com/photo-1589384117478-8b6b8eb078ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
      price: 149,
      material: 'Fabric and Metal',
      categorySlug: 'office',
      trending: true,
      isNewProduct: true
    },
    {
      name: 'Bedside Table',
      description: 'Compact bedside table with drawer. Perfect complement to your bedroom furniture.',
      imageUrl: 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
      price: 79,
      material: 'Wood',
      categorySlug: 'bedroom',
      trending: false,
      isNewProduct: true
    },
    {
      name: 'Bookshelf',
      description: 'Modern bookshelf with multiple compartments. Stylish storage for your books and decorations.',
      imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a0324021c89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
      price: 129,
      material: 'Wood',
      categorySlug: 'living-room',
      trending: false,
      isNewProduct: false
    }
  ];

  for (const productData of products) {
    // Get category ID from map
    const categoryId = categoryMap.get(productData.categorySlug);
    if (!categoryId) {
      console.error(`Category not found for product: ${productData.name}`);
      continue;
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ name: productData.name });
    
    if (!existingProduct) {
      // Create new product
      const product = new Product({
        ...productData,
        category: categoryId // Set the category reference
      });
      
      delete product.categorySlug; // Remove the temporary property
      
      await product.save();
      console.log(`Created new product: ${product.name}`);
    } else {
      console.log(`Product already exists: ${existingProduct.name}`);
    }
  }
}

// Main function
async function seedDatabase() {
  try {
    const connected = await connectToAtlas();
    if (!connected) {
      console.error('Failed to connect to MongoDB Atlas. Exiting...');
      process.exit(1);
    }
    
    console.log('Starting database seeding...');
    
    // Create categories and get the map of category IDs
    const categoryMap = await createCategories();
    
    // Create products using the category map
    await createProducts(categoryMap);
    
    console.log(' Database seeding completed successfully!');
  } catch (error) {
    console.error(' Error seeding database:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
    process.exit(0);
  }
}

// Run the seeding
seedDatabase();
