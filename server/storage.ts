
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import {
  profiles, events, expenses, photos, widgets,
  type Profile, type Event, type Expense, type Photo, type Widget,
  type InsertProfile, type InsertEvent, type InsertExpense, type InsertPhoto, type InsertWidget
} from "@shared/schema";

export interface IStorage {
  // Profiles
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateMembership(userId: string, isActive: boolean, tier: string): Promise<Profile>;

  // Events
  getEvents(userId: string, mode?: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Expenses
  getExpenses(userId: string): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;

  // Photos
  getPhotos(userId: string, mode?: string): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;

  // Widgets
  getWidgets(userId: string): Promise<Widget[]>;
  createWidget(widget: InsertWidget): Promise<Widget>;
}

export class DatabaseStorage implements IStorage {
  // Profiles
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile).returning();
    return profile;
  }

  async updateMembership(userId: string, isActive: boolean, tier: string): Promise<Profile> {
    // Check if profile exists, if not create one
    let [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    if (!profile) {
      [profile] = await db.insert(profiles).values({
        userId,
        isMembershipActive: isActive,
        membershipTier: tier,
        currentMode: 'love'
      }).returning();
    } else {
      [profile] = await db
        .update(profiles)
        .set({ isMembershipActive: isActive, membershipTier: tier })
        .where(eq(profiles.userId, userId))
        .returning();
    }
    return profile;
  }

  // Events
  async getEvents(userId: string, mode?: string): Promise<Event[]> {
    let query = db.select().from(events).where(eq(events.userId, userId)).orderBy(desc(events.date));
    if (mode) {
      query = db.select().from(events).where(eq(events.mode, mode)).orderBy(desc(events.date));
    }
    return await query;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: number, updates: Partial<InsertEvent>): Promise<Event> {
    const [updated] = await db.update(events).set(updates).where(eq(events.id, id)).returning();
    return updated;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Expenses
  async getExpenses(userId: string): Promise<Expense[]> {
    return await db.select().from(expenses).where(eq(expenses.userId, userId)).orderBy(desc(expenses.date));
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const [newExpense] = await db.insert(expenses).values(expense).returning();
    return newExpense;
  }

  // Photos
  async getPhotos(userId: string, mode?: string): Promise<Photo[]> {
    if (mode) {
      return await db.select().from(photos).where(eq(photos.mode, mode));
    }
    return await db.select().from(photos).where(eq(photos.userId, userId));
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db.insert(photos).values(photo).returning();
    return newPhoto;
  }

  // Widgets
  async getWidgets(userId: string): Promise<Widget[]> {
    return await db.select().from(widgets).where(eq(widgets.userId, userId));
  }

  async createWidget(widget: InsertWidget): Promise<Widget> {
    const [newWidget] = await db.insert(widgets).values(widget).returning();
    return newWidget;
  }
}

export const storage = new DatabaseStorage();
