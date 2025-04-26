import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Feedback schema
export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  sentiment: text("sentiment").notNull(), // 'positive', 'neutral', 'negative'
  source: text("source").notNull(), // 'in-app', 'email', 'support', etc.
  category: text("category").notNull(), // 'product_features', 'support_experience', etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFeedbackSchema = createInsertSchema(feedbacks).omit({
  id: true,
  createdAt: true,
});

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedbacks.$inferSelect;

// Feedback collection tools schema
export const feedbackTools = pgTable("feedback_tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'in-app', 'email', 'support', etc.
  description: text("description").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  config: jsonb("config").notNull(),
  responseCount: integer("response_count").default(0).notNull(),
  responseRate: integer("response_rate").default(0).notNull(),
  averageSentiment: integer("average_sentiment").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFeedbackToolSchema = createInsertSchema(feedbackTools).omit({
  id: true,
  createdAt: true,
});

export type InsertFeedbackTool = z.infer<typeof insertFeedbackToolSchema>;
export type FeedbackTool = typeof feedbackTools.$inferSelect;

// Actions taken based on feedback
export const actions = pgTable("actions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'feature', 'bug', 'ux', 'docs', etc.
  description: text("description").notNull(),
  status: text("status").notNull(), // 'completed', 'in-progress', 'planned'
  impact: text("impact").notNull(), // description of impact
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActionSchema = createInsertSchema(actions).omit({
  id: true,
  createdAt: true,
});

export type InsertAction = z.infer<typeof insertActionSchema>;
export type Action = typeof actions.$inferSelect;
