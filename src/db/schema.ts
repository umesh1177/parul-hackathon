import { mysqlTable, varchar, text, timestamp, decimal, date, datetime } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  fullName: text('full_name'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password'), // Store hashed passwords
  avatarUrl: text('avatar_url'),
  role: varchar('role', { length: 50 }).default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const trips = mysqlTable('trips', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  destination: text('destination').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  totalBudget: decimal('total_budget', { precision: 10, scale: 2 }),
  tripType: text('trip_type'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const stops = mysqlTable('stops', {
  id: varchar('id', { length: 255 }).primaryKey(),
  tripId: varchar('trip_id', { length: 255 }).notNull().references(() => trips.id, { onDelete: 'cascade' }),
  locationName: text('location_name').notNull(),
  order: varchar('order', { length: 50 }).notNull(),
  arrivalDate: datetime('arrival_date'),
  departureDate: datetime('departure_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const activities = mysqlTable('activities', {
  id: varchar('id', { length: 255 }).primaryKey(),
  stopId: varchar('stop_id', { length: 255 }).notNull().references(() => stops.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  startTime: datetime('start_time'),
  endTime: datetime('end_time'),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  category: text('category'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
