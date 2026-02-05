
import { pgTable, text, serial, integer, boolean, timestamp, date, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export * from "./models/auth";

// Users & Membership - Modified to extend/link with Replit Auth if needed, or just keep as app-specific profile
// Replit Auth uses 'users' table in models/auth.ts with id as string (uuid).
// We should probably define our app-specific user profile linked to that, or just use the auth table.
// For simplicity in Lite Build, I'll keep my 'users' table but maybe rename it to 'app_users' or just use the auth one.
// Actually, the blueprint says "The users and sessions tables are mandatory...".
// My previous schema defined 'users'. This will CONFLICT.
// I should REMOVE my 'users' table definition and use the one from './models/auth', or rename mine to 'profiles'.

// Renaming my user table to 'profiles' to avoid conflict, or extending the auth user.
// Let's use 'profiles' linked by 'userId' (string) which matches Replit Auth ID.

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(), // Link to auth.users.id
  username: text("username"),
  isMembershipActive: boolean("is_membership_active").default(false),
  membershipTier: text("membership_tier").default("free"), // free, premium
  currentMode: text("current_mode").default("love"), // love, marriage, family
  createdAt: timestamp("created_at").defaultNow(),
});

// Calendar Events (Shared across modes)
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Changed to text to match Replit Auth UUID
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  mode: text("mode").notNull(), // love, marriage, family
  createdAt: timestamp("created_at").defaultNow(),
});

// Gallery Photos
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  url: text("url").notNull(),
  caption: text("caption"),
  mode: text("mode").notNull(), // love, marriage, family
  createdAt: timestamp("created_at").defaultNow(),
});

// Budget/Expenses (Marriage Mode)
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  amount: decimal("amount").notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Widget Configuration
export const widgets = pgTable("widgets", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // calendar, photo, budget, d-day
  isEnabled: boolean("is_enabled").default(true),
  settings: text("settings"), // JSON string for config
});

// Schemas
export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true, createdAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export const insertPhotoSchema = createInsertSchema(photos).omit({ id: true, createdAt: true });
export const insertExpenseSchema = createInsertSchema(expenses).omit({ id: true, createdAt: true });
export const insertWidgetSchema = createInsertSchema(widgets).omit({ id: true });

// Types
export type Profile = typeof profiles.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Photo = typeof photos.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type Widget = typeof widgets.$inferSelect;
