#!/usr/bin/env ts-node
import { MongoDBStorage } from '../server/mongo-storage';
import { mongoose } from '../server/mongodb';

async function seedAllProducts() {
  console.log("Seeding all products...");
  const storage = new MongoDBStorage();

  const allProducts = [
    // Living Room Products
    { name: "Boho Sofa", productCode: "boho-sofa-001", description: "A stylish and comfortable sofa for your living room.", price: 1000, imageUrl: "/src/assets/Sofa Set 1.jpeg", material: "Fabric, Wood", categoryId: "living-room", trending: true },
    { name: "Sofa Set 2", productCode: "sofa-set-002", description: "A comfortable and stylish sofa set.", price: 500, imageUrl: "/src/assets/Sofa Set 2.jpeg", material: "Fabric, Wood", categoryId: "living-room", isNewProduct: true },
    { name: "5 seated Sofa Set", productCode: "sofa-set-003", description: "A comfortable and stylish sofa set.", price: 800, imageUrl: "/src/assets/Sofa Set 3.jpeg", material: "Fabric, Wood", categoryId: "living-room" },
    { name: "L Sofa Set", productCode: "sofa-set-004", description: "A comfortable and stylish sofa set.", price: 1500, imageUrl: "/src/assets/Sofa Set 4.jpeg", material: "Fabric, Wood", categoryId: "living-room" },
    { name: "Wooden Sofa Set", productCode: "sofa-set-005", description: "A comfortable and stylish sofa set.", price: 1000, imageUrl: "/src/assets/Sofa Set 5.jpeg", material: "Fabric, Wood", categoryId: "living-room" },
    { name: "6 seated Sofa Set", productCode: "sofa-set-006", description: "A comfortable and stylish sofa set.", price: 2000, imageUrl: "/src/assets/Sofa Set 6.jpeg", material: "Fabric, Wood", categoryId: "living-room" },
    { name: "White Sofa Set", productCode: "sofa-set-007", description: "A comfortable and stylish sofa set.", price: 2000, imageUrl: "/src/assets/Sofa Set 7.jpeg", material: "Fabric, Wood", categoryId: "living-room" },

    // Bedroom Products
    { name: "Queen Size Bed", productCode: "queen-bed-001", description: "A spacious and comfortable queen size bed.", price: 1200, imageUrl: "/src/assets/Bed 1.jpeg", material: "Wood, Foam", categoryId: "bedroom", trending: true },
    { name: "Modern Bed Frame", productCode: "bed-frame-002", description: "A sleek and modern bed frame for your bedroom.", price: 1500, imageUrl: "/src/assets/Bed 2.jpeg", material: "Metal, Wood", categoryId: "bedroom", isNewProduct: true },
    { name: "Hargrove Bed", productCode: "hargrove-bed-003", description: "A stylish bed with a unique design.", price: 1800, imageUrl: "/src/assets/Hargrove Bed.jpeg", material: "Wood, Fabric", categoryId: "bedroom" },
    { name: "Elina Queen Size Platform Bed", productCode: "elina-bed-004", description: "A premium queen size platform bed for a luxurious bedroom experience.", price: 2500, imageUrl: "/src/assets/Elina Queen Size Platform Bed.jpeg", material: "Wood, Upholstery", categoryId: "bedroom" },

    // Office Products
    { name: "Large Executive Desk With File Cabinet", productCode: "exec-desk-001", description: "A spacious executive desk with an integrated file cabinet for office use.", price: 3000, imageUrl: "/src/assets/Large Executive Desk With File Cabinet.jpeg", material: "Wood, Metal", categoryId: "office", trending: true, isNewProduct: true },
    { name: "Modern Office Chair", productCode: "office-chair-002", description: "A sleek and comfortable office chair for modern workspaces.", price: 1200, imageUrl: "/src/assets/Modern Office Chair.jpeg", material: "Fabric, Metal", categoryId: "office", trending: true, isNewProduct: false },

    // Study Products
    { name: "Modern Study Table", productCode: "study-table-001", description: "A sleek and modern study table for students and professionals.", price: 1200, imageUrl: "/src/assets/Study Table 1.jpeg", material: "Wood, Metal", categoryId: "study", isNewProduct: true },
    { name: "Compact Study Table", productCode: "study-table-002", description: "A compact study table perfect for small spaces.", price: 800, imageUrl: "/src/assets/Study Table 2.jpeg", material: "Wood, Plastic", categoryId: "study" },

    // Kitchen Products
    { name: "Modern Kitchen Setup", productCode: "kitchen-setup-001", description: "A sleek and modern kitchen setup with all essentials.", price: 5000, imageUrl: "/src/assets/kitchen Setup.jpeg", material: "Wood, Metal", categoryId: "kitchen", trending: true, isNewProduct: true },
    { name: "Small Kitchen Setup", productCode: "kitchen-setup-002", description: "A compact kitchen setup perfect for small spaces.", price: 3000, imageUrl: "/src/assets/Small Kitchen.jpeg", material: "Wood, Plastic", categoryId: "kitchen" },

    // Dining Products
    { name: "Dining Table 5555", productCode: "dining-table-001", description: "A spacious dining table for family meals.", price: 4000, imageUrl: "/src/assets/Dining Table 5555.jpeg", material: "Wood, Glass", categoryId: "dining" },
    { name: "Dining Table KIU85", productCode: "dining-table-002", description: "A modern dining table with a sleek design.", price: 3500, imageUrl: "/src/assets/Dining Table KIU85.jpeg", material: "Wood, Metal", categoryId: "dining" },

    // New Trending Products
    { 
      name: "Storage Bed", 
      productCode: "bed-storage-001", 
      description: "A modern bed with built-in storage solutions", 
      price: 700, 
      imageUrl: "/src/assets/Bed 1.jpeg", 
      material: "Wood", 
      categoryId: "bedroom", 
      trending: true 
    },
    { 
      name: "Neutral Office Chair", 
      productCode: "office-chair-neutral-001", 
      description: "A comfortable neutral-colored office chair", 
      price: 500, 
      imageUrl: "/src/assets/Neutral Office Chair.jpeg", 
      material: "Fabric, Metal", 
      categoryId: "office", 
      trending: true 
    },
    { 
      name: "Wooden Study Table", 
      productCode: "study-table-wood-001", 
      description: "A classic wooden study table", 
      price: 300, 
      imageUrl: "/src/assets/Study Table 6.jpeg", 
      material: "Wood", 
      categoryId: "study", 
      trending: true 
    },

    // New Arrivals
    { 
      name: "White Study Table", 
      productCode: "study-table-white-001", 
      description: "A modern white study table", 
      price: 300, 
      imageUrl: "/src/assets/Study Table 1.jpeg", 
      material: "Wood, Metal", 
      categoryId: "study", 
      isNewProduct: true 
    },
    { 
      name: "Boho Sofa", 
      productCode: "sofa-boho-001", 
      description: "A stylish boho-themed sofa", 
      price: 1000, 
      imageUrl: "/src/assets/Sofa Set 1.jpeg", 
      material: "Fabric, Wood", 
      categoryId: "living-room", 
      isNewProduct: true 
    },
    { 
      name: "Bed ER6456", 
      productCode: "bed-er6456", 
      description: "A modern and comfortable bed", 
      price: 800, 
      imageUrl: "/src/assets/Bed 4.jpeg", 
      material: "Wood, Metal", 
      categoryId: "bedroom", 
      isNewProduct: true 
    }
  ];

  try {
    await storage.connect();

    // Clear existing products first
    await mongoose.connection.collection("products").deleteMany({});
    console.log("Cleared existing products");

    // Insert products in smaller batches
    const batchSize = 10;
    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize);
      await mongoose.connection.collection("products").insertMany(batch);
      console.log(`Inserted batch ${i / batchSize + 1}`);
    }

    console.log("All products seeded successfully.");
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await mongoose.disconnect();
  }
}


seedAllProducts();
