import session from 'express-session';
import { MongoDBStorage } from './mongo-storage';

export interface IStorage {
  sessionStore: session.Store;
  
  // User methods
  getUser(id: string): Promise<any | null>;
  getUserByUsername(username: string): Promise<any | null>;
  getUserByFirebaseId(firebaseId: string): Promise<any | null>;
  createUser(user: any): Promise<any>;
  updateUser(id: string, userData: Partial<any>): Promise<any | null>;
  updateUserByFirebaseId(firebaseId: string, userData: Partial<any>): Promise<any | null>;

  // Category methods
  getCategories(): Promise<any[]>;
  getCategory(id: string): Promise<any | null>;
  getCategoryBySlug(slug: string): Promise<any | null>;
  createCategory(category: any): Promise<any>;

  // Product methods
  getProducts(filters?: {
    categoryId?: string;
    trending?: boolean;
    isNewProduct?: boolean;
  }): Promise<any[]>;
  getProduct(id: string): Promise<any | null>;
  getProductBySku(sku: string): Promise<any | null>;
  createProduct(product: any): Promise<any>;

  // Rental methods
  getRentals(userId: string): Promise<any[]>;
  getRental(id: string): Promise<any | null>;
  createRental(rental: any): Promise<any>;
  updateRental(id: string, rentalData: Partial<any>): Promise<any | null>;

  // Wishlist methods
  getWishlistItems(userId: string): Promise<any[]>;
  addToWishlist(wishlistItem: any): Promise<any>;
  removeFromWishlist(userId: string, productId: string): Promise<void>;
  isInWishlist(userId: string, productId: string): Promise<boolean>;

  // Cart methods
  getCartItems(userId: string): Promise<any[]>;
  addToCart(cartItem: any): Promise<any>;
  updateCartItem(userId: string, productId: string, duration: number): Promise<any | null>;
  removeFromCart(userId: string, productId: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
  isInCart(userId: string, productId: string): Promise<boolean>;
}

// Simple in-memory storage implementation for Replit environment
export class MemStorage implements IStorage {
  private users: Map<string, any> = new Map();
  private categories: Map<string, any> = new Map();
  private products: Map<string, any> = new Map();
  private rentals: Map<string, any> = new Map();
  private wishlistItems: Map<string, any> = new Map();
  private cartItems: Map<string, any> = new Map();
  sessionStore: session.Store;

  constructor() {
    console.log('Initializing in-memory storage for Replit environment');
    // Using built-in express-session memory store for simplicity
    this.sessionStore = new session.MemoryStore();
    
    // Initialize with sample data
    this.seedSampleData();
  }

