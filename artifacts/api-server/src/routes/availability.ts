import { Router, type IRouter } from "express";
import { getBlockedDates, blockDate, unblockDate } from "../lib/availabilityStore.js";
import { users } from "../lib/usersStore.js";

const router: IRouter = Router();

function sessionUserId(req: Parameters<Parameters<typeof router.get>[1]>[0]): number | undefined {
  const session = req.session as unknown as Record<string, unknown>;
  const uid = session["userId"];
  return typeof uid === "number" ? uid : undefined;
}

router.get("/availability", (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) { res.status(401).json({ error: "Not authenticated" }); return; }
  res.json({ blockedDates: getBlockedDates(uid) });
});

router.get("/availability/public", (req, res) => {
  const name = (req.query["name"] as string | undefined)?.toLowerCase().trim() ?? "";
  const vendor = users.find(u => u.role === "vendor" && u.name.toLowerCase().includes(name));
  if (!vendor) { res.json({ blockedDates: [] }); return; }
  res.json({ blockedDates: getBlockedDates(vendor.id) });
});

router.post("/availability/block", (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) { res.status(401).json({ error: "Not authenticated" }); return; }
  const { date, reason = "Booked" } = req.body as { date?: string; reason?: string };
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "date must be YYYY-MM-DD" }); return;
  }
  const entry = blockDate(uid, date, reason);
  req.log.info({ uid, date }, "Date blocked");
  res.status(201).json({ entry });
});

router.delete("/availability/block/:date", (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) { res.status(401).json({ error: "Not authenticated" }); return; }
  const { date } = req.params as { date: string };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "date must be YYYY-MM-DD" }); return;
  }
  const ok = unblockDate(uid, date);
  res.json({ success: ok });
});

export default router;
