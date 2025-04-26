import { users, type User, type InsertUser, 
  feedbacks, type Feedback, type InsertFeedback,
  feedbackTools, type FeedbackTool, type InsertFeedbackTool,
  actions, type Action, type InsertAction } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Feedback methods
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedbacks(limit?: number): Promise<Feedback[]>;
  getFeedbacksByUserId(userId: number): Promise<Feedback[]>;
  getFeedbacksBySentiment(sentiment: string, limit?: number): Promise<Feedback[]>;
  getFeedbacksByCategory(category: string, limit?: number): Promise<Feedback[]>;
  getFeedbackStats(): Promise<{ 
    totalFeedbacks: number; 
    positiveFeedbacks: number; 
    neutralFeedbacks: number; 
    negativeFeedbacks: number; 
  }>;
  
  // Feedback tool methods
  createFeedbackTool(tool: InsertFeedbackTool): Promise<FeedbackTool>;
  getFeedbackTools(): Promise<FeedbackTool[]>;
  getFeedbackToolById(id: number): Promise<FeedbackTool | undefined>;
  updateFeedbackTool(id: number, data: Partial<InsertFeedbackTool>): Promise<FeedbackTool | undefined>;
  
  // Action methods
  createAction(action: InsertAction): Promise<Action>;
  getActions(): Promise<Action[]>;
  getActionById(id: number): Promise<Action | undefined>;
  updateAction(id: number, data: Partial<InsertAction>): Promise<Action | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private feedbacks: Map<number, Feedback>;
  private feedbackTools: Map<number, FeedbackTool>;
  private actions: Map<number, Action>;
  private currentUserId: number;
  private currentFeedbackId: number;
  private currentFeedbackToolId: number;
  private currentActionId: number;

  constructor() {
    this.users = new Map();
    this.feedbacks = new Map();
    this.feedbackTools = new Map();
    this.actions = new Map();
    this.currentUserId = 1;
    this.currentFeedbackId = 1;
    this.currentFeedbackToolId = 1;
    this.currentActionId = 1;
    
    // Initialize with some mock feedback tools
    this.initializeMockData();
  }

  // Initialize with some sample data for demo purposes
  private initializeMockData() {
    // Sample feedback tools
    this.createFeedbackTool({
      name: "In-App Survey",
      type: "in-app",
      description: "Collects feedback via in-app modal prompts after key actions. Targets specific user journeys.",
      isActive: true,
      config: {},
      responseCount: 1247,
      responseRate: 23,
      averageSentiment: 4.2
    });
    
    this.createFeedbackTool({
      name: "Email Campaign",
      type: "email",
      description: "Automated email surveys sent to customers 7 days after onboarding and quarterly thereafter.",
      isActive: true,
      config: {},
      responseCount: 3856,
      responseRate: 18,
      averageSentiment: 3.9
    });
    
    this.createFeedbackTool({
      name: "Support Feedback",
      type: "support",
      description: "Automatically collects and analyzes feedback after support ticket resolution.",
      isActive: true,
      config: {},
      responseCount: 957,
      responseRate: 42,
      averageSentiment: 3.5
    });
    
    // Sample actions
    this.createAction({
      name: "Added bulk export functionality",
      type: "feature",
      description: "Added bulk export functionality in response to 28 user requests",
      status: "completed",
      impact: "Improved user experience"
    });
    
    this.createAction({
      name: "Fixed loading time issues",
      type: "bug",
      description: "Fixed loading time issues reported by enterprise users - 62% performance improvement",
      status: "completed",
      impact: "62% performance improvement"
    });
    
    this.createAction({
      name: "Redesigned dashboard",
      type: "ux",
      description: "Redesigned dashboard based on UX feedback",
      status: "completed",
      impact: "30% increase in feature engagement"
    });
    
    this.createAction({
      name: "Automated report scheduling",
      type: "feature",
      description: "Developing automated report scheduling",
      status: "in-progress",
      impact: "Pending"
    });
    
    this.createAction({
      name: "Expanding API capabilities",
      type: "feature",
      description: "Expanding API capabilities for better integration",
      status: "planned",
      impact: "Planned for Q3"
    });
  }

  // User methods
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Feedback methods
  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = this.currentFeedbackId++;
    const now = new Date();
    const feedback: Feedback = { 
      ...insertFeedback, 
      id, 
      createdAt: now 
    };
    this.feedbacks.set(id, feedback);
    return feedback;
  }
  
  async getFeedbacks(limit?: number): Promise<Feedback[]> {
    const feedbacks = Array.from(this.feedbacks.values());
    return limit ? feedbacks.slice(0, limit) : feedbacks;
  }
  
  async getFeedbacksByUserId(userId: number): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values()).filter(
      (feedback) => feedback.userId === userId
    );
  }
  
  async getFeedbacksBySentiment(sentiment: string, limit?: number): Promise<Feedback[]> {
    const feedbacks = Array.from(this.feedbacks.values())
      .filter((feedback) => feedback.sentiment === sentiment);
    return limit ? feedbacks.slice(0, limit) : feedbacks;
  }
  
  async getFeedbacksByCategory(category: string, limit?: number): Promise<Feedback[]> {
    const feedbacks = Array.from(this.feedbacks.values())
      .filter((feedback) => feedback.category === category);
    return limit ? feedbacks.slice(0, limit) : feedbacks;
  }
  
  async getFeedbackStats(): Promise<{ 
    totalFeedbacks: number; 
    positiveFeedbacks: number; 
    neutralFeedbacks: number; 
    negativeFeedbacks: number; 
  }> {
    const feedbacks = Array.from(this.feedbacks.values());
    const totalFeedbacks = feedbacks.length;
    const positiveFeedbacks = feedbacks.filter(f => f.sentiment === 'positive').length;
    const neutralFeedbacks = feedbacks.filter(f => f.sentiment === 'neutral').length;
    const negativeFeedbacks = feedbacks.filter(f => f.sentiment === 'negative').length;
    
    return {
      totalFeedbacks,
      positiveFeedbacks,
      neutralFeedbacks,
      negativeFeedbacks
    };
  }
  
  // Feedback tool methods
  async createFeedbackTool(insertTool: InsertFeedbackTool): Promise<FeedbackTool> {
    const id = this.currentFeedbackToolId++;
    const now = new Date();
    const tool: FeedbackTool = { 
      ...insertTool, 
      id, 
      createdAt: now 
    };
    this.feedbackTools.set(id, tool);
    return tool;
  }
  
  async getFeedbackTools(): Promise<FeedbackTool[]> {
    return Array.from(this.feedbackTools.values());
  }
  
  async getFeedbackToolById(id: number): Promise<FeedbackTool | undefined> {
    return this.feedbackTools.get(id);
  }
  
  async updateFeedbackTool(id: number, data: Partial<InsertFeedbackTool>): Promise<FeedbackTool | undefined> {
    const tool = this.feedbackTools.get(id);
    if (!tool) return undefined;
    
    const updatedTool = { ...tool, ...data };
    this.feedbackTools.set(id, updatedTool);
    return updatedTool;
  }
  
  // Action methods
  async createAction(insertAction: InsertAction): Promise<Action> {
    const id = this.currentActionId++;
    const now = new Date();
    const action: Action = { 
      ...insertAction, 
      id, 
      createdAt: now 
    };
    this.actions.set(id, action);
    return action;
  }
  
  async getActions(): Promise<Action[]> {
    return Array.from(this.actions.values());
  }
  
  async getActionById(id: number): Promise<Action | undefined> {
    return this.actions.get(id);
  }
  
  async updateAction(id: number, data: Partial<InsertAction>): Promise<Action | undefined> {
    const action = this.actions.get(id);
    if (!action) return undefined;
    
    const updatedAction = { ...action, ...data };
    this.actions.set(id, updatedAction);
    return updatedAction;
  }
}

export const storage = new MemStorage();
