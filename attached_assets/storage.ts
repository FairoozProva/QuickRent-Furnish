import { users, categories, products, rentals, wishlist, cart } from "@shared/schema";
import { type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct, type Rental, type InsertRental, type WishlistItem, type InsertWishlist, type CartItem, type InsertCart } from "@shared/schema";
import session from "express-session";
import type { SessionStore } from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

const sampleCategories = [
  { id: 1, name: "Sofa Set", slug: "sofa-set", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "Bedroom", slug: "bedroom", imageUrl: "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "Dining", slug: "dining", imageUrl: "https://images.unsplash.com/photo-1615066390971-01df3ab9facb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "Living", slug: "living", imageUrl: "https://images.unsplash.com/photo-1567016376408-0226e4d0b1ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { id: 5, name: "Study", slug: "study", imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { id: 6, name: "Metal", slug: "metal", imageUrl: "https://images.unsplash.com/photo-1542061651-ede3359ae6e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" }
];

const sampleProducts = [
  { 
    id: 1, 
    name: "Bookshelf MINI-PK", 
    sku: "BOOKSHELF-MINI-PK", 
    description: "A sleek, modern bookshelf for your home or office.",
    price: 4500, 
    categoryId: 5, 
    imageUrl: "https://images.unsplash.com/photo-1591129841117-3adfd313a592?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "120x40x180 cm",
    color: "Walnut",
    material: "Wood",
    isTrending: true,
    isNewArrival: false
  },
  { 
    id: 2, 
    name: "Red Sofa-Z7D", 
    sku: "RED-SOFA-Z7D", 
    description: "A vibrant red sofa to add color to your living room.",
    price: 12000, 
    categoryId: 1, 
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "220x90x80 cm",
    color: "Red",
    material: "Fabric, Wood",
    seats: 3,
    isTrending: true,
    isNewArrival: false
  },
  { 
    id: 3, 
    name: "Wooden Bed-MKDST-T18", 
    sku: "WOODEN-BED-MKDST-T18", 
    description: "A sturdy wooden bed frame with a simple, elegant design.",
    price: 9000, 
    categoryId: 2, 
    imageUrl: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "200x160x40 cm",
    color: "Natural Wood",
    material: "Solid Wood",
    isTrending: true,
    isNewArrival: false
  },
  { 
    id: 4, 
    name: "Mini Desk-MX1-Y70", 
    sku: "MINI-DESK-MX1-Y70", 
    description: "A compact desk perfect for small spaces or as a secondary workspace.",
    price: 3500, 
    categoryId: 5, 
    imageUrl: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "100x60x75 cm",
    color: "White",
    material: "MDF, Metal",
    isTrending: true,
    isNewArrival: false
  },
  { 
    id: 5, 
    name: "Computer Table-KCT2", 
    sku: "COMPUTER-TABLE-KCT2", 
    description: "A functional computer desk with storage compartments.",
    price: 6000, 
    categoryId: 5, 
    imageUrl: "https://images.unsplash.com/photo-1589584649628-b597067e07a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "120x60x75 cm",
    color: "Black",
    material: "MDF, Metal",
    isTrending: false,
    isNewArrival: true
  },
  { 
    id: 6, 
    name: "Kitchen Cabinet Small Organizer", 
    sku: "KITCHEN-CABINET-SO", 
    description: "A versatile small cabinet for kitchen organization.",
    price: 3000, 
    categoryId: 3, 
    imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "60x40x90 cm",
    color: "White",
    material: "MDF",
    isTrending: false,
    isNewArrival: true
  },
  { 
    id: 7, 
    name: "Modern Sofa", 
    sku: "SOFA-MELVIN-250", 
    description: "A sleek, modern sofa featuring a minimalist design with plush cushions. Perfect for contemporary living spaces.",
    price: 12000, 
    categoryId: 1, 
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "230x110 cm",
    color: "White-Blue",
    material: "Fabric, Wood",
    seats: 3,
    isTrending: false,
    isNewArrival: false
  },
  { 
    id: 8, 
    name: "Sofa Nottingham-Z43", 
    sku: "SOFA-NOTTINGHAM-Z43", 
    description: "A comfortable yellow sofa with ample seating space.",
    price: 15000, 
    categoryId: 1, 
    imageUrl: "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "250x120 cm",
    color: "Yellow",
    material: "Fabric, Wood",
    seats: 3,
    isTrending: false,
    isNewArrival: false
  },
  { 
    id: 9, 
    name: "Sofa RLX-230", 
    sku: "SOFA-RLX-230", 
    description: "A light blue sofa with a relaxed, casual style.",
    price: 11000, 
    categoryId: 1, 
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "220x100 cm",
    color: "Light Blue",
    material: "Fabric, Wood",
    seats: 3,
    isTrending: false,
    isNewArrival: false
  },
  { 
    id: 10, 
    name: "Sofa Set 2", 
    sku: "MODERN-L-SHAPED-SOFA", 
    description: "A spacious L-shaped sofa perfect for family rooms.",
    price: 18000, 
    categoryId: 1, 
    imageUrl: "https://images.unsplash.com/photo-1506780789220-9e96ccefb527?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "300x180 cm",
    color: "White-Gray",
    material: "Fabric, Wood",
    seats: 5,
    isTrending: false,
    isNewArrival: false
  },
  { 
    id: 11, 
    name: "Velvet L-Shaped Custom", 
    sku: "VELVET-L-SHAPED-CUSTOM", 
    description: "A luxurious blue velvet L-shaped sofa.",
    price: 19000, 
    categoryId: 1, 
    imageUrl: "https://images.unsplash.com/photo-1584054422729-505d28be96cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "280x170 cm",
    color: "Blue",
    material: "Velvet, Wood",
    seats: 4,
    isTrending: false,
    isNewArrival: false
  },
  { 
    id: 12, 
    name: "SOFA_COLLECTION5", 
    sku: "SOFA-COLLECTION5", 
    description: "A balanced black and tan sofa design.",
    price: 13000, 
    categoryId: 1, 
    imageUrl: "https://images.unsplash.com/photo-1605818599703-ccc5533187e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    dimensions: "200x100 cm",
    color: "Black/Tan",
    material: "Fabric, Wood",
    seats: 3,
    isTrending: false,
    isNewArrival: false
  }
];

export interface IStorage {

  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;


  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

 
  getProducts(filters?: { 
    categoryId?: number, 
    isTrending?: boolean, 
    isNewArrival?: boolean 
  }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  
  getRentals(userId: number): Promise<Rental[]>;
  getRental(id: number): Promise<Rental | undefined>;
  createRental(rental: InsertRental): Promise<Rental>;
  updateRental(id: number, rental: Partial<Rental>): Promise<Rental | undefined>;


  getWishlistItems(userId: number): Promise<WishlistItem[]>;
  addToWishlist(wishlistItem: InsertWishlist): Promise<WishlistItem>;
  removeFromWishlist(userId: number, productId: number): Promise<void>;

  
  getCartItems(userId: number): Promise<CartItem[]>;
  addToCart(cartItem: InsertCart): Promise<CartItem>;
  updateCartItem(userId: number, productId: number, duration: number): Promise<CartItem | undefined>;
  removeFromCart(userId: number, productId: number): Promise<void>;
  clearCart(userId: number): Promise<void>;

  sessionStore: SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private rentals: Map<number, Rental>;
  private wishlistItems: Map<number, WishlistItem>;
  private cartItems: Map<number, CartItem>;
  sessionStore: SessionStore;
  
  currentUserId: number;
  currentCategoryId: number;
  currentProductId: number;
  currentRentalId: number;
  currentWishlistId: number;
  currentCartId: number;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });

    
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.rentals = new Map();
    this.wishlistItems = new Map();
    this.cartItems = new Map();


    this.currentUserId = 1;
    this.currentCategoryId = sampleCategories.length + 1;
    this.currentProductId = sampleProducts.length + 1;
    this.currentRentalId = 1;
    this.currentWishlistId = 1;
    this.currentCartId = 1;

   
    this.seedDatabase();
  }

  private seedDatabase() {
    sampleCategories.forEach(category => {
      this.categories.set(category.id, { ...category, createdAt: new Date() });
    });

    sampleProducts.forEach(product => {
      this.products.set(product.id, { ...product, createdAt: new Date() });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) return undefined;

    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id, createdAt: new Date() };
    this.categories.set(id, category);
    return category;
  }


  async getProducts(filters?: { 
    categoryId?: number, 
    isTrending?: boolean, 
    isNewArrival?: boolean 
  }): Promise<Product[]> {
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

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.sku === sku,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id, createdAt: new Date() };
    this.products.set(id, product);
    return product;
  }

 
  async getRentals(userId: number): Promise<Rental[]> {
    return Array.from(this.rentals.values()).filter(
      (rental) => rental.userId === userId,
    );
  }

  async getRental(id: number): Promise<Rental | undefined> {
    return this.rentals.get(id);
  }

  async createRental(insertRental: InsertRental): Promise<Rental> {
    const id = this.currentRentalId++;
    const rental: Rental = { ...insertRental, id, createdAt: new Date() };
    this.rentals.set(id, rental);
    return rental;
  }

  async updateRental(id: number, rentalData: Partial<Rental>): Promise<Rental | undefined> {
    const existingRental = await this.getRental(id);
    if (!existingRental) return undefined;

    const updatedRental = { ...existingRental, ...rentalData };
    this.rentals.set(id, updatedRental);
    return updatedRental;
  }

  async getWishlistItems(userId: number): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItems.values()).filter(
      (item) => item.userId === userId,
    );
  }

  async addToWishlist(insertWishlistItem: InsertWishlist): Promise<WishlistItem> {
    const existingItem = Array.from(this.wishlistItems.values()).find(
      (item) => item.userId === insertWishlistItem.userId && item.productId === insertWishlistItem.productId,
    );

    if (existingItem) {
      return existingItem;
    }

    const id = this.currentWishlistId++;
    const wishlistItem: WishlistItem = { ...insertWishlistItem, id, createdAt: new Date() };
    this.wishlistItems.set(id, wishlistItem);
    return wishlistItem;
  }

  async removeFromWishlist(userId: number, productId: number): Promise<void> {
    const itemsToRemove = Array.from(this.wishlistItems.entries())
      .filter(([_, item]) => item.userId === userId && item.productId === productId);
    
    itemsToRemove.forEach(([id, _]) => {
      this.wishlistItems.delete(id);
    });
  }


  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId,
    );
  }

  async addToCart(insertCartItem: InsertCart): Promise<CartItem> {
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => item.userId === insertCartItem.userId && item.productId === insertCartItem.productId,
    );

    if (existingItem) {
      return this.updateCartItem(insertCartItem.userId, insertCartItem.productId, insertCartItem.duration) as Promise<CartItem>;
    }

    const id = this.currentCartId++;
    const cartItem: CartItem = { ...insertCartItem, id, createdAt: new Date() };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(userId: number, productId: number, duration: number): Promise<CartItem | undefined> {
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => item.userId === userId && item.productId === productId,
    );

    if (!existingItem) return undefined;

    const updatedItem = { ...existingItem, duration };
    this.cartItems.set(existingItem.id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(userId: number, productId: number): Promise<void> {
    const itemsToRemove = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.userId === userId && item.productId === productId);
    
    itemsToRemove.forEach(([id, _]) => {
      this.cartItems.delete(id);
    });
  }

  async clearCart(userId: number): Promise<void> {
    const itemsToRemove = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.userId === userId);
    
    itemsToRemove.forEach(([id, _]) => {
      this.cartItems.delete(id);
    });
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async getProducts(filters?: {
    categoryId?: number;
    isTrending?: boolean;
    isNewArrival?: boolean;
  }): Promise<Product[]> {
    let query = db.select().from(products);
    
    if (filters) {
      if (filters.categoryId !== undefined) {
        query = query.where(eq(products.categoryId, filters.categoryId));
      }
      if (filters.isTrending !== undefined) {
        query = query.where(eq(products.isTrending, filters.isTrending));
      }
      if (filters.isNewArrival !== undefined) {
        query = query.where(eq(products.isNewArrival, filters.isNewArrival));
      }
    }
    
    return query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.sku, sku));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async getRentals(userId: number): Promise<Rental[]> {
    return db.select().from(rentals).where(eq(rentals.userId, userId));
  }

  async getRental(id: number): Promise<Rental | undefined> {
    const [rental] = await db.select().from(rentals).where(eq(rentals.id, id));
    return rental;
  }

  async createRental(insertRental: InsertRental): Promise<Rental> {
    const [rental] = await db.insert(rentals).values(insertRental).returning();
    return rental;
  }

  async updateRental(id: number, rentalData: Partial<Rental>): Promise<Rental | undefined> {
    const [updatedRental] = await db
      .update(rentals)
      .set(rentalData)
      .where(eq(rentals.id, id))
      .returning();
    return updatedRental;
  }

  async getWishlistItems(userId: number): Promise<WishlistItem[]> {
    return db.select().from(wishlist).where(eq(wishlist.userId, userId));
  }

  async addToWishlist(insertWishlistItem: InsertWishlist): Promise<WishlistItem> {
    const [existingItem] = await db
      .select()
      .from(wishlist)
      .where(
        and(
          eq(wishlist.userId, insertWishlistItem.userId),
          eq(wishlist.productId, insertWishlistItem.productId)
        )
      );

    if (existingItem) {
      return existingItem;
    }

    const [item] = await db.insert(wishlist).values(insertWishlistItem).returning();
    return item;
  }

  async removeFromWishlist(userId: number, productId: number): Promise<void> {
    await db
      .delete(wishlist)
      .where(
        and(
          eq(wishlist.userId, userId),
          eq(wishlist.productId, productId)
        )
      );
  }

  async getCartItems(userId: number): Promise<CartItem[]> {
    return db.select().from(cart).where(eq(cart.userId, userId));
  }

  async addToCart(insertCartItem: InsertCart): Promise<CartItem> {
    const [existingItem] = await db
      .select()
      .from(cart)
      .where(
        and(
          eq(cart.userId, insertCartItem.userId),
          eq(cart.productId, insertCartItem.productId)
        )
      );

    if (existingItem) {
      return this.updateCartItem(
        insertCartItem.userId,
        insertCartItem.productId,
        insertCartItem.duration
      ) as Promise<CartItem>;
    }

    const [item] = await db.insert(cart).values(insertCartItem).returning();
    return item;
  }

  async updateCartItem(userId: number, productId: number, duration: number): Promise<CartItem | undefined> {
    const [updatedItem] = await db
      .update(cart)
      .set({ duration })
      .where(
        and(
          eq(cart.userId, userId),
          eq(cart.productId, productId)
        )
      )
      .returning();
    return updatedItem;
  }

  async removeFromCart(userId: number, productId: number): Promise<void> {
    await db
      .delete(cart)
      .where(
        and(
          eq(cart.userId, userId),
          eq(cart.productId, productId)
        )
      );
  }

  async clearCart(userId: number): Promise<void> {
    await db.delete(cart).where(eq(cart.userId, userId));
  }
}

export const storage = new MemStorage();
