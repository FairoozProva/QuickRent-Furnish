import mongoose from 'mongoose';
import { z } from 'zod';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  firebaseId: { type: String, sparse: true, unique: true }, // For Firebase authentication
  photoURL: { type: String }, // From Firebase user profile
  createdAt: { type: Date, default: Date.now }
});

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String, required: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  displayOrder: { type: Number, default: 1 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Product Schema
const productSchema = new mongoose.Schema({
  productCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  description: { type: String, required: true },
  materials: [{ type: String }],
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    unit: { type: String, default: 'cm' }
  },
  pricePerMonth: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  minRentalPeriod: { type: Number, default: 3 },
  stock: { type: Number, default: 1 },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  isNewProduct: { type: Boolean, default: false }, // Renamed from isNew to avoid Mongoose reserved keyword
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { suppressReservedKeysWarning: true });

// Rental Schema
const rentalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true, enum: ['pending', 'active', 'completed', 'cancelled', 'signed'] },
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
export const Product = mongoose.model('Product', productSchema);
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
  image: z.string().url(),
  parentCategory: z.string().nullable().optional(),
  displayOrder: z.number().int().positive().default(1),
  active: z.boolean().default(true)
});

export const insertProductSchema = z.object({
  productCode: z.string().min(2),
  name: z.string().min(2),
  category: z.string().min(2),
  subcategory: z.string().optional(),
  description: z.string().min(10),
  materials: z.array(z.string()).optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    unit: z.string().default('cm')
  }).optional(),
  pricePerMonth: z.number().positive(),
  securityDeposit: z.number().positive(),
  minRentalPeriod: z.number().positive().default(3),
  stock: z.number().int().nonnegative().default(1),
  images: z.array(z.string()),
  featured: z.boolean().default(false),
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
  image: string;
  parentCategory?: mongoose.Types.ObjectId | null;
  displayOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductDocument = mongoose.Document & {
  productCode: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  materials?: string[];
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: string;
  };
  pricePerMonth: number;
  securityDeposit: number;
  minRentalPeriod: number;
  stock: number;
  images: string[];
  featured: boolean;
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
