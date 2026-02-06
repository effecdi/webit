import { pgTable, serial, text, varchar, boolean, timestamp, numeric, jsonb, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  email: varchar('email'),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  profileImageUrl: varchar('profile_image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  username: text('username'),
  partnerName: text('partner_name'),
  firstMeetDate: timestamp('first_meet_date'),
  coupleIntro: text('couple_intro'),
  isMembershipActive: boolean('is_membership_active').default(false),
  membershipTier: text('membership_tier').default('free'),
  currentMode: text('current_mode').default('love'),
  myMood: text('my_mood').default('heart'),
  partnerMood: text('partner_mood').default('heart'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  date: timestamp('date').notNull(),
  time: text('time'),
  location: text('location'),
  category: text('category'),
  mode: text('mode').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  text: text('text').notNull(),
  completed: boolean('completed').default(false),
  assignee: text('assignee').default('we'),
  mode: text('mode').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const todoComments = pgTable('todo_comments', {
  id: serial('id').primaryKey(),
  todoId: integer('todo_id').notNull(),
  author: text('author').notNull(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const photos = pgTable('photos', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  url: text('url').notNull(),
  caption: text('caption'),
  albumId: integer('album_id'),
  liked: boolean('liked').default(false),
  mode: text('mode').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const albums = pgTable('albums', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  thumbnail: text('thumbnail'),
  eventDate: timestamp('event_date'),
  mode: text('mode').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  mode: text('mode').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  amount: numeric('amount').notNull(),
  category: text('category').notNull(),
  isPaid: boolean('is_paid').default(false),
  memo: text('memo'),
  date: timestamp('date').notNull(),
  mode: text('mode').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const checklistItems = pgTable('checklist_items', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  completed: boolean('completed').default(false),
  dueDate: timestamp('due_date'),
  priority: text('priority').default('medium'),
  mode: text('mode').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const travels = pgTable('travels', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  destination: text('destination').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  thumbnail: text('thumbnail'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const travelSchedules = pgTable('travel_schedules', {
  id: serial('id').primaryKey(),
  travelId: integer('travel_id').notNull(),
  day: integer('day').notNull(),
  time: text('time'),
  title: text('title').notNull(),
  location: text('location'),
  memo: text('memo'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const widgets = pgTable('widgets', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  type: text('type').notNull(),
  isEnabled: boolean('is_enabled').default(true),
  settings: text('settings'),
});

export const weddingInfo = pgTable('wedding_info', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  weddingDate: text('wedding_date'),
  weddingTime: text('wedding_time'),
  venue: text('venue'),
  expectedGuests: integer('expected_guests'),
  groomGuests: integer('groom_guests').default(0),
  brideGuests: integer('bride_guests').default(0),
  mealCostAdult: integer('meal_cost_adult').default(0),
  mealCostChild: integer('meal_cost_child').default(0),
  invitationCount: integer('invitation_count').default(0),
  physicalInvitationCount: integer('physical_invitation_count').default(0),
  invitationData: jsonb('invitation_data'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const guests = pgTable('guests', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  side: text('side').notNull(),
  relationship: text('relationship'),
  attendance: text('attendance').default('pending'),
  invitationSent: boolean('invitation_sent').default(false),
  mealType: text('meal_type').default('adult'),
  giftAmount: integer('gift_amount').default(0),
  memo: text('memo'),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sessions = pgTable('sessions', {
  sid: varchar('sid').primaryKey(),
  sess: jsonb('sess').notNull(),
  expire: timestamp('expire').notNull(),
});

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Todo = typeof todos.$inferSelect;
export type TodoComment = typeof todoComments.$inferSelect;
export type Photo = typeof photos.$inferSelect;
export type Album = typeof albums.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type ChecklistItem = typeof checklistItems.$inferSelect;
export type Travel = typeof travels.$inferSelect;
export type TravelSchedule = typeof travelSchedules.$inferSelect;
export type Widget = typeof widgets.$inferSelect;
export type WeddingInfo = typeof weddingInfo.$inferSelect;
export type Guest = typeof guests.$inferSelect;