  private seedSampleData() {
    // Sample categories
    const categories = [
      { _id: '1', name: 'Living Room', slug: 'living-room', description: 'Furniture for your living room', imageUrl: 'https://images.unsplash.com/photo-1486304873000-235643847519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80' },
      { _id: '2', name: 'Bedroom', slug: 'bedroom', description: 'Furniture for your bedroom', imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80' },
      { _id: '3', name: 'Dining Room', slug: 'dining-room', description: 'Furniture for your dining room', imageUrl: 'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80' },
      { _id: '4', name: 'Office', slug: 'office', description: 'Furniture for your home office', imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80' },
    ];

    categories.forEach(cat => {
      this.categories.set(cat._id, cat);
    });

    // Sample products
    const products = [
      { _id: '1', name: 'Modern Sofa', sku: 'SOF-001', description: 'A comfortable modern sofa', price: 199, categoryId: '1', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80', trending: true },
      { _id: '2', name: 'Wooden Coffee Table', sku: 'TBL-001', description: 'Sturdy wooden coffee table', price: 99, categoryId: '1', imageUrl: 'https://images.unsplash.com/photo-1601391703731-43651f2eb9bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80', isNewProduct: true },
      { _id: '3', name: 'King Size Bed', sku: 'BED-001', description: 'Comfortable king size bed', price: 299, categoryId: '2', imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80', trending: true, isNewProduct: true },
      { _id: '4', name: 'Dining Table Set', sku: 'DIN-001', description: '6-seater dining table with chairs', price: 349, categoryId: '3', imageUrl: 'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80', trending: false, isNewProduct: true },
      { _id: '5', name: 'Office Desk', sku: 'OFF-001', description: 'Modern office desk', price: 199, categoryId: '4', imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80', trending: true, isNewProduct: false },
    ];

    products.forEach(prod => {
      this.products.set(prod._id, prod);
    });
    
    // Sample user
    this.users.set('1', {
      _id: '1',
      username: 'demo',
      email: 'demo@example.com',
      name: 'Demo User',
      password: '$2b$10$Og2VcS6MVhyWxEPk3yPJr.9Qck0jiV8HSTDWORIQTbwBr7YqXBKhm', // "password"
      firebaseId: 'demo123',
      createdAt: new Date(),
    });
  }

  // User methods
  async getUser(id: string): Promise<any | null> {
    return this.users.get(id) || null;
  }

  async getUserByUsername(username: string): Promise<any | null> {
    const users = Array.from(this.users.values());
    for (const user of users) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  async getUserByFirebaseId(firebaseId: string): Promise<any | null> {
    const users = Array.from(this.users.values());
    for (const user of users) {
      if (user.firebaseId === firebaseId) {
        return user;
      }
    }
    return null;
  }

  async createUser(user: any): Promise<any> {
    const id = String(this.users.size + 1);
    const newUser = { ...user, _id: id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: string, userData: Partial<any>): Promise<any | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const updatedUser = { ...user, ...userData, _id: id };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserByFirebaseId(firebaseId: string, userData: Partial<any>): Promise<any | null> {
    const entries = Array.from(this.users.entries());
    for (const [id, user] of entries) {
      if (user.firebaseId === firebaseId) {
        const updatedUser = { ...user, ...userData, _id: id };
        this.users.set(id, updatedUser);
        return updatedUser;
      }
    }
    return null;
  }

  // Category methods
  async getCategories(): Promise<any[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<any | null> {
    return this.categories.get(id) || null;
  }

  async getCategoryBySlug(slug: string): Promise<any | null> {
    const categories = Array.from(this.categories.values());
    for (const category of categories) {
      if (category.slug === slug) {
        return category;
      }
    }
    return null;
  }

  async createCategory(category: any): Promise<any> {
    const id = String(this.categories.size + 1);
    const newCategory = { ...category, _id: id, createdAt: new Date() };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Product methods
  async getProducts(filters?: { categoryId?: string; trending?: boolean; isNewProduct?: boolean; }): Promise<any[]> {
    let results = Array.from(this.products.values());
    
    if (filters) {
      if (filters.categoryId) {
        results = results.filter(product => product.categoryId === filters.categoryId);
      }
      
      if (filters.trending !== undefined) {
        results = results.filter(product => product.trending === filters.trending);
      }
      
      if (filters.isNewProduct !== undefined) {
        results = results.filter(product => product.isNewProduct === filters.isNewProduct);
      }
    }
    
    return results;
  }

  async getProduct(id: string): Promise<any | null> {
    return this.products.get(id) || null;
  }

  async getProductBySku(sku: string): Promise<any | null> {
    const products = Array.from(this.products.values());
    for (const product of products) {
      if (product.sku === sku) {
        return product;
      }
    }
    return null;
  }

  async createProduct(product: any): Promise<any> {
    const id = String(this.products.size + 1);
    const newProduct = { ...product, _id: id, createdAt: new Date() };
    this.products.set(id, newProduct);
    return newProduct;
  }

  // Rental methods
  async getRentals(userId: string): Promise<any[]> {
    return Array.from(this.rentals.values()).filter(rental => rental.userId === userId);
  }

  async getRental(id: string): Promise<any | null> {
    return this.rentals.get(id) || null;
  }

  async createRental(rental: any): Promise<any> {
    const id = String(this.rentals.size + 1);
    const newRental = { ...rental, _id: id, createdAt: new Date() };
    this.rentals.set(id, newRental);
    return newRental;
  }

  async updateRental(id: string, rentalData: Partial<any>): Promise<any | null> {
    const rental = this.rentals.get(id);
    if (!rental) return null;
    const updatedRental = { ...rental, ...rentalData, _id: id };
    this.rentals.set(id, updatedRental);
    return updatedRental;
  }

  // Wishlist methods
  async getWishlistItems(userId: string): Promise<any[]> {
    return Array.from(this.wishlistItems.values())
      .filter(item => item.userId === userId)
      .map(item => {
        const product = this.products.get(item.productId);
        return { ...item, product };
      });
  }

  async addToWishlist(wishlistItem: any): Promise<any> {
    const key = `${wishlistItem.userId}_${wishlistItem.productId}`;
    const newItem = { ...wishlistItem, _id: key, createdAt: new Date() };
    this.wishlistItems.set(key, newItem);
    return newItem;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    const key = `${userId}_${productId}`;
    this.wishlistItems.delete(key);
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const key = `${userId}_${productId}`;
    return this.wishlistItems.has(key);
  }

  // Cart methods
  async getCartItems(userId: string): Promise<any[]> {
    return Array.from(this.cartItems.values())
      .filter(item => item.userId === userId)
      .map(item => {
        const product = this.products.get(item.productId);
        return { ...item, product };
      });
  }

  async addToCart(cartItem: any): Promise<any> {
    const key = `${cartItem.userId}_${cartItem.productId}`;
    const newItem = { ...cartItem, _id: key, createdAt: new Date() };
    this.cartItems.set(key, newItem);
    return newItem;
  }

  async updateCartItem(userId: string, productId: string, duration: number): Promise<any | null> {
    const key = `${userId}_${productId}`;
    const item = this.cartItems.get(key);
    if (!item) return null;
    
    const updatedItem = { ...item, duration, _id: key };
    this.cartItems.set(key, updatedItem);
    return updatedItem;
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    const key = `${userId}_${productId}`;
    this.cartItems.delete(key);
  }

  async clearCart(userId: string): Promise<void> {
    const entries = Array.from(this.cartItems.entries());
    for (const [key, item] of entries) {
      if (item.userId === userId) {
        this.cartItems.delete(key);
      }
    }
  }

  async isInCart(userId: string, productId: string): Promise<boolean> {
    const key = `${userId}_${productId}`;
    return this.cartItems.has(key);
  }
}

// Create and export the storage instance
// Use MongoDBStorage if in Replit environment or has MongoDB URI, otherwise fallback to MemStorage
if (process.env.REPL_ID || process.env.MONGODB_URI) {
  console.log('Using MongoDB storage for production/Replit environment');
  export const storage: IStorage = new MongoDBStorage();
} else {
  console.log('Initializing in-memory storage for Replit environment');
  export const storage: IStorage = new MemStorage();
}