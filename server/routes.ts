import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFeedbackSchema, insertFeedbackToolSchema, insertActionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefixed with /api
  
  // Feedback routes
  app.get("/api/feedbacks", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const feedbacks = await storage.getFeedbacks(limit);
      res.json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching feedbacks" });
    }
  });
  
  app.get("/api/feedbacks/stats", async (req, res) => {
    try {
      const stats = await storage.getFeedbackStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching feedback stats" });
    }
  });
  
  app.post("/api/feedbacks", async (req, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(validatedData);
      res.status(201).json(feedback);
    } catch (error) {
      res.status(400).json({ message: "Invalid feedback data" });
    }
  });
  
  app.get("/api/feedbacks/sentiment/:sentiment", async (req, res) => {
    try {
      const { sentiment } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const feedbacks = await storage.getFeedbacksBySentiment(sentiment, limit);
      res.json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching feedbacks by sentiment" });
    }
  });
  
  app.get("/api/feedbacks/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const feedbacks = await storage.getFeedbacksByCategory(category, limit);
      res.json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching feedbacks by category" });
    }
  });
  
  // Feedback tools routes
  app.get("/api/feedback-tools", async (req, res) => {
    try {
      const tools = await storage.getFeedbackTools();
      res.json(tools);
    } catch (error) {
      res.status(500).json({ message: "Error fetching feedback tools" });
    }
  });
  
  app.get("/api/feedback-tools/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const tool = await storage.getFeedbackToolById(parseInt(id));
      
      if (!tool) {
        return res.status(404).json({ message: "Feedback tool not found" });
      }
      
      res.json(tool);
    } catch (error) {
      res.status(500).json({ message: "Error fetching feedback tool" });
    }
  });
  
  app.post("/api/feedback-tools", async (req, res) => {
    try {
      const validatedData = insertFeedbackToolSchema.parse(req.body);
      const tool = await storage.createFeedbackTool(validatedData);
      res.status(201).json(tool);
    } catch (error) {
      res.status(400).json({ message: "Invalid feedback tool data" });
    }
  });
  
  app.patch("/api/feedback-tools/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const tool = await storage.updateFeedbackTool(parseInt(id), req.body);
      
      if (!tool) {
        return res.status(404).json({ message: "Feedback tool not found" });
      }
      
      res.json(tool);
    } catch (error) {
      res.status(400).json({ message: "Error updating feedback tool" });
    }
  });
  
  // Actions routes
  app.get("/api/actions", async (req, res) => {
    try {
      const actions = await storage.getActions();
      res.json(actions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching actions" });
    }
  });
  
  app.get("/api/actions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const action = await storage.getActionById(parseInt(id));
      
      if (!action) {
        return res.status(404).json({ message: "Action not found" });
      }
      
      res.json(action);
    } catch (error) {
      res.status(500).json({ message: "Error fetching action" });
    }
  });
  
  app.post("/api/actions", async (req, res) => {
    try {
      const validatedData = insertActionSchema.parse(req.body);
      const action = await storage.createAction(validatedData);
      res.status(201).json(action);
    } catch (error) {
      res.status(400).json({ message: "Invalid action data" });
    }
  });
  
  app.patch("/api/actions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const action = await storage.updateAction(parseInt(id), req.body);
      
      if (!action) {
        return res.status(404).json({ message: "Action not found" });
      }
      
      res.json(action);
    } catch (error) {
      res.status(400).json({ message: "Error updating action" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
