import session from 'express-session';
import { IStorage } from './storage';
import { User, Category, Product, Rental, Wishlist, Cart } from '@shared/schema';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

export class MongoDBStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
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
    isTrending?: boolean,
    isNewArrival?: boolean
  }): Promise<any[]> {
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