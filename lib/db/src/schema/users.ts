import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id:           serial("id").primaryKey(),
  name:         text("name").notNull(),
  email:        text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role:         text("role").$type<"user" | "vendor" | "venue" | "admin">().notNull().default("user"),
  createdAt:    timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  isActive:     boolean("is_active").notNull().default(true),
  lastLoginAt:  timestamp("last_login_at", { withTimezone: true }),
  phone:        text("phone"),
  city:         text("city"),
  bio:          text("bio"),
});

export type User       = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
