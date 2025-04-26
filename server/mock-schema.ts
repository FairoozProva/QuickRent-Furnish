// This file provides mock implementations of the schema models for Replit environment
import { z } from 'zod';

console.log('Using mock schema implementation for Replit environment');

// Mock models that return simple objects instead of actual mongoose models
class MockModel {
  private data: any[] = [];
  private modelName: string;
  
  constructor(modelName: string) {
    this.modelName = modelName;
    console.log(`Created mock model: ${modelName}`);
  }
  
  async find(query: any = {}): Promise<any[]> {
    console.log(`Mock ${this.modelName}.find called with query:`, query);
    return this.data;
  }
  
  async findById(id: string): Promise<any | null> {
    console.log(`Mock ${this.modelName}.findById called with id:`, id);
    return this.data.find(item => item._id === id) || null;
  }
  
  async findOne(query: any = {}): Promise<any | null> {
    console.log(`Mock ${this.modelName}.findOne called with query:`, query);
    // Simple implementation to match by first property
    const key = Object.keys(query)[0];
    if (!key) return null;
    return this.data.find(item => item[key] === query[key]) || null;
  }
  
  async save(doc: any): Promise<any> {
    console.log(`Mock ${this.modelName}.save called with doc:`, doc);
    const newDoc = { ...doc, _id: String(this.data.length + 1) };
    this.data.push(newDoc);
    return newDoc;
  }
  
  async lean(): Promise<any> {
    return this;
  }
  
  populate(field: string): any {
    return this;
  }
  
  // Add initial data to the model
  seed(initialData: any[]): void {
    this.data = [...initialData];
    console.log(`Seeded ${this.modelName} with ${initialData.length} items`);
  }
}

// Create mock models
export const User = new MockModel('User');
export const Category = new MockModel('Category');
export const Product = new MockModel('Product');
export const Rental = new MockModel('Rental');
export const Wishlist = new MockModel('Wishlist');
export const Cart = new MockModel('Cart');

// Seed with sample data
Category.seed([
  { 
    _id: '1', 
    name: 'Living Room', 
    slug: 'living-room', 
    description: 'Furniture for your living room', 
    imageUrl: 'https://images.unsplash.com/photo-1486304873000-235643847519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80'
  },
  { 
    _id: '2', 
    name: 'Bedroom', 
    slug: 'bedroom', 
    description: 'Furniture for your bedroom',
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80' 
  },
  { 
    _id: '3', 
    name: 'Dining Room', 
    slug: 'dining-room', 
    description: 'Furniture for your dining room',
    imageUrl: 'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80' 
  },
  { 
    _id: '4', 
    name: 'Office', 
    slug: 'office', 
    description: 'Furniture for your home office',
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80' 
  },
]);

Product.seed([
  { 
    _id: '1', 
    name: 'Modern Sofa', 
    sku: 'SOF-001', 
    description: 'A comfortable modern sofa', 
    price: 199, 
    material: 'Leather',
    category: '1', 
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80', 
    trending: true 
  },
  { 
    _id: '2', 
    name: 'Wooden Coffee Table', 
    sku: 'TBL-001', 
    description: 'Sturdy wooden coffee table', 
    price: 99, 
    material: 'Wood',
    category: '1', 
    imageUrl: 'https://images.unsplash.com/photo-1601391703731-43651f2eb9bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80', 
    isNewProduct: true 
  },
  { 
    _id: '3', 
    name: 'King Size Bed', 
    sku: 'BED-001', 
    description: 'Comfortable king size bed', 
    price: 299, 
    material: 'Wood',
    category: '2', 
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80', 
    trending: true, 
    isNewProduct: true 
  },
  { 
    _id: '4', 
    name: 'Dining Table Set', 
    sku: 'DIN-001', 
    description: '6-seater dining table with chairs', 
    price: 349, 
    material: 'Wood',
    category: '3', 
    imageUrl: 'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80', 
    trending: false, 
    isNewProduct: true 
  },
  { 
    _id: '5', 
    name: 'Office Desk', 
    sku: 'OFF-001', 
    description: 'Modern office desk', 
    price: 199, 
    material: 'Wood',
    category: '4', 
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=400&q=80', 
    trending: true, 
    isNewProduct: false 
  },
]);

User.seed([
  {
    _id: '1',
    username: 'demo',
    email: 'demo@example.com',
    name: 'Demo User',
    password: '$2b$10$Og2VcS6MVhyWxEPk3yPJr.9Qck0jiV8HSTDWORIQTbwBr7YqXBKhm', // "password"
    firebaseId: 'demo123',
    createdAt: new Date(),
  }
]);

// Zod schemas for validation - these remain the same as the original schema
export const insertUserSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6),
  name: z.string().min(2),
  email: z.string().email(),
  firebaseId: z.string().optional(),
  photoURL: z.string().optional()
});

export const insertCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  parentCategory: z.string().nullable().optional(),
  displayOrder: z.number().int().positive().default(1),
  active: z.boolean().default(true)
});

export const insertProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  imageUrl: z.string().url(),
  price: z.number().positive(),
  material: z.string().min(2),
  category: z.string().min(2),
  trending: z.boolean().default(false),
  isNewProduct: z.boolean().default(false)
});

export const insertRentalSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  duration: z.number().positive(),
  totalAmount: z.number().positive(),
  status: z.enum(['pending', 'active', 'completed', 'cancelled', 'signed']),
  paymentMethod: z.string().optional()
});

export const insertWishlistSchema = z.object({
  userId: z.string(),
  productId: z.string()
});

export const insertCartSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  duration: z.number().positive()
});

// Export other items to maintain compatibility with the original schema
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertRental = z.infer<typeof insertRentalSchema>;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type InsertCart = z.infer<typeof insertCartSchema>;

export const users = User;
export const categories = Category;
export const products = Product;
export const rentals = Rental;
export const wishlist = Wishlist;
export const cart = Cart;