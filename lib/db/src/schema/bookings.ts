import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const bookingsTable = pgTable("bookings", {
  id:               serial("id").primaryKey(),
  userId:           integer("user_id"),
  vendorName:       text("vendor_name").notNull(),
  vendorCategory:   text("vendor_category").notNull().default(""),
  city:             text("city").notNull().default(""),
  packageName:      text("package_name").notNull(),
  packagePrice:     integer("package_price").notNull().default(0),
  eventDate:        text("event_date").notNull(),
  eventType:        text("event_type").notNull().default(""),
  guestCount:       integer("guest_count").notNull().default(0),
  consultationDate: text("consultation_date"),
  consultationTime: text("consultation_time"),
  name:             text("name").notNull(),
  email:            text("email").notNull(),
  phone:            text("phone").notNull(),
  message:          text("message"),
  advancePaid:      boolean("advance_paid").notNull().default(false),
  advanceAmount:    integer("advance_amount").notNull().default(0),
  status:           text("status").$type<"pending" | "confirmed" | "advance_paid" | "completed" | "cancelled">().notNull().default("pending"),
  createdAt:        timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Booking       = typeof bookingsTable.$inferSelect;
export type InsertBooking = typeof bookingsTable.$inferInsert;
