import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const enquiriesTable = pgTable("enquiries", {
  id:           serial("id").primaryKey(),
  userId:       integer("user_id"),
  type:         text("type").$type<"vendor" | "venue" | "contact" | "listing">().notNull(),
  name:         text("name").notNull(),
  email:        text("email").notNull(),
  phone:        text("phone").notNull().default(""),
  businessName: text("business_name"),
  category:     text("category"),
  city:         text("city"),
  vendorName:   text("vendor_name"),
  message:      text("message").notNull(),
  status:       text("status").$type<"new" | "replied" | "converted">().notNull().default("new"),
  createdAt:    timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Enquiry       = typeof enquiriesTable.$inferSelect;
export type InsertEnquiry = typeof enquiriesTable.$inferInsert;
