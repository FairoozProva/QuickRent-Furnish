import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Product } from "../shared/schema"; // Adjusted the path to match the project structure
import { setupAuth } from "./auth";
import { firebaseAuth, FirebaseUser } from "./firebase-admin";
import { z } from "zod";

// Custom error class for authentication
class AuthenticationError extends Error {
  constructor(message: string = "Not authenticated") {
    super(message);
    this.name = "AuthenticationError";
  }
}

// Extend Express.User interface
declare global {
  namespace Express {
    interface User {
      _id?: string;
      id?: string;
    }
  }
}

// Helper function to safely handle errors
const isAuthError = (error: unknown): error is AuthenticationError => {
  return error instanceof AuthenticationError;
};

const ALLOWED_DURATIONS = [1, 3, 6, 9, 12];

// Define local schemas since we're not using MongoDB
const insertWishlistSchema = z.object({
  userId: z.string(),
  productId: z.string()
});

const insertCartSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  duration: z.number().int().positive().refine(val => ALLOWED_DURATIONS.includes(val), {
    message: "Duration must be 1, 3, 6, 9, or 12 months"
  })
});

const insertRentalSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  duration: z.number().int().positive().refine(val => ALLOWED_DURATIONS.includes(val), {
    message: "Duration must be 1, 3, 6, 9, or 12 months"
  }),
  totalAmount: z.number().positive(),
  status: z.enum(['pending', 'active', 'completed', 'cancelled', 'signed'])
});

const insertProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  imageUrl: z.string().url(),
  price: z.number().positive(),
  material: z.string().min(2),
  category: z.string().min(2), // Category ID
  trending: z.boolean().optional().default(false),
  isNewProduct: z.boolean().optional().default(false),
  sku: z.string().optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to safely get user ID
  const getUserId = (req: Express.Request): string => {
    if (!req.isAuthenticated() || !req.user?._id) {
      throw new AuthenticationError();
    }
    return req.user._id.toString();
  };

  // Helper function for protected routes
  const protectedRoute = async (req: Express.Request): Promise<string> => {
    if (!req.isAuthenticated()) {
      throw new AuthenticationError();
    }
    const userId = req.user?._id;
    if (!userId) {
      throw new AuthenticationError("User ID not found");
    }
    return userId.toString();
  };

  try {
    // Traditional MongoDB authentication routes (register, login, logout, user)
    setupAuth(app);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Failed to setup authentication routes. Some features will not work.');
      console.warn('⚠️ Error details:', error);
      
      // Setup basic auth endpoints that return appropriate errors
      app.post("/api/register", (_req, res) => {
        res.status(503).json({ error: "MongoDB unavailable - authentication is disabled in development mode" });
      });
      
      app.post("/api/login", (_req, res) => {
        res.status(503).json({ error: "MongoDB unavailable - authentication is disabled in development mode" });
      });
      
      app.post("/api/logout", (_req, res) => {
        res.status(503).json({ error: "MongoDB unavailable - authentication is disabled in development mode" });
      });
      
      app.get("/api/user", (_req, res) => {
        res.status(503).json({ error: "MongoDB unavailable - authentication is disabled in development mode" });
      });
    } else {
      // In production, we want to fail
      throw error;
    }
  }

  // Firebase authentication routes
  
  // Verify Firebase token and get user info
  app.get("/api/firebase/user", firebaseAuth, (req, res) => {
    // The middleware has already added the user to the request
    if (req.firebaseUser) {
      res.json(req.firebaseUser);
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });
  
  // Check if user exists in our database
  app.get("/api/firebase/user/exists", firebaseAuth, async (req, res) => {
    try {
      if (!req.firebaseUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      // Check if the user exists in our db
      const user = await storage.getUserByFirebaseId(req.firebaseUser.uid);
      
      res.json({
        exists: !!user,
        user: user || null
      });
    } catch (error) {
      console.error("Failed to check if user exists:", error);
      res.status(500).json({ error: "Failed to check if user exists" });
    }
  });
  
  // Create or update a user profile in our database
  app.post("/api/firebase/user/profile", firebaseAuth, async (req, res) => {
    try {
      if (!req.firebaseUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      // Check if user already exists
      let user = await storage.getUserByFirebaseId(req.firebaseUser.uid);
      
      if (user) {
        // Update existing user
        user = await storage.updateUserByFirebaseId(
          req.firebaseUser.uid,
          {
            ...req.body,
            email: req.firebaseUser.email || user.email, // Keep email from Firebase if available
            firebaseId: req.firebaseUser.uid
          }
        );
      } else {
        // Create new user
        user = await storage.createUser({
          username: req.body.username || req.firebaseUser.displayName || 'user_' + Date.now(),
          email: req.firebaseUser.email || req.body.email,
          name: req.firebaseUser.displayName || req.body.name || '',
          password: 'firebase_auth_' + Date.now(), // Random password since Firebase handles auth
          firebaseId: req.firebaseUser.uid,
          ...req.body
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Failed to create/update user profile:", error);
      res.status(500).json({ error: "Failed to create/update user profile" });
    }
  });

  // Get user by ID
  app.get("/api/user/get-user/:userId", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      
      if (!user) {
        return res.status(404).json({ 
          message: "User not found"
        });
      }

      // Remove sensitive information
      const userResponse = { ...user };
      delete userResponse.password;
      
      res.json({
        message: "User found",
        user: userResponse
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Update user profile
  app.put("/api/user/profile", async (req, res) => {
    try {
      const userId = await protectedRoute(req);
      
      // Validate request body
      const userData = {
        ...(req.body.firstName && { firstName: req.body.firstName }),
        ...(req.body.lastName && { lastName: req.body.lastName }),
        ...(req.body.email && { email: req.body.email }),
        ...(req.body.phone && { phone: req.body.phone }),
        ...(req.body.address && { address: req.body.address }),
        ...(req.body.city && { city: req.body.city }),
        ...(req.body.state && { state: req.body.state }),
        ...(req.body.zipCode && { zipCode: req.body.zipCode }),
        ...(req.body.country && { country: req.body.country })
      };

      const updatedUser = await storage.updateUser(userId, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Remove sensitive information
      const userResponse = { ...updatedUser };
      delete userResponse.password;

      res.json({
        message: "Profile updated successfully",
        user: userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Failed to update user profile:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });

  // About section
  app.get("/api/about", async (_req, res) => {
    try {
      const aboutSections = [
        { title: "Our Mission", imageUrl: "/src/assets/Sofa Set 5.jpeg", description: "We provide high-quality furniture rentals" },
        { title: "Quality First", imageUrl: "/src/assets/Bed 4.jpeg", description: "Premium furniture for every home" },
        { title: "Easy Process", imageUrl: "/src/assets/Dining Table.jpeg", description: "Simple rental process for your convenience" },
        { title: "Customer Care", imageUrl: "/src/assets/Office Room Setup.jpeg", description: "24/7 support for all your needs" },
        { title: "Affordable", imageUrl: "/src/assets/kitchen.jpeg", description: "Budget-friendly rental options" },
        { title: "Fast Delivery", imageUrl: "/src/assets/Study Table 3.jpeg", description: "Quick and reliable delivery service" }
      ];
      res.json(aboutSections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch about sections" });
    }
  });

  // Categories
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      // Get products for this category
      const products = await storage.getProducts({ categoryId: category._id });
      res.json({ 
        category,
        products 
      });
    } catch (error) {
      console.error("Failed to fetch category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // Route to add a product to a category
  app.post('/api/categories/:slug/products', async (req, res) => {
    const { slug } = req.params;
    const productData = req.body;

    try {
      const category = await storage.getCategoryBySlug(slug);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      const product = new Product({ ...productData, category: category._id });
      await product.save();

      res.status(201).json(product);
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Failed to add product' });
    }
  });

  // Ensure categoryId filter is applied when fetching products for a specific category
  app.get('/category/:slug', async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      const products = await storage.getProducts({ categoryId: category._id });
      res.json({ category, products });
    } catch (error) {
      console.error("Failed to fetch category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const filters: Record<string, any> = {};
      
      if (req.query.categoryId) {
        filters.categoryId = req.query.categoryId;
      }
      if (req.query.trending === "true") {
        filters.trending = true;
      }
      if (req.query.isNewProduct === "true") {
        filters.isNewProduct = true;
      }
      
      const products = await storage.getProducts(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/trending", async (_req, res) => {
    try {
      const products = await storage.getProducts({ trending: true });
      res.json(products);
    } catch (error) {
      console.error("Failed to fetch trending products:", error);
      res.status(500).json({ error: "Failed to fetch trending products" });
    }
  });

  app.get("/api/products/new-arrivals", async (_req, res) => {
    try {
      const products = await storage.getProducts({ isNewProduct: true });
      res.json(products);
    } catch (error) {
      console.error("Failed to fetch new arrivals:", error);
      res.status(500).json({ error: "Failed to fetch new arrivals" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      // Get category information
      const category = await storage.getCategory(product.categoryId.toString());
      
      res.json({
        ...product,
        category: category
      });
    } catch (error) {
      console.error("Failed to fetch product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Related products - returns products in the same category
  app.get("/api/products/:id/related", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const relatedProducts = await storage.getProducts({ categoryId: product.categoryId.toString() });
      // Filter out the current product and limit to 4
      const filteredProducts = relatedProducts
        .filter((p: { _id: string }) => p._id.toString() !== req.params.id)
        .slice(0, 4);
      
      res.json(filteredProducts);
    } catch (error) {
      console.error("Failed to fetch related products:", error);
      res.status(500).json({ error: "Failed to fetch related products" });
    }
  });

  // Create a new product
  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);

      const product = await storage.createProduct(validatedData);
      
      // Transform the response with more meaningful data
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: {
          ...product,
          createdAt: new Date(),
          status: "active",
          category: await storage.getCategory(product.category.toString())
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false,
          error: "Validation failed",
          details: error.errors 
        });
      }
      console.error("Failed to create product:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to create product" 
      });
    }
  });

  // Wishlist
  app.get("/api/wishlist", async (req, res) => {
    try {
      const userId = getUserId(req);
      const wishlistItems = await storage.getWishlistItems(userId);
      
      const productsPromises = wishlistItems.map((item: any) => 
        storage.getProduct(item.productId.toString())
      );
      
      const products = await Promise.all(productsPromises);
      
      const result = wishlistItems.map((item: any, index: number) => ({
        ...item,
        product: products[index]
      }));
      
      res.json(result);
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Failed to fetch wishlist:", error);
      res.status(500).json({ error: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const userId = getUserId(req);
      const validatedData = insertWishlistSchema.parse({
        userId,
        productId: req.body.productId
      });

      const wishlistItem = await storage.addToWishlist(validatedData);
      const product = await storage.getProduct(wishlistItem.productId.toString());
      
      res.status(201).json({
        ...wishlistItem,
        product
      });
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Failed to add to wishlist:", error);
      res.status(500).json({ error: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:productId", async (req, res) => {
    try {
      const userId = getUserId(req);
      await storage.removeFromWishlist(userId, req.params.productId);
      res.sendStatus(204);
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Failed to remove from wishlist:", error);
      res.status(500).json({ error: "Failed to remove from wishlist" });
    }
  });

  app.get("/api/wishlist/check/:productId", async (req, res) => {
    try {
      const userId = getUserId(req);
      const isInWishlist = await storage.isInWishlist(userId, req.params.productId);
      res.json({ isInWishlist });
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Failed to check wishlist:", error);
      res.status(500).json({ error: "Failed to check wishlist" });
    }
  });

  // Cart
  app.get("/api/cart", async (req, res) => {
    try {
      const userId = getUserId(req);
      const cartItems = await storage.getCartItems(userId);
      
      // Get full product details for each cart item
      const productsPromises = cartItems.map((item: any) => 
        storage.getProduct(item.productId.toString())
      );
      
      const products = await Promise.all(productsPromises);
      
      // Combine cart items with product details
      const result = cartItems.map((item: any, index: number) => ({
        ...item,
        product: products[index]
      }));
      
      res.json(result);
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Failed to fetch cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const userId = await protectedRoute(req);
      const validatedData = insertCartSchema.parse({
        userId,
        productId: req.body.productId,
        duration: req.body.duration || 3 // Default to 3 months
      });

      const cartItem = await storage.addToCart(validatedData);
      
      // Get product details
      const product = await storage.getProduct(cartItem.productId.toString());
      
      res.status(201).json({
        ...cartItem,
        product
      });
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Failed to add to cart:", error);
      res.status(500).json({ error: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:productId", async (req, res) => {
    try {
      const userId = getUserId(req);
      const duration = parseInt(req.body.duration);
      if (isNaN(duration) || duration < 1) {
        return res.status(400).json({ error: "Invalid duration" });
      }

      const updatedItem = await storage.updateCartItem(
        userId,
        req.params.productId,
        duration
      );

      if (!updatedItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      // Get product details
      const product = await storage.getProduct(updatedItem.productId.toString());
      
      res.json({
        ...updatedItem,
        product
      });
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Failed to update cart item:", error);
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:productId", async (req, res) => {
    try {
      const userId = getUserId(req);
      await storage.removeFromCart(userId, req.params.productId);
      res.sendStatus(204);
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Failed to remove from cart:", error);
      res.status(500).json({ error: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const userId = getUserId(req);
      await storage.clearCart(userId);
      res.sendStatus(204);
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Failed to clear cart:", error);
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  app.get("/api/cart/check/:productId", async (req, res) => {
    try {
      const userId = getUserId(req);
      const isInCart = await storage.isInCart(userId, req.params.productId);
      res.json({ isInCart });
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Failed to check cart:", error);
      res.status(500).json({ error: "Failed to check cart" });
    }
  });

  // Rentals
  app.get("/api/rentals", async (req, res) => {
    try {
      const userId = await protectedRoute(req);
      const rentals = await storage.getRentals(userId);
      
      // Get full product details for each rental
      const productsPromises = rentals.map((rental: any) => 
        storage.getProduct(rental.productId.toString())
      );
      
      const products = await Promise.all(productsPromises);
      
      // Combine rentals with product details
      const result = rentals.map((rental: any, index: number) => ({
        ...rental,
        product: products[index]
      }));
      
      res.json(result);
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Failed to fetch rentals:", error);
      res.status(500).json({ error: "Failed to fetch rentals" });
    }
  });

  // Create rental from cart
  app.post("/api/rentals", async (req, res) => {
    try {
      const userId = await protectedRoute(req);
      // Get cart items
      const cartItems = await storage.getCartItems(userId);
      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      // Create rentals for each cart item
      const rentalPromises = cartItems.map(async (item: any) => {
        const product = await storage.getProduct(item.productId.toString());
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + item.duration);

        const totalAmount = product.price * item.duration;

        const rentalData = {
          userId,
          productId: item.productId.toString(),
          startDate,
          endDate,
          duration: item.duration,
          totalAmount,
          status: 'pending' as const
        };

        return storage.createRental(rentalData);
      });

      const rentals = await Promise.all(rentalPromises);

      // Clear the cart after creating rentals
      await storage.clearCart(userId);

      res.status(201).json(rentals);
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Failed to create rentals:", error);
      res.status(500).json({ error: "Failed to create rentals" });
    }
  });

  // Extend a rental
  app.put("/api/rentals/:id/extend", async (req, res) => {
    try {
      const userId = await protectedRoute(req);
      const rentalId = req.params.id;
      
      const { duration } = req.body;
      if (!duration || isNaN(duration) || duration < 1) {
        return res.status(400).json({ error: "Invalid duration" });
      }
      
      // Get the rental
      const rental = await storage.getRental(rentalId);
      if (!rental) {
        return res.status(404).json({ error: "Rental not found" });
      }
      
      // Verify the rental belongs to the user
      if (rental.userId.toString() !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      // Calculate new end date
      const endDate = new Date(rental.endDate);
      endDate.setMonth(endDate.getMonth() + duration);
      
      // Update the rental
      const updatedRental = await storage.updateRental(rentalId, {
        endDate,
        duration: rental.duration + duration
      });
      
      res.json(updatedRental);
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Failed to extend rental:", error);
      res.status(500).json({ error: "Failed to extend rental" });
    }
  });

  // Get a rental agreement
  app.get("/api/rentals/:id/agreement", async (req, res) => {
    try {
      const userId = await protectedRoute(req);
      const rentalId = req.params.id;
      
      // Get the rental
      const rental = await storage.getRental(rentalId);
      if (!rental) {
        return res.status(404).json({ error: "Rental not found" });
      }
      
      // Verify the rental belongs to the user
      if (rental.userId.toString() !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      // Get the product
      const product = await storage.getProduct(rental.productId.toString());
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      // Get the user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Return the rental agreement data
      res.json({
        rental,
        product,
        user
      });
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Failed to get rental agreement:", error);
      res.status(500).json({ error: "Failed to get rental agreement" });
    }
  });
  
  // Sign a rental agreement
  app.post("/api/rentals/:id/sign", async (req, res) => {
    try {
      const userId = await protectedRoute(req);
      const rentalId = req.params.id;
      
      const { paymentMethod } = req.body;
      if (!paymentMethod) {
        return res.status(400).json({ error: "Payment method is required" });
      }
      
      // Get the rental
      const rental = await storage.getRental(rentalId);
      if (!rental) {
        return res.status(404).json({ error: "Rental not found" });
      }
      
      // Verify the rental belongs to the user
      if (rental.userId.toString() !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      // Update the rental with the signed status and payment method
      const updatedRental = await storage.updateRental(rentalId, {
        status: "signed",
        paymentMethod
      });
      
      res.json(updatedRental);
    } catch (error) {
      if (isAuthError(error)) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Failed to sign rental agreement:", error);
      res.status(500).json({ error: "Failed to sign rental agreement" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
