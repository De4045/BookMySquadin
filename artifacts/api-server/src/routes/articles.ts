import { Router, type IRouter } from "express";
import { requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

export interface Article {
  id: number;
  title: string;
  tag: string;
  excerpt: string;
  content: string;
  img: string;
  author: string;
  readTime: string;
  published: boolean;
  createdAt: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: "15 Stunning Lehenga Trends for 2026 Brides",
    tag: "Bridal Fashion",
    excerpt: "From hand-embroidered Banarasi silk to contemporary mirror-work silhouettes — our editors curate this season's most coveted bridal looks.",
    content: "This season's bridal silhouettes are bolder, richer, and more personal than ever. Ombre silk lehengas, mirror-work revivals, pastel greens, 3D floral appliqué, and cape dupattas are dominating every major bridal show. Book your bridal consultation through our Makeup & Styling vendors to create your perfect look.",
    img: "https://images.unsplash.com/photo-1583396618422-c6cf3b31e30c?w=900&q=85",
    author: "Priya Mehta",
    readTime: "5 min read",
    published: true,
    createdAt: "2026-05-01T10:00:00.000Z",
  },
  {
    id: 2,
    title: "How to Plan Your Wedding Budget Without Stress",
    tag: "Planning",
    excerpt: "A practical guide to allocating your wedding budget across all key categories — from venue to honeymoon.",
    content: "Budget planning is the most stressful aspect of wedding planning. Start by determining your total budget, then allocate: 30% venue, 15% catering, 12% photography, 10% décor, 8% outfits, 7% entertainment, 6% invitations, 5% honeymoon, 7% miscellaneous. Always keep a 10% contingency buffer.",
    img: "https://images.unsplash.com/photo-1554774853-719586f82d77?w=900&q=85",
    author: "Rohan Sharma",
    readTime: "7 min read",
    published: true,
    createdAt: "2026-04-20T10:00:00.000Z",
  },
  {
    id: 3,
    title: "Minimalist Décor Ideas That Look Expensive",
    tag: "Décor",
    excerpt: "Less is more — elegant, understated wedding décor ideas that create maximum impact on any budget.",
    content: "Minimalist weddings are having a major moment. Key principles: monochromatic palettes, quality over quantity in florals, strategic lighting, negative space, and a single statement installation. Work with our verified Decorator vendors to bring your vision to life.",
    img: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=85",
    author: "Ananya Kapoor",
    readTime: "4 min read",
    published: true,
    createdAt: "2026-04-10T10:00:00.000Z",
  },
  {
    id: 4,
    title: "Golden Hour Portraits: Tips From Top Wedding Photographers",
    tag: "Photography",
    excerpt: "India's most celebrated wedding photographers share their secrets for capturing timeless portraits.",
    content: "The golden hour — that magical 60 minutes after sunrise and before sunset — produces the most flattering light for wedding portraits. Key tips: scout locations in advance, keep your timeline flexible, communicate with your photographer about must-have shots, and trust their creative instincts.",
    img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=85",
    author: "Vikram Patel",
    readTime: "6 min read",
    published: true,
    createdAt: "2026-03-28T10:00:00.000Z",
  },
];
let nextId = 5;

/* ── GET published articles (public) ── */
router.get("/articles", (_req, res) => {
  const published = articles
    .filter(a => a.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ articles: published, total: published.length });
});

/* ── GET all articles (admin only) ── */
router.get("/articles/all", requireAdmin, (_req, res) => {
  const sorted = [...articles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ articles: sorted, total: sorted.length });
});

/* ── Create article (admin only) ── */
router.post("/articles", requireAdmin, (req, res) => {
  const { title, tag, excerpt, content, img, author, readTime } = req.body as Partial<Article>;
  if (!title || !tag || !excerpt) {
    res.status(400).json({ error: "title, tag and excerpt are required." });
    return;
  }
  const article: Article = {
    id: nextId++,
    title: String(title),
    tag: String(tag || "General"),
    excerpt: String(excerpt),
    content: String(content || excerpt),
    img: String(img || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=85"),
    author: String(author || "Editorial Team"),
    readTime: String(readTime || "3 min read"),
    published: true,
    createdAt: new Date().toISOString(),
  };
  articles.push(article);
  req.log.info({ articleId: article.id, title }, "Article created");
  res.status(201).json({ success: true, article });
});

/* ── Toggle published (admin only) ── */
router.patch("/articles/:id", requireAdmin, (req, res) => {
  const id = Number(req.params["id"]);
  const article = articles.find(a => a.id === id);
  if (!article) { res.status(404).json({ error: "Not found." }); return; }
  const { published, title, tag, excerpt } = req.body as Partial<Article>;
  if (published !== undefined) article.published = Boolean(published);
  if (title) article.title = String(title);
  if (tag) article.tag = String(tag);
  if (excerpt) article.excerpt = String(excerpt);
  res.json({ success: true, article });
});

/* ── Delete article (admin only) ── */
router.delete("/articles/:id", requireAdmin, (req, res) => {
  const id = Number(req.params["id"]);
  const idx = articles.findIndex(a => a.id === id);
  if (idx === -1) { res.status(404).json({ error: "Not found." }); return; }
  articles.splice(idx, 1);
  req.log.info({ articleId: id }, "Article deleted");
  res.json({ success: true });
});

export default router;
