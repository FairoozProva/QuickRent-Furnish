import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectToDatabase } from "./mongodb";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Check if we're in Replit environment
    const isReplitEnv = process.env.REPLIT_DB_URL ? true : false;
    
    if (isReplitEnv) {
      console.log('Running in Replit environment - using in-memory storage');
      // Continue without database connection in Replit
    } else {
      // Connect to MongoDB database for local development
      await connectToDatabase();
      console.log('MongoDB connection successful');
    }
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    
    // In development mode, we'll allow the app to start without MongoDB
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Running in development mode without MongoDB. Using in-memory storage instead.');
      console.warn('⚠️ For local development with MongoDB:');
      console.warn('   1. Make sure MongoDB is running locally');
      console.warn('   2. Create a database named "quickrent_furnish" in MongoDB Compass');
      console.warn('   3. Run the seed script: npx tsx scripts/seed-mongodb.ts');
    } else {
      // In production, we'll use in-memory storage if MongoDB isn't available
      console.warn('⚠️ Running in production mode without MongoDB. Using in-memory storage instead.');
    }
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Server error:", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
