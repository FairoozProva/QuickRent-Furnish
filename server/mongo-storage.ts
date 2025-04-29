import session from 'express-session';
import { IStorage } from './storage';
import { User, Category, Product, Rental, Wishlist, Cart } from '@shared/schema';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

export class MongoDBStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Get MongoDB Atlas connection string from environment variables
    const mongoUrl = process.env.MONGODB_URI || 'mongodb+srv://QuickRent-Furnish:TukiMeow18%26@cluster0.xtppfyc.mongodb.net/QuickRent-Furnish?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('Initializing MongoDB Atlas connection...');
    
    // Initialize MongoDB Atlas connection
    this.initializeMongoDB(mongoUrl);

    // Initialize session store with MongoDB Atlas
    this.sessionStore = MongoStore.create({
      mongoUrl,
      collectionName: 'sessions',
      ttl: 60 * 60 * 24 // 1 day
    });
  }

  private async initializeMongoDB(mongoUrl: string) {
    try {
      // Configure mongoose for MongoDB Atlas connection
      const options = {
        // Connection timeouts
        serverSelectionTimeoutMS: 30000, // 30 seconds
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        
        // Application name
        appName: 'CreativeCanvas',
        
        // Auto create indexes and collections
        autoCreate: true,
        autoIndex: true,
        
        // Optimize for resilience
        family: 4,               // Use IPv4
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 60000,    // Close idle connections after 60 seconds
      };
      
      // Check existing connection
      if (mongoose.connection.readyState === 1) {
        console.log('Using existing MongoDB Atlas connection');
        return mongoose.connection;
      }
      
      // Connect to MongoDB Atlas
      await mongoose.connect(mongoUrl, options);
      console.log('✅ Connected to MongoDB Atlas');
      
      // Add error handlers
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB Atlas connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB Atlas disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB Atlas reconnected');
      });

    } catch (error) {
      console.error('Failed to connect to MongoDB Atlas:', error);
      throw new Error('Unable to connect to MongoDB Atlas database.');
    }
  }

  // User methods
  async getUser(id: string): Promise<any | null> {
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
    return Category.find().lean();
  }

  async getCategory(id: string): Promise<any | null> {
    if (!mongoose.Types.ObjectId.isValid(id) && !id.match(/^\d+$/)) {
      return null;
    }
    return Category.findById(id).lean();
  }

  async getCategoryBySlug(slug: string): Promise<any | null> {
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
    trending?: boolean,
    isNewProduct?: boolean
  }): Promise<any[]> {
    let query: any = {};

    if (filters) {
      if (filters.categoryId) {
        // Handle both string and ObjectId category IDs
        if (mongoose.Types.ObjectId.isValid(filters.categoryId)) {
          query.category = new mongoose.Types.ObjectId(filters.categoryId);
        } else {
          // Try to find category by slug first
          const category = await this.getCategoryBySlug(filters.categoryId);
          if (category) {
            query.category = category._id;
          } else {
            query.category = filters.categoryId;
          }
        }
      }
      if (filters.trending !== undefined) {
        query.trending = filters.trending;
      }
      if (filters.isNewProduct !== undefined) {
        query.isNewProduct = filters.isNewProduct;
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