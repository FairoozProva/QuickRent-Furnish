import session from 'express-session';
import createMemoryStore from 'memorystore';
import { v4 as uuidv4 } from 'uuid';

const MemoryStore = createMemoryStore(session);

// Sample data
// Sample categories for the database
const sampleCategories = [
  { _id: "1", name: "Sofa Set", slug: "sofa-set", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", createdAt: new Date() },
  { _id: "2", name: "Bedroom", slug: "bedroom", imageUrl: "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", createdAt: new Date() },
  { _id: "3", name: "Dining", slug: "dining", imageUrl: "https://images.unsplash.com/photo-1615066390971-01df3ab9facb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", createdAt: new Date() },
  { _id: "4", name: "Living", slug: "living", imageUrl: "https://images.unsplash.com/photo-1567016376408-0226e4d0b1ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", createdAt: new Date() },
  { _id: "5", name: "Study", slug: "study", imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", createdAt: new Date() },
  { _id: "6", name: "Metal", slug: "metal", imageUrl: "https://images.unsplash.com/photo-1542061651-ede3359ae6e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", createdAt: new Date() }
];

// Sample products for the database
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
    dimensions: "220x90x80 cm",
    color: "Red",
    material: "Fabric, Wood",
    seats: 3,
    isTrending: true,
    isNewArrival: false,
    createdAt: new Date()
  },
  { 
    _id: "3", 
    name: "Wooden Bed-MKDST-T18", 
    sku: "WOODEN-BED-MKDST-T18", 
    description: "A sturdy wooden bed frame with a simple, elegant design.",
    price: 9000, 
    categoryId: "2", 
    imageUrl: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "200x160x40 cm",
    color: "Natural Wood",
    material: "Solid Wood",
    isTrending: true,
    isNewArrival: false,
    createdAt: new Date()
  },
  { 
    _id: "4", 
    name: "Mini Desk-MX1-Y70", 
    sku: "MINI-DESK-MX1-Y70", 
    description: "A compact desk perfect for small spaces or as a secondary workspace.",
    price: 3500, 
    categoryId: "5", 
    imageUrl: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "100x60x75 cm",
    color: "White",
    material: "MDF, Metal",
    isTrending: true,
    isNewArrival: false,
    createdAt: new Date()
  },
  { 
    _id: "5", 
    name: "Computer Table-KCT2", 
    sku: "COMPUTER-TABLE-KCT2", 
    description: "A functional computer desk with storage compartments.",
    price: 6000, 
    categoryId: "5", 
    imageUrl: "https://images.unsplash.com/photo-1589584649628-b597067e07a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "120x60x75 cm",
    color: "Black",
    material: "MDF, Metal",
    isTrending: false,
    isNewArrival: true,
    createdAt: new Date()
  },
  { 
    _id: "6", 
    name: "Kitchen Cabinet Small Organizer", 
    sku: "KITCHEN-CABINET-SO", 
    description: "A versatile small cabinet for kitchen organization.",
    price: 3000, 
    categoryId: "3", 
    imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "60x40x90 cm",
    color: "White",
    material: "MDF",
    isTrending: false,
    isNewArrival: true,
    createdAt: new Date()
  }
];

// Define the storage interface
export interface IStorage {
  // User methods
  getUser(id: string): Promise<any | null>;
  getUserByUsername(username: string): Promise<any | null>;
  getUserByFirebaseId(firebaseId: string): Promise<any | null>;
  createUser(user: any): Promise<any>;
  updateUser(id: string, user: Partial<any>): Promise<any | null>;
  updateUserByFirebaseId(firebaseId: string, user: Partial<any>): Promise<any | null>;

  // Category methods
  getCategories(): Promise<any[]>;
  getCategory(id: string): Promise<any | null>;
  getCategoryBySlug(slug: string): Promise<any | null>;
  createCategory(category: any): Promise<any>;

