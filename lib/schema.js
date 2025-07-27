// schema.js
import {
  pgTable,
  text,
  uuid,
  timestamp,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Enum for lead status
export const leadStatusEnum = pgEnum('lead_status', [
  'New',
  'Contacted',
  'Qualified',
  'Converted',
  'Lost',
]);

export const agents = pgTable('agents', {
  id: uuid('id').defaultRandom().primaryKey(),

  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(), // store bcrypt-hashed password
  phone: varchar('phone', { length: 20 }).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Leads table
export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  source: varchar('source', { length: 100 }),

  // Contact info
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),

  // Array of interested products (e.g., POS System, CRM Automation)
  interestedProducts: text('interested_products').array(),

  // Enum status
  status: leadStatusEnum('status').default('New'),

  notes: text('notes'),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
});
