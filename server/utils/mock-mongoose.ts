/**
 * This file provides a mock implementation of mongoose for Replit environment
 * It prevents actual MongoDB connection attempts and provides fake data instead
 */

// Import the real mongoose to extend its functionality
import mongoose from 'mongoose';

// Create mock models with data
const categories = [
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
  }
];

const products = [
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
  }
];

// Mock data storage
const dataStore: Record<string, any[]> = {
  categories,
  products,
  users: [
    {
      _id: '1',
      username: 'demo',
      email: 'demo@example.com',
      name: 'Demo User',
      password: '$2b$10$Og2VcS6MVhyWxEPk3yPJr.9Qck0jiV8HSTDWORIQTbwBr7YqXBKhm', // "password"
      firebaseId: 'demo123'
    }
  ],
  rentals: [],
  wishlist: [],
  cart: []
};

// Mock Schema class
class MockSchema {
  constructor(public definition: any) {
    console.log('Created mock schema with definition:', Object.keys(definition));
  }
}

// Mock model class that returns data from our predefined store
class MockModel {
  private collection: string;
  
  constructor(name: string) {
    this.collection = name.toLowerCase() + 's'; // pluralize name
    console.log(`Created mock model for collection: ${this.collection}`);
  }

  // Find method returns all data or filtered subset
  find(query: any = {}) {
    console.log(`Mock find on ${this.collection} with query:`, query);
    const data = dataStore[this.collection] || [];
    // Simple filtering logic
    return {
      lean: () => Promise.resolve(data),
      exec: () => Promise.resolve(data)
    };
  }

  // FindById returns a single item by ID
  findById(id: string) {
    console.log(`Mock findById on ${this.collection} with id: ${id}`);
    const data = dataStore[this.collection] || [];
    const item = data.find(item => item._id === id);
    return {
      lean: () => Promise.resolve(item || null),
      exec: () => Promise.resolve(item || null)
    };
  }

  // FindOne returns first matching item
  findOne(query: any = {}) {
    console.log(`Mock findOne on ${this.collection} with query:`, query);
    const data = dataStore[this.collection] || [];
    // Simple matching on first query property
    const key = Object.keys(query)[0];
    const item = key ? data.find(item => item[key] === query[key]) : null;
    return {
      lean: () => Promise.resolve(item || null),
      exec: () => Promise.resolve(item || null)
    };
  }

  // Method chaining support
  populate(field: string) {
    return this;
  }

  lean() {
    return this;
  }
}

// Patch the mongoose object
const mockedMongoose = {
  ...mongoose,
  
  // Replace Schema with mock implementation
  Schema: MockSchema as any,
  
  // Replace model with mock implementation
  model: (name: string) => new MockModel(name) as any,
  
  // Replace connect with mock that doesn't connect
  connect: async () => {
    console.log('Mock mongoose.connect called (no actual connection made)');
    return Promise.resolve(mockedMongoose);
  },
  
  // Mock connection object
  connection: {
    on: (event: string, callback: Function) => {
      console.log(`Mock mongoose.connection.on('${event}') registered`);
      return mockedMongoose.connection;
    },
    once: (event: string, callback: Function) => {
      console.log(`Mock mongoose.connection.once('${event}') registered`);
      return mockedMongoose.connection;
    },
    db: {
      databaseName: 'mock_db',
      collections: () => Promise.resolve([])
    }
  },
  
  // Types for schema definitions
  Types: {
    ...mongoose.Types,
    ObjectId: String
  }
};

export default mockedMongoose;