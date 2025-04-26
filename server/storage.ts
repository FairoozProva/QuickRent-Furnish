import { Session } from 'express-session';

export interface IStorage {
  sessionStore: Session.Store;
  
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