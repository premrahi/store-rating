import { pgTable, pgEnum, serial, varchar, integer, smallint, timestamp, unique } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('user_role', ['ADMIN', 'USER', 'OWNER']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 60 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  address: varchar('address', { length: 400 }).notNull(),
  role: roleEnum('role').notNull().default('USER'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 60 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  address: varchar('address', { length: 400 }).notNull(),
  ownerId: integer('owner_id').references(() => users.id, { onDelete: 'set null' }).unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const ratings = pgTable('ratings',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    storeId: integer('store_id')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
    rating: smallint('rating').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    uniqueUserStore: unique().on(t.userId, t.storeId),
  }),
);

// Inferred row types — single source of truth, no hand-written interfaces to drift
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;
export type Rating = typeof ratings.$inferSelect;
