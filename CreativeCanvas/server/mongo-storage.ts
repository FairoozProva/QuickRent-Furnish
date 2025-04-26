import session from 'express-session';
import { IStorage } from './storage';
import { User, Category, Product, Rental, Wishlist, Cart } from '@shared/schema';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import createMemoryStore from 'memorystore';

export class MongoDBStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Check if we're in Replit environment
    const isReplitEnv = process.env.REPLIT_DB_URL ? true : false;
    
    if (isReplitEnv) {
      // Use memory store for sessions in Replit
      const MemoryStore = createMemoryStore(session);
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      });
      console.log('Using in-memory session storage in Replit');
      
      // Initialize memory data for Replit environment
      this.initializeMemoryData();
    } else {
      // Get MongoDB connection string
      let mongoUrl: string;
  
      // Check if MONGODB_URI is directly provided
      if (process.env.MONGODB_URI) {
        // Replace any environment variable placeholders in the URI
        let uri = process.env.MONGODB_URI;
        
        // Replace ${MONGODB_USERNAME} and ${MONGODB_PASSWORD} with the actual values
        if (uri.includes('${MONGODB_USERNAME}') && process.env.MONGODB_USERNAME) {
          uri = uri.replace('${MONGODB_USERNAME}', process.env.MONGODB_USERNAME);
        }
        
        if (uri.includes('${MONGODB_PASSWORD}') && process.env.MONGODB_PASSWORD) {
          uri = uri.replace('${MONGODB_PASSWORD}', process.env.MONGODB_PASSWORD);
        }
        
        // If it's a mongodb+srv connection, ensure there's no port number
        if (uri.startsWith('mongodb+srv://')) {
          const portRegex = /:(\d+)(?=\/)/;
          if (portRegex.test(uri)) {
            uri = uri.replace(portRegex, '');
          }
        }
        
        mongoUrl = uri;
      }
      // Default to localhost
      else {
        mongoUrl = 'mongodb://localhost:27017/quickrent_furnish';
      }
  
      // Initialize session store with MongoDB
      this.sessionStore = MongoStore.create({
        mongoUrl,
        collectionName: 'sessions',
        ttl: 60 * 60 * 24 // 1 day
      });
    }
  }

  // Check if running in Replit environment
  private isReplitEnv = process.env.REPLIT_DB_URL ? true : false;
  
  // In-memory data storage when running in Replit
  private users: Map<string, any> = new Map();
  private categories: Map<string, any> = new Map();
  private products: Map<string, any> = new Map();
  private rentals: Map<string, any> = new Map();
  private wishlistItems: Map<string, any> = new Map();
  private cartItems: Map<string, any> = new Map();
  
  // Initialize in-memory data for Replit environment
  private initializeMemoryData() {
    // Sample categories from server/storage.ts
    const sampleCategories = [
      { _id: "1", name: "Sofa Set", slug: "sofa-set", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", createdAt: new Date() },
      { _id: "2", name: "Bedroom", slug: "bedroom", imageUrl: "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", createdAt: new Date() },
      { _id: "3", name: "Dining", slug: "dining", imageUrl: "https://images.unsplash.com/photo-1615066390971-01df3ab9facb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", createdAt: new Date() },
      { _id: "4", name: "Living", slug: "living", imageUrl: "https://images.unsplash.com/photo-1567016376408-0226e4d0b1ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", createdAt: new Date() },
      { _id: "5", name: "Study", slug: "study", imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", createdAt: new Date() },
      { _id: "6", name: "Metal", slug: "metal", imageUrl: "https://images.unsplash.com/photo-1542061651-ede3359ae6e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", createdAt: new Date() }
    ];

    // Add categories to the map
    sampleCategories.forEach(category => {
      this.categories.set(category._id, category);
    });
    
    // Add sample products
    const sampleProducts = [
      { 
        _id: "1", 
        name: "Bookshelf MINI-PK", 
        sku: "BOOKSHELF-MINI-PK", 
        description: "A sleek, modern bookshelf for your home or office.",
        price: 4500, 
        categoryId: "5", 
        imageUrl: "https://images.unsplash.com/photo-1591129841117-3adfd313a592?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dimensions: "120x40x180 cm",
        color: "Walnut",
        material: "Wood",
        isTrending: true,
        isNewArrival: false,
        createdAt: new Date()
      },
      { 
        _id: "2", 
        name: "Red Sofa-Z7D", 
        sku: "RED-SOFA-Z7D", 
        description: "A vibrant red sofa to add color to your living room.",
        price: 12000, 
        categoryId: "1", 
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dimensions: "220x95x85 cm",
        color: "Red",
        material: "Fabric",
        isTrending: true,
        isNewArrival: true,
        createdAt: new Date()
      }
    ];
    
    // Add products to the map
    sampleProducts.forEach(product => {
      this.products.set(product._id, product);
    });
    
    // Add a test user
    const testUser = {
      _id: "test-user-id",
      username: "testuser",
      password: "hashed_password",
      name: "Test User",
      email: "test@example.com",
      firebaseId: "test-firebase-id",
      createdAt: new Date()
    };
    this.users.set(testUser._id, testUser);
    
    console.log('Initialized memory data for Replit environment');
  }
  
  // User methods
  async getUser(id: string): Promise<any | null> {
    // If in Replit, use in-memory data
    if (this.isReplitEnv) {
      return this.users.get(id) || null;
    }
    
    // Otherwise use MongoDB
    if (!mongoose.Types.ObjectId.isValid(id) && id !== 'test-user-id') {
      return null;
    }
    return User.findById(id).lean();
  }

  async getUserByUsername(username: string): Promise<any | null> {
    return User.findOne({ username }).lean();
  }
  
  async getUserByFirebaseId(firebaseId: string): Promise<any | null> {
    return User.findOne({ firebaseId }).lean();
  }

  async createUser(user: any): Promise<any> {
    const newUser = new User(user);
    await newUser.save();
    return newUser.toObject();
  }

  async updateUser(id: string, userData: Partial<any>): Promise<any | null> {
    if (!mongoose.Types.ObjectId.isValid(id) && id !== 'test-user-id') {
      return null;
    }
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { $set: userData }, 
      { new: true }
    ).lean();
    return updatedUser;
  }
  
  async updateUserByFirebaseId(firebaseId: string, userData: Partial<any>): Promise<any | null> {
    const updatedUser = await User.findOneAndUpdate(
      { firebaseId },
      { $set: userData },
      { new: true }
    ).lean();
    return updatedUser;
  }

  // Category methods
  async getCategories(): Promise<any[]> {
    // If in Replit, use in-memory data
    if (this.isReplitEnv) {
      return Array.from(this.categories.values());
    }
    
    // Otherwise use MongoDB
    return Category.find().lean();
  }

  async getCategory(id: string): Promise<any | null> {
    if (!mongoose.Types.ObjectId.isValid(id) && !id.match(/^\d+$/)) {
      return null;
    }
    return Category.findById(id).lean();
  }

  async getCategoryBySlug(slug: string): Promise<any | null> {
    // If in Replit, use in-memory data
    if (this.isReplitEnv) {
      return Array.from(this.categories.values()).find(category => category.slug === slug) || null;
    }
    
    // Otherwise use MongoDB
    return Category.findOne({ slug }).lean();
  }

  async createCategory(category: any): Promise<any> {
    const newCategory = new Category(category);
    await newCategory.save();
    return newCategory.toObject();
  }

  // Product methods
  async getProducts(filters?: { 
    categoryId?: string,
    isTrending?: boolean,
    isNewArrival?: boolean
  }): Promise<any[]> {
    // If in Replit, use in-memory data
    if (this.isReplitEnv) {
      let products = Array.from(this.products.values());
      
      // Apply filters if any
      if (filters) {
        if (filters.categoryId) {
          products = products.filter(p => p.categoryId === filters.categoryId);
        }
        if (filters.isTrending !== undefined) {
          products = products.filter(p => p.isTrending === filters.isTrending);
        }
        if (filters.isNewArrival !== undefined) {
          products = products.filter(p => p.isNewArrival === filters.isNewArrival);
        }
      }
      
      return products;
    }
    
    // Otherwise use MongoDB
    let query: any = {};

    if (filters) {
      if (filters.categoryId) {
        query.categoryId = filters.categoryId;
      }
      if (filters.isTrending !== undefined) {
        query.isTrending = filters.isTrending;
      }
      if (filters.isNewArrival !== undefined) {
        query.isNewArrival = filters.isNewArrival;
      }
    }

    return Product.find(query).lean();
  }

  async getProduct(id: string): Promise<any | null> {
    if (!mongoose.Types.ObjectId.isValid(id) && !id.match(/^\d+$/)) {
      return null;
    }
    return Product.findById(id).lean();
  }

  async getProductBySku(sku: string): Promise<any | null> {
    return Product.findOne({ sku }).lean();
  }

  async createProduct(product: any): Promise<any> {
    const newProduct = new Product(product);
    await newProduct.save();
    return newProduct.toObject();
  }

  // Rental methods
  async getRentals(userId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(userId) && userId !== 'test-user-id') {
      return [];
    }
    return Rental.find({ userId }).populate('productId').lean();
  }

  async getRental(id: string): Promise<any | null> {
    if (!mongoose.Types.ObjectId.isValid(id) && !id.match(/^\d+$/)) {
      return null;
    }
    return Rental.findById(id).lean();
  }

  async createRental(rental: any): Promise<any> {
    const newRental = new Rental(rental);
    await newRental.save();
    return newRental.toObject();
  }

  async updateRental(id: string, rentalData: Partial<any>): Promise<any | null> {
    if (!mongoose.Types.ObjectId.isValid(id) && !id.match(/^\d+$/)) {
      return null;
    }
    const updatedRental = await Rental.findByIdAndUpdate(
      id,
      { $set: rentalData },
      { new: true }
    ).lean();
    return updatedRental;
  }

  // Wishlist methods
  async getWishlistItems(userId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(userId) && userId !== 'test-user-id') {
      return [];
    }
    const items = await Wishlist.find({ userId }).populate('productId').lean();
    return items.map(item => ({
      ...item,
      product: item.productId
    }));
  }

  async addToWishlist(wishlistItem: any): Promise<any> {
    // Check if item already exists
    const existingItem = await Wishlist.findOne({
      userId: wishlistItem.userId,
      productId: wishlistItem.productId
    }).lean();

    if (existingItem) {
      return existingItem;
    }

    const newItem = new Wishlist(wishlistItem);
    await newItem.save();
    return newItem.toObject();
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    await Wishlist.deleteOne({ userId, productId });
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const count = await Wishlist.countDocuments({ userId, productId });
    return count > 0;
  }

  // Cart methods
  async getCartItems(userId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(userId) && userId !== 'test-user-id') {
      return [];
    }
    const items = await Cart.find({ userId }).populate('productId').lean();
    return items.map(item => ({
      ...item,
      product: item.productId
    }));
  }

  async addToCart(cartItem: any): Promise<any> {
    // Check if item already exists
    const existingItem = await Cart.findOne({
      userId: cartItem.userId,
      productId: cartItem.productId
    }).lean();

    if (existingItem) {
      // Update the duration
      return this.updateCartItem(
        cartItem.userId,
        cartItem.productId,
        cartItem.duration
      );
    }

    const newItem = new Cart(cartItem);
    await newItem.save();
    return newItem.toObject();
  }

  async updateCartItem(userId: string, productId: string, duration: number): Promise<any | null> {
    const updatedItem = await Cart.findOneAndUpdate(
      { userId, productId },
      { $set: { duration } },
      { new: true }
    ).populate('productId').lean();

    if (!updatedItem) return null;

    return {
      ...updatedItem,
      product: updatedItem.productId
    };
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    await Cart.deleteOne({ userId, productId });
  }

  async clearCart(userId: string): Promise<void> {
    await Cart.deleteMany({ userId });
  }

  async isInCart(userId: string, productId: string): Promise<boolean> {
    const count = await Cart.countDocuments({ userId, productId });
    return count > 0;
  }
}