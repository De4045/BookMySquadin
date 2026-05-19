import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const articlesTable = pgTable("articles", {
  id:        serial("id").primaryKey(),
  title:     text("title").notNull(),
  tag:       text("tag").notNull(),
  excerpt:   text("excerpt").notNull(),
  content:   text("content").notNull(),
  img:       text("img").notNull(),
  author:    text("author").notNull(),
  readTime:  text("read_time").notNull().default("3 min read"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Article       = typeof articlesTable.$inferSelect;
export type InsertArticle = typeof articlesTable.$inferInsert;
