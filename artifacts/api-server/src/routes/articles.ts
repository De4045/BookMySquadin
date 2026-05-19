import { Router, type IRouter } from "express";
import { desc, eq, sql } from "drizzle-orm";
import { db, articlesTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

export type Article = typeof articlesTable.$inferSelect;

/* ── GET published articles (public) ── */
router.get("/articles", async (_req, res) => {
  const rows = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.published, true))
    .orderBy(desc(articlesTable.createdAt));
  res.json({ articles: rows, total: rows.length });
});

/* ── GET all articles (admin only) ── */
router.get("/articles/all", requireAdmin, async (_req, res) => {
  const rows = await db
    .select()
    .from(articlesTable)
    .orderBy(desc(articlesTable.createdAt));
  res.json({ articles: rows, total: rows.length });
});

/* ── Create article (admin only) ── */
router.post("/articles", requireAdmin, async (req, res) => {
  const { title, tag, excerpt, content, img, author, readTime } =
    req.body as Partial<Article>;
  if (!title || !tag || !excerpt) {
    res.status(400).json({ error: "title, tag and excerpt are required." });
    return;
  }

  const [article] = await db
    .insert(articlesTable)
    .values({
      title:    String(title),
      tag:      String(tag || "General"),
      excerpt:  String(excerpt),
      content:  String(content || excerpt),
      img:      String(
        img ||
          "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=85",
      ),
      author:   String(author || "Editorial Team"),
      readTime: String(readTime || "3 min read"),
      published: true,
    })
    .returning();

  req.log.info({ articleId: article!.id, title }, "Article created");
  res.status(201).json({ success: true, article });
});

/* ── Toggle published / update fields (admin only) ── */
router.patch("/articles/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  const { published, title, tag, excerpt } = req.body as Partial<Article>;

  const fields: Partial<typeof articlesTable.$inferInsert> = {};
  if (published !== undefined) fields.published = Boolean(published);
  if (title)   fields.title   = String(title);
  if (tag)     fields.tag     = String(tag);
  if (excerpt) fields.excerpt = String(excerpt);

  const [updated] = await db
    .update(articlesTable)
    .set(fields)
    .where(eq(articlesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found." });
    return;
  }
  res.json({ success: true, article: updated });
});

/* ── Delete article (admin only) ── */
router.delete("/articles/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  const [deleted] = await db
    .delete(articlesTable)
    .where(eq(articlesTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Not found." });
    return;
  }
  req.log.info({ articleId: id }, "Article deleted");
  res.json({ success: true });
});

/* ── Seed ── */
export async function seedArticles(): Promise<void> {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(articlesTable);

  if (count > 0) return;

  await db.insert(articlesTable).values([
    {
      title:    "15 Stunning Lehenga Trends for 2026 Brides",
      tag:      "Bridal Fashion",
      excerpt:  "From hand-embroidered Banarasi silk to contemporary mirror-work silhouettes — our editors curate this season's most coveted bridal looks.",
      content:  "This season's bridal silhouettes are bolder, richer, and more personal than ever. Ombre silk lehengas, mirror-work revivals, pastel greens, 3D floral appliqué, and cape dupattas are dominating every major bridal show. Book your bridal consultation through our Makeup & Styling vendors to create your perfect look.",
      img:      "https://images.unsplash.com/photo-1583396618422-c6cf3b31e30c?w=900&q=85",
      author:   "Priya Mehta",
      readTime: "5 min read",
      published: true,
      createdAt: new Date("2026-05-01T10:00:00.000Z"),
    },
    {
      title:    "How to Plan Your Wedding Budget Without Stress",
      tag:      "Planning",
      excerpt:  "A practical guide to allocating your wedding budget across all key categories — from venue to honeymoon.",
      content:  "Budget planning is the most stressful aspect of wedding planning. Start by determining your total budget, then allocate: 30% venue, 15% catering, 12% photography, 10% décor, 8% outfits, 7% entertainment, 6% invitations, 5% honeymoon, 7% miscellaneous. Always keep a 10% contingency buffer.",
      img:      "https://images.unsplash.com/photo-1554774853-719586f82d77?w=900&q=85",
      author:   "Rohan Sharma",
      readTime: "7 min read",
      published: true,
      createdAt: new Date("2026-04-20T10:00:00.000Z"),
    },
    {
      title:    "Minimalist Décor Ideas That Look Expensive",
      tag:      "Décor",
      excerpt:  "Less is more — elegant, understated wedding décor ideas that create maximum impact on any budget.",
      content:  "Minimalist weddings are having a major moment. Key principles: monochromatic palettes, quality over quantity in florals, strategic lighting, negative space, and a single statement installation. Work with our verified Decorator vendors to bring your vision to life.",
      img:      "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=85",
      author:   "Ananya Kapoor",
      readTime: "4 min read",
      published: true,
      createdAt: new Date("2026-04-10T10:00:00.000Z"),
    },
    {
      title:    "Golden Hour Portraits: Tips From Top Wedding Photographers",
      tag:      "Photography",
      excerpt:  "India's most celebrated wedding photographers share their secrets for capturing timeless portraits.",
      content:  "The golden hour — that magical 60 minutes after sunrise and before sunset — produces the most flattering light for wedding portraits. Key tips: scout locations in advance, keep your timeline flexible, communicate with your photographer about must-have shots, and trust their creative instincts.",
      img:      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=85",
      author:   "Vikram Patel",
      readTime: "6 min read",
      published: true,
      createdAt: new Date("2026-03-28T10:00:00.000Z"),
    },
  ]);

  logger.info("Seeded 4 articles");
}

export default router;
