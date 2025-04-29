// MongoDB Atlas Seeder for CreativeCanvas
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Get MongoDB Atlas connection string from environment
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

// Define schemas for seeding
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  price: { type: Number, required: true },
  material: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  trending: { type: Boolean, default: false },
  isNewProduct: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Create models
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

// Sample data
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
  },
  {
    name: 'Kitchen',
    slug: 'kitchen',
    description: 'Functional and stylish kitchen furniture',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-bda9f7f7597e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80'
  },
  {
    name: 'Study',
    slug: 'study',
    description: 'Comfortable study area furniture',
    imageUrl: 'https://images.unsplash.com/photo-1519974719765-e6559eac2575?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80'
  }
];

const products = [
  {
    name: 'Modern Sofa',
    description: 'A comfortable and stylish modern sofa perfect for your living room. Features high-quality fabric and sturdy construction.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
    price: 199,
    material: 'Fabric',
    trending: true,
    isNewProduct: false,
    categorySlug: 'living-room'
  },
  {
    name: 'Wooden Coffee Table',
    description: 'Sturdy wooden coffee table with a modern design. Perfect centerpiece for your living room.',
    imageUrl: 'https://images.unsplash.com/photo-1601391703731-43651f2eb9bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
    price: 99,
    material: 'Wood',
    trending: false,
    isNewProduct: true,
    categorySlug: 'living-room'
  },
  {
    name: 'King Size Bed',
    description: 'Luxurious king size bed with headboard. Provides comfort and style for your bedroom.',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
    price: 299,
    material: 'Wood and Fabric',
    trending: true,
    isNewProduct: true,
    categorySlug: 'bedroom'
  },
  {
    name: 'Dining Table Set',
    description: '6-seater dining table with chairs. Perfect for family dinners and entertaining guests.',
    imageUrl: 'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
    price: 349,
    material: 'Wood',
    trending: false,
    isNewProduct: true,
    categorySlug: 'dining-room'
  },
  {
    name: 'Office Desk',
    description: 'Modern office desk with drawers. Ideal for productive work from home.',
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
    price: 199,
    material: 'Wood and Metal',
    trending: true,
    isNewProduct: false,
    categorySlug: 'office'
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Comfortable ergonomic office chair with adjustable height and lumbar support.',
    imageUrl: 'https://images.unsplash.com/photo-1589384117478-8b6b8eb078ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
    price: 149,
    material: 'Fabric and Metal',
    trending: true,
    isNewProduct: true,
    categorySlug: 'office'
  },
  {
    name: 'Bedside Table',
    description: 'Compact bedside table with drawer. Perfect complement to your bedroom furniture.',
    imageUrl: 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
    price: 79,
    material: 'Wood',
    trending: false,
    isNewProduct: true,
    categorySlug: 'bedroom'
  },
  {
    name: 'Bookshelf',
    description: 'Modern bookshelf with multiple compartments. Stylish storage for your books and decorations.',
    imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a0324021c89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80',
    price: 129,
    material: 'Wood',
    trending: false,
    isNewProduct: false,
    categorySlug: 'living-room'
  }
];

// Connect to MongoDB Atlas
async function connectToDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    });
    console.log('✅ Connected to MongoDB Atlas');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Atlas:', error);
    return false;
  }
}

// Create categories and return a map of category slugs to their IDs
async function createCategories() {
  const categoryMap = new Map();
  
  for (const categoryData of categories) {
    try {
      // Check if category exists
      let category = await Category.findOne({ slug: categoryData.slug });
      
      if (!category) {
        // Create new category
        category = new Category(categoryData);
        await category.save();
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${category.name}`);
      }
      
      // Store in map for product creation
      categoryMap.set(category.slug, category._id);
    } catch (error) {
      console.error(`Error creating category ${categoryData.name}:`, error);
    }
  }
  
  return categoryMap;
}

// Create products
async function createProducts(categoryMap) {
  for (const productData of products) {
    try {
      // Get category ID
      const categoryId = categoryMap.get(productData.categorySlug);
      if (!categoryId) {
        console.error(`Category not found for product: ${productData.name}`);
        continue;
      }
      
      // Check if product exists
      let product = await Product.findOne({ name: productData.name });
      
      if (!product) {
        // Create new product with category reference
        const newProductData = {
          ...productData,
          category: categoryId
        };
        
        // Remove the temporary categorySlug field
        delete newProductData.categorySlug;
        
        product = new Product(newProductData);
        await product.save();
        console.log(`Created product: ${product.name}`);
      } else {
        console.log(`Product already exists: ${product.name}`);
      }
    } catch (error) {
      console.error(`Error creating product ${productData.name}:`, error);
    }
  }
}

// Main function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    const connected = await connectToDatabase();
    if (!connected) {
      console.error('Failed to connect to MongoDB Atlas. Exiting...');
      process.exit(1);
    }
    
    console.log('Starting database seeding...');
    
    // Create categories and get mapping
    const categoryMap = await createCategories();
    
    // Create products
    await createProducts(categoryMap);
    
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
    process.exit(0);
  }
}

// Run the seeder
seedDatabase();