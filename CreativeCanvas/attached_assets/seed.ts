import { db } from "./db";
import { categories, products, users } from "../shared/schema";

// Sample data for the application
const sampleCategories = [
  { name: "Sofa Set", slug: "sofa-set", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { name: "Bedroom", slug: "bedroom", imageUrl: "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { name: "Dining", slug: "dining", imageUrl: "https://images.unsplash.com/photo-1615066390971-01df3ab9facb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { name: "Living", slug: "living", imageUrl: "https://images.unsplash.com/photo-1567016376408-0226e4d0b1ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { name: "Study", slug: "study", imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { name: "Metal", slug: "metal", imageUrl: "https://images.unsplash.com/photo-1542061651-ede3359ae6e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" }
];

// Create a function to seed the database
async function seedDatabase() {
  console.log("Seeding database...");
  
  try {
    // Insert sample categories
    console.log("Inserting sample categories...");
    const insertedCategories = await db.insert(categories).values(sampleCategories).returning();
    console.log(`Inserted ${insertedCategories.length} categories.`);
    
    // Map of category names to IDs
    const categoryMap = new Map(insertedCategories.map(cat => [cat.name, cat.id]));
    
    // Insert sample products
    console.log("Inserting sample products...");
    const sampleProducts = [
      { 
        name: "Bookshelf MINI-PK", 
        sku: "BOOKSHELF-MINI-PK", 
        description: "A sleek, modern bookshelf for your home or office.",
        price: 4500, 
        categoryId: categoryMap.get("Study"), 
        imageUrl: "https://images.unsplash.com/photo-1591129841117-3adfd313a592?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dimensions: "120x40x180 cm",
        color: "Walnut",
        material: "Wood",
        isTrending: true,
        isNewArrival: false
      },
      { 
        name: "Red Sofa-Z7D", 
        sku: "RED-SOFA-Z7D", 
        description: "A vibrant red sofa to add color to your living room.",
        price: 12000, 
        categoryId: categoryMap.get("Sofa Set"), 
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dimensions: "220x90x80 cm",
        color: "Red",
        material: "Fabric, Wood",
        seats: 3,
        isTrending: true,
        isNewArrival: false
      },
      { 
        name: "Wooden Bed-MKDST-T18", 
        sku: "WOODEN-BED-MKDST-T18", 
        description: "A sturdy wooden bed frame with a simple, elegant design.",
        price: 9000, 
        categoryId: categoryMap.get("Bedroom"), 
        imageUrl: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dimensions: "200x160x40 cm",
        color: "Natural Wood",
        material: "Solid Wood",
        isTrending: true,
        isNewArrival: false
      },
      { 
        name: "Mini Desk-MX1-Y70", 
        sku: "MINI-DESK-MX1-Y70", 
        description: "A compact desk perfect for small spaces or as a secondary workspace.",
        price: 3500, 
        categoryId: categoryMap.get("Study"), 
        imageUrl: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dimensions: "100x60x75 cm",
        color: "White",
        material: "MDF, Metal",
        isTrending: true,
        isNewArrival: false
      },
      { 
        name: "Computer Table-KCT2", 
        sku: "COMPUTER-TABLE-KCT2", 
        description: "A functional computer desk with storage compartments.",
        price: 6000, 
        categoryId: categoryMap.get("Study"), 
        imageUrl: "https://images.unsplash.com/photo-1589584649628-b597067e07a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dimensions: "120x60x75 cm",
        color: "Black",
        material: "MDF, Metal",
        isTrending: false,
        isNewArrival: true
      },
      { 
        name: "Kitchen Cabinet Small Organizer", 
        sku: "KITCHEN-CABINET-SO", 
        description: "A versatile small cabinet for kitchen organization.",
        price: 3000, 
        categoryId: categoryMap.get("Dining"), 
        imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dimensions: "60x40x90 cm",
        color: "White",
        material: "MDF",
        isTrending: false,
        isNewArrival: true
      },
      { 
        name: "Sofa Melvin-250", 
        sku: "SOFA-MELVIN-250", 
        description: "A sleek, modern sofa featuring a minimalist design with plush cushions. Perfect for contemporary living spaces.",
        price: 12000, 
        categoryId: categoryMap.get("Sofa Set"), 
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dimensions: "230x110 cm",
        color: "White-Blue",
        material: "Fabric, Wood",
        seats: 3,
        isTrending: false,
        isNewArrival: false
      },
      { 
        name: "Sofa Nottingham-Z43", 
        sku: "SOFA-NOTTINGHAM-Z43", 
        description: "A comfortable yellow sofa with ample seating space.",
        price: 15000, 
        categoryId: categoryMap.get("Sofa Set"), 
        imageUrl: "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dimensions: "250x120 cm",
        color: "Yellow",
        material: "Fabric, Wood",
        seats: 3,
        isTrending: false,
        isNewArrival: false
      },
      { 
        name: "Sofa RLX-230", 
        sku: "SOFA-RLX-230", 
        description: "A light blue sofa with a relaxed, casual style.",
        price: 11000, 
        categoryId: categoryMap.get("Sofa Set"), 
        imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dimensions: "220x100 cm",
        color: "Light Blue",
        material: "Fabric, Wood",
        seats: 3,
        isTrending: false,
        isNewArrival: false
      },
      { 
        name: "Modern L-Shaped Sofa", 
        sku: "MODERN-L-SHAPED-SOFA", 
        description: "A spacious L-shaped sofa perfect for family rooms.",
        price: 18000, 
        categoryId: categoryMap.get("Sofa Set"), 
        imageUrl: "https://images.unsplash.com/photo-1506780789220-9e96ccefb527?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dimensions: "300x180 cm",
        color: "White-Gray",
        material: "Fabric, Wood",
        seats: 5,
        isTrending: false,
        isNewArrival: false
      },
      { 
        name: "Velvet L-Shaped Custom", 
        sku: "VELVET-L-SHAPED-CUSTOM", 
        description: "A luxurious blue velvet L-shaped sofa.",
        price: 19000, 
        categoryId: categoryMap.get("Sofa Set"), 
        imageUrl: "https://images.unsplash.com/photo-1584054422729-505d28be96cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dimensions: "280x170 cm",
        color: "Blue",
        material: "Velvet, Wood",
        seats: 4,
        isTrending: false,
        isNewArrival: false
      },
      { 
        name: "SOFA_COLLECTION5", 
        sku: "SOFA-COLLECTION5", 
        description: "A balanced black and tan sofa design.",
        price: 13000, 
        categoryId: categoryMap.get("Sofa Set"), 
        imageUrl: "https://images.unsplash.com/photo-1605818599703-ccc5533187e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dimensions: "200x100 cm",
        color: "Black/Tan",
        material: "Fabric, Wood",
        seats: 3,
        isTrending: false,
        isNewArrival: false
      }
    ];
    
    const insertedProducts = await db.insert(products).values(sampleProducts).returning();
    console.log(`Inserted ${insertedProducts.length} products.`);
    
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seed function
seedDatabase().then(() => {
  console.log("Seed script completed.");
  process.exit(0);
}).catch(error => {
  console.error("Seed script failed:", error);
  process.exit(1);
});