  // Product methods
  getProducts(filters?: { 
    categoryId?: string, 
    isTrending?: boolean, 
    isNewArrival?: boolean 
  }): Promise<any[]>;
  getProduct(id: string): Promise<any | null>;
  getProductBySku(sku: string): Promise<any | null>;
  createProduct(product: any): Promise<any>;
  
  // Rental methods
  getRentals(userId: string): Promise<any[]>;
  getRental(id: string): Promise<any | null>;
  createRental(rental: any): Promise<any>;
  updateRental(id: string, rental: Partial<any>): Promise<any | null>;

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

  sessionStore: session.Store;
}

// Create an in-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<string, any>;
  private categories: Map<string, any>;
  private products: Map<string, any>;
  private rentals: Map<string, any>;
  private wishlistItems: Map<string, any>;
  private cartItems: Map<string, any>;
  sessionStore: session.Store;

  constructor() {
    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });

    // Initialize collections
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.rentals = new Map();
    this.wishlistItems = new Map();
    this.cartItems = new Map();

    // Seed the database with sample data
    this.seedDatabase();
  }

  private seedDatabase() {
    // Add sample categories
    sampleCategories.forEach(category => {
      this.categories.set(category._id, category);
    });

    // Add sample products
    sampleProducts.forEach(product => {
      this.products.set(product._id, product);
    });

    // Add a test user
    const testUser = {
      _id: "test-user-id",
      username: "test",
      password: "$2b$10$ZPg5eTRgsSJYTwJX0PVI5OyCtWJpGdnGsFwxLyv4z6GtIcXoaIjTW", // password: "password"
      name: "Test User",
      email: "test@example.com",
      createdAt: new Date()
    };
    this.users.set(testUser._id, testUser);
  }

  // User methods
  async getUser(id: string): Promise<any | null> {
    return this.users.get(id) || null;
  }

  async getUserByUsername(username: string): Promise<any | null> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    ) || null;
  }
  
  async getUserByFirebaseId(firebaseId: string): Promise<any | null> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseId === firebaseId
    ) || null;
  }

  async createUser(insertUser: any): Promise<any> {
    const id = uuidv4();
    const user = { ...insertUser, _id: id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userData: Partial<any>): Promise<any | null> {
    const existingUser = await this.getUser(id);
    if (!existingUser) return null;

    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserByFirebaseId(firebaseId: string, userData: Partial<any>): Promise<any | null> {
    const existingUser = await this.getUserByFirebaseId(firebaseId);
    if (!existingUser) return null;

    const updatedUser = { ...existingUser, ...userData };
    this.users.set(existingUser._id, updatedUser);
    return updatedUser;
  }

  // Category methods
  async getCategories(): Promise<any[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<any | null> {
    return this.categories.get(id) || null;
  }

  async getCategoryBySlug(slug: string): Promise<any | null> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    ) || null;
  }

  async createCategory(insertCategory: any): Promise<any> {
    const id = uuidv4();
    const category = { ...insertCategory, _id: id, createdAt: new Date() };
    this.categories.set(id, category);
    return category;
  }

  // Product methods
  async getProducts(filters?: { 
    categoryId?: string, 
    isTrending?: boolean, 
    isNewArrival?: boolean 
  }): Promise<any[]> {
    let products = Array.from(this.products.values());
    
    if (filters) {
      if (filters.categoryId !== undefined) {
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

  async getProduct(id: string): Promise<any | null> {
    return this.products.get(id) || null;
  }

  async getProductBySku(sku: string): Promise<any | null> {
    return Array.from(this.products.values()).find(
      (product) => product.sku === sku
    ) || null;
  }

  async createProduct(insertProduct: any): Promise<any> {
    const id = uuidv4();
    const product = { ...insertProduct, _id: id, createdAt: new Date() };
    this.products.set(id, product);
    return product;
  }

  // Rental methods
  async getRentals(userId: string): Promise<any[]> {
    return Array.from(this.rentals.values())
      .filter(rental => rental.userId === userId)
      .map(rental => {
        // Add product information to rental
        const product = this.products.get(rental.productId);
        return {
          ...rental,
          product: product ? {
            _id: product._id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            material: product.material
          } : null
        };
      });
  }

  async getRental(id: string): Promise<any | null> {
    return this.rentals.get(id) || null;
  }

  async createRental(insertRental: any): Promise<any> {
    const id = uuidv4();
    const rental = { ...insertRental, _id: id, createdAt: new Date() };
    this.rentals.set(id, rental);
    return rental;
  }

  async updateRental(id: string, rentalData: Partial<any>): Promise<any | null> {
    const existingRental = await this.getRental(id);
    if (!existingRental) return null;

    const updatedRental = { ...existingRental, ...rentalData };
    this.rentals.set(id, updatedRental);
    return updatedRental;
  }

  // Wishlist methods
  async getWishlistItems(userId: string): Promise<any[]> {
    return Array.from(this.wishlistItems.values())
      .filter(item => item.userId === userId)
      .map(item => {
        // Add product information to wishlist item
        const product = this.products.get(item.productId);
        return {
          ...item,
          product: product || null
        };
      });
  }

  async addToWishlist(insertWishlistItem: any): Promise<any> {
    // Check if item already exists
    const existingItem = Array.from(this.wishlistItems.values()).find(
      (item) => item.userId === insertWishlistItem.userId && item.productId === insertWishlistItem.productId
    );

    if (existingItem) {
      return existingItem;
    }

    const id = uuidv4();
    const wishlistItem = { ...insertWishlistItem, _id: id, createdAt: new Date() };
    this.wishlistItems.set(id, wishlistItem);
    return wishlistItem;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    const itemsToRemove = Array.from(this.wishlistItems.entries())
      .filter(([_, item]) => item.userId === userId && item.productId === productId);
    
    itemsToRemove.forEach(([id, _]) => {
      this.wishlistItems.delete(id);
    });
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    return Array.from(this.wishlistItems.values()).some(
      item => item.userId === userId && item.productId === productId
    );
  }

  // Cart methods
  async getCartItems(userId: string): Promise<any[]> {
    return Array.from(this.cartItems.values())
      .filter(item => item.userId === userId)
      .map(item => {
        // Add product information to cart item
        const product = this.products.get(item.productId);
        return {
          ...item,
          product: product || null
        };
      });
  }

  async addToCart(insertCartItem: any): Promise<any> {
    // Check if item already exists
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => item.userId === insertCartItem.userId && item.productId === insertCartItem.productId
    );

    if (existingItem) {
      return this.updateCartItem(insertCartItem.userId, insertCartItem.productId, insertCartItem.duration);
    }

    const id = uuidv4();
    const cartItem = { ...insertCartItem, _id: id, createdAt: new Date() };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(userId: string, productId: string, duration: number): Promise<any | null> {
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => item.userId === userId && item.productId === productId
    );

    if (!existingItem) return null;

    const updatedItem = { ...existingItem, duration };
    this.cartItems.set(existingItem._id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    const itemsToRemove = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.userId === userId && item.productId === productId);
    
    itemsToRemove.forEach(([id, _]) => {
      this.cartItems.delete(id);
    });
  }

  async clearCart(userId: string): Promise<void> {
    const itemsToRemove = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.userId === userId);
    
    itemsToRemove.forEach(([id, _]) => {
      this.cartItems.delete(id);
    });
  }

  async isInCart(userId: string, productId: string): Promise<boolean> {
    return Array.from(this.cartItems.values()).some(
      item => item.userId === userId && item.productId === productId
    );
  }
}

// Import MongoDB storage
import { MongoDBStorage } from './mongo-storage';

// Use MongoDB storage exclusively as per requirement
export const storage = new MongoDBStorage();
