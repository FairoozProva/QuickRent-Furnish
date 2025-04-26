import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertCartSchema, insertWishlistSchema } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes (register, login, logout, user)
  setupAuth(app);

  // Categories
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const filters: any = {};
      
      if (req.query.categoryId) {
        filters.categoryId = req.query.categoryId as string;
      }
      if (req.query.isTrending === "true") {
        filters.isTrending = true;
      }
      if (req.query.isNewArrival === "true") {
        filters.isNewArrival = true;
      }
      
      const products = await storage.getProducts(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/trending", async (_req, res) => {
    try {
      const products = await storage.getProducts({ isTrending: true });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trending products" });
    }
  });

  app.get("/api/products/new-arrivals", async (_req, res) => {
    try {
      const products = await storage.getProducts({ isNewArrival: true });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch new arrivals" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id, 10);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Related products - returns products in the same category
  app.get("/api/products/:id/related", async (req, res) => {
    try {
      const productId = parseInt(req.params.id, 10);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const relatedProducts = await storage.getProducts({ categoryId: product.categoryId });
      const filteredProducts = relatedProducts.filter(p => p.id !== productId).slice(0, 4);
      res.json(filteredProducts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch related products" });
    }
  });

  // Wishlist
  app.get("/api/wishlist", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const wishlistItems = await storage.getWishlistItems(req.user!.id);
      const productsPromises = wishlistItems.map(item => storage.getProduct(item.productId));
      const products = await Promise.all(productsPromises);

      const result = wishlistItems.map((item, index) => ({
        ...item,
        product: products[index]
      }));

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const validatedData = insertWishlistSchema.parse({
        userId: req.user!.id,
        productId: req.body.productId
      });

      const wishlistItem = await storage.addToWishlist(validatedData);
      res.status(201).json(wishlistItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:productId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const productId = parseInt(req.params.productId, 10);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      await storage.removeFromWishlist(req.user!.id, productId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from wishlist" });
    }
  });

  // Cart
  app.get("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const cartItems = await storage.getCartItems(req.user!.id);
      
      // Get full product details for each cart item
      const productsPromises = cartItems.map(item => 
        storage.getProduct(item.productId.toString())
      );
      
      const products = await Promise.all(productsPromises);
      
      // Combine cart items with product details
      const result = cartItems.map((item, index) => ({
        ...item,
        product: products[index]
      }));
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const validatedData = insertCartSchema.parse({
        userId: req.user!.id,
        productId: req.body.productId,
        duration: req.body.duration || 3 // Default to 3 months
      });

      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:productId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const productId = parseInt(req.params.productId, 10);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const duration = parseInt(req.body.duration);
      if (isNaN(duration) || duration < 1) {
        return res.status(400).json({ error: "Invalid duration" });
      }

      const updatedItem = await storage.updateCartItem(
        req.user!.id, 
        productId, 
        duration
      );

      if (!updatedItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:productId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const productId = parseInt(req.params.productId, 10);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      await storage.removeFromCart(req.user!.id, productId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      await storage.clearCart(req.user!.id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // Rentals
  app.get("/api/rentals", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const rentals = await storage.getRentals(req.user!.id);
      
      // Get full product details for each rental
      const productsPromises = rentals.map(rental => 
        storage.getProduct(rental.productId.toString())
      );
      
      const products = await Promise.all(productsPromises);
      
      // Combine rentals with product details
      const result = rentals.map((rental, index) => ({
        ...rental,
        product: products[index]
      }));
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rentals" });
    }
  });

  // Extend a rental
  app.put("/api/rentals/:id/extend", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const rentalId = parseInt(req.params.id, 10);
      if (isNaN(rentalId)) {
        return res.status(400).json({ error: "Invalid rental ID" });
      }
      
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
      if (rental.userId !== req.user!.id) {
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
      res.status(500).json({ error: "Failed to extend rental" });
    }
  });

  // Get a rental agreement
  app.get("/api/rentals/:id/agreement", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const rentalId = parseInt(req.params.id, 10);
      if (isNaN(rentalId)) {
        return res.status(400).json({ error: "Invalid rental ID" });
      }
      
      // Get the rental
      const rental = await storage.getRental(rentalId);
      if (!rental) {
        return res.status(404).json({ error: "Rental not found" });
      }
      
      // Verify the rental belongs to the user
      if (rental.userId !== req.user!.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      // Get the product
      const product = await storage.getProduct(rental.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      // Get the user
      const user = await storage.getUser(req.user!.id);
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
      res.status(500).json({ error: "Failed to get rental agreement" });
    }
  });
  
  // Sign a rental agreement
  app.post("/api/rentals/:id/sign", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const rentalId = parseInt(req.params.id, 10);
      if (isNaN(rentalId)) {
        return res.status(400).json({ error: "Invalid rental ID" });
      }
      
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
      if (rental.userId !== req.user!.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      // Update the rental with the signed status and payment method
      const updatedRental = await storage.updateRental(rentalId, {
        status: "signed",
        paymentMethod
      });
      
      res.json(updatedRental);
    } catch (error) {
      res.status(500).json({ error: "Failed to sign rental agreement" });
    }
  });

  app.post("/api/checkout", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      // Update user information first
      const user = await storage.updateUser(req.user!.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        country: req.body.country
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get cart items
      const cartItems = await storage.getCartItems(req.user!.id);
      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      // Create rental for each cart item
      const today = new Date();
      const rentals = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }

          const endDate = new Date(today);
          endDate.setMonth(endDate.getMonth() + item.duration);

          return storage.createRental({
            userId: req.user!.id,
            productId: item.productId,
            duration: item.duration,
            startDate: today,
            endDate: endDate,
            monthlyRate: product.price,
            status: "active"
          });
        })
      );

      // Clear the cart
      await storage.clearCart(req.user!.id);

      res.status(201).json({ success: true, rentals });
    } catch (error) {
      res.status(500).json({ error: "Failed to process checkout" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
