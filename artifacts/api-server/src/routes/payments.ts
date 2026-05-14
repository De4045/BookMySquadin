import { Router, type IRouter } from "express";
import { requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

interface Subscription {
  userId: number;
  role: string;
  plan: string;
  billing: "monthly" | "annual";
  startedAt: string;
  amount: number;
}

const subscriptions: Subscription[] = [];

/* Seed a few demo subscriptions */
subscriptions.push(
  { userId: 1, role: "admin",  plan: "premium",   billing: "annual",  startedAt: "2026-01-01T00:00:00.000Z", amount: 59999 },
  { userId: 2, role: "vendor", plan: "essential",  billing: "monthly", startedAt: "2026-02-01T00:00:00.000Z", amount: 2999 },
  { userId: 3, role: "venue",  plan: "premium",    billing: "monthly", startedAt: "2026-03-01T00:00:00.000Z", amount: 5999 },
  { userId: 4, role: "user",   plan: "member",     billing: "monthly", startedAt: "2026-04-01T00:00:00.000Z", amount: 499 },
);

router.get("/payments/subscription", (req, res) => {
  const session = req.session as unknown as Record<string, unknown>;
  const userId = session["userId"] as number | undefined;
  if (!userId) { res.status(401).json({ error: "Not authenticated." }); return; }

  const sub = subscriptions.find(s => s.userId === userId);
  res.json({ subscription: sub ?? null, plan: sub?.plan ?? "basic" });
});

router.post("/payments/subscribe", (req, res) => {
  const session = req.session as unknown as Record<string, unknown>;
  const userId = session["userId"] as number | undefined;
  if (!userId) { res.status(401).json({ error: "Not authenticated." }); return; }

  const { plan, billing, role, amount } = req.body as {
    plan?: string; billing?: string; role?: string; amount?: number;
  };
  if (!plan || !billing) { res.status(400).json({ error: "plan and billing are required." }); return; }

  const existing = subscriptions.findIndex(s => s.userId === userId);
  const sub: Subscription = {
    userId,
    role: role ?? "user",
    plan: plan ?? "basic",
    billing: (billing === "annual" ? "annual" : "monthly") as "monthly" | "annual",
    startedAt: new Date().toISOString(),
    amount: amount ?? 0,
  };

  if (existing >= 0) subscriptions[existing] = sub;
  else subscriptions.push(sub);

  res.json({ success: true, subscription: sub });
});

router.get("/admin/payments", requireAdmin, (_req, res) => {
  const planPrices: Record<string, number> = {
    essential: 2999, premium: 5999, member: 499,
  };

  const active = subscriptions.filter(s => s.plan !== "basic" && s.plan !== "guest");
  const mrr = active.reduce((sum, s) => {
    const monthly = s.billing === "annual" ? Math.round(s.amount / 12) : s.amount;
    return sum + monthly;
  }, 0);

  const breakdown = {
    essential: subscriptions.filter(s => s.plan === "essential").length,
    premium:   subscriptions.filter(s => s.plan === "premium").length,
    member:    subscriptions.filter(s => s.plan === "member").length,
    free:      subscriptions.filter(s => s.plan === "basic" || s.plan === "guest").length,
  };

  const recentTransactions = [
    { id: "TXN-9821", name: "Rahul Sharma",   plan: "Essential Monthly", amount: 2999,  date: "14 May 2026", method: "UPI",          status: "success" },
    { id: "TXN-9820", name: "Priya Nair",      plan: "Premium Annual",    amount: 59999, date: "13 May 2026", method: "Card •••• 4242", status: "success" },
    { id: "TXN-9819", name: "Arun Events",     plan: "Essential Monthly", amount: 2999,  date: "12 May 2026", method: "UPI",          status: "success" },
    { id: "TXN-9818", name: "The Grand Venue", plan: "Premium Monthly",   amount: 5999,  date: "11 May 2026", method: "Card •••• 5678", status: "success" },
    { id: "TXN-9817", name: "Meera Singh",     plan: "Member Monthly",    amount: 499,   date: "10 May 2026", method: "UPI",          status: "success" },
    { id: "TXN-9816", name: "Infinity Eventz", plan: "Premium Annual",    amount: 59999, date: "08 May 2026", method: "Card •••• 9012", status: "success" },
    { id: "TXN-9815", name: "Royal Banquet",   plan: "Essential Monthly", amount: 2999,  date: "06 May 2026", method: "UPI",          status: "success" },
    { id: "TXN-9814", name: "Kavita Mehta",    plan: "Member Monthly",    amount: 499,   date: "04 May 2026", method: "UPI",          status: "success" },
  ];

  res.json({
    mrr,
    arr: mrr * 12,
    totalSubscribers: active.length,
    conversionRate: subscriptions.length > 0 ? Math.round((active.length / subscriptions.length) * 100) : 0,
    breakdown,
    recentTransactions,
    totalRevenue: recentTransactions.reduce((s, t) => s + t.amount, 0),
  });
});

export default router;
