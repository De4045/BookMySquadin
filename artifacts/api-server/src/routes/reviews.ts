import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/auth.js";

const router: IRouter = Router();

interface Review {
  id: number;
  vendorName: string;
  userId: number;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
}

const reviews: Review[] = [
  { id: 1, vendorName: "Infinity Eventz", userId: 999, userName: "Priya Sharma", rating: 5, text: "Absolutely breathtaking décor! Every single detail was executed to perfection for our Udaipur destination wedding. Our guests are still talking about it.", createdAt: "2026-03-15T10:00:00.000Z" },
  { id: 2, vendorName: "Infinity Eventz", userId: 998, userName: "Rohan & Ananya Kapoor", rating: 5, text: "Professional team, flawless execution, and incredible creativity. Worth every rupee. They truly understood our vision.", createdAt: "2026-02-20T10:00:00.000Z" },
  { id: 3, vendorName: "Infinity Eventz", userId: 997, userName: "Meera Patel", rating: 4, text: "Wonderful experience overall. A few minor coordination hiccups but nothing that affected the final result. Would highly recommend.", createdAt: "2026-01-10T10:00:00.000Z" },
];
let nextId = 4;

function sessionUserId(req: Parameters<Parameters<typeof router.get>[1]>[0]): number | undefined {
  const s = req.session as unknown as Record<string, unknown>;
  const uid = s["userId"];
  return typeof uid === "number" ? uid : undefined;
}

/* ── Get reviews for a vendor ── */
router.get("/reviews", (req, res) => {
  const vendor = req.query["vendor"] as string | undefined;
  if (!vendor) {
    res.json({ reviews: [], total: 0, avgRating: 0 });
    return;
  }

  const vendorReviews = reviews
    .filter((r) => r.vendorName.toLowerCase() === vendor.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const avg = vendorReviews.length
    ? vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length
    : 0;

  res.json({
    reviews: vendorReviews,
    total: vendorReviews.length,
    avgRating: Math.round(avg * 10) / 10,
  });
});

/* ── Submit a review (auth required) ── */
router.post("/reviews", requireAuth, (req, res) => {
  const uid = sessionUserId(req);
  const { vendorName, rating, text, userName } = req.body as {
    vendorName?: string;
    rating?: number;
    text?: string;
    userName?: string;
  };

  if (!vendorName || !rating || !text) {
    res.status(400).json({ error: "vendorName, rating and text are required." });
    return;
  }

  const r = Number(rating);
  if (r < 1 || r > 5) {
    res.status(400).json({ error: "Rating must be between 1 and 5." });
    return;
  }

  const review: Review = {
    id: nextId++,
    vendorName: String(vendorName),
    userId: uid ?? 0,
    userName: String(userName || "Anonymous"),
    rating: r,
    text: String(text).slice(0, 500),
    createdAt: new Date().toISOString(),
  };

  reviews.push(review);
  req.log.info({ reviewId: review.id, vendorName }, "Review submitted");
  res.status(201).json({ success: true, review });
});

export default router;
