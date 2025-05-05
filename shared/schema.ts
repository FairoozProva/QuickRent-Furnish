import mongoose from 'mongoose';
import { z } from 'zod';


/* const isReplitEnv = process.env.REPLIT_DB_URL ? true : false;


if (isReplitEnv) {
  
  
  // Save the original model function
  const originalModel = mongoose.model.bind(mongoose);
  
  // Override the model function to avoid recreating models
  mongoose.model = function(name: string, schema?: mongoose.Schema): mongoose.Model<any> {
    try {
      // First try to get existing model to avoid OverwriteModelError
      return mongoose.models[name] || originalModel(name, schema);
    } catch (error) {
      // If error, create new model
      return originalModel(name, schema);
    }
  };
} */

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  firebaseId: { type: String, sparse: true, unique: true }, // For Firebase authentication
  photoURL: { type: String }, // From Firebase user profile
  createdAt: { type: Date, default: Date.now },
  phone: { type: String },
  address: { type: String }
});

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  imageUrl: { type: String, required: true }, // Changed from image to imageUrl
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  displayOrder: { type: Number, default: 1 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  material: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  trending: { type: Boolean, default: false },
  isNewProduct: { type: Boolean, default: false },
  sku: { type: String }
});

export const Product = mongoose.model('Product', productSchema);

// Rental Schema
const rentalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true, enum: ['pending', 'active', 'completed', 'cancelled', 'signed'], default: 'pending' },
  paymentMethod: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  duration: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create models
export const User = mongoose.model('User', userSchema);
export const Category = mongoose.model('Category', categorySchema);
export const Rental = mongoose.model('Rental', rentalSchema);
export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export const Cart = mongoose.model('Cart', cartSchema);

// Zod schemas for validation
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
  imageUrl: z.string().url(), // Changed from image to imageUrl
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

// TypeScript types
export type UserDocument = mongoose.Document & {
  username: string;
  password: string;
  name: string;
  email: string;
  firebaseId?: string;
  photoURL?: string;
  createdAt: Date;
};

export type CategoryDocument = mongoose.Document & {
  name: string;
  slug: string;
  description?: string;
  imageUrl: string; // Changed from image to imageUrl
  parentCategory?: mongoose.Types.ObjectId | null;
  displayOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductDocument = mongoose.Document & {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  material: string;
  category: mongoose.Types.ObjectId;
  trending: boolean;
  isNewProduct: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type RentalDocument = mongoose.Document & {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  duration: number;
  totalAmount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'signed';
  paymentMethod?: string;
  createdAt: Date;
};

export type WishlistDocument = mongoose.Document & {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  createdAt: Date;
};

export type CartDocument = mongoose.Document & {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  duration: number;
  createdAt: Date;
};

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
