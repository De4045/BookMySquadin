import { Router, type IRouter } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

export interface Booking {
  id: number;
  userId?: number;
  vendorName: string;
  vendorCategory: string;
  city: string;
  packageName: string;
  packagePrice: number;
  eventDate: string;
  eventType: string;
  guestCount: number;
  consultationDate?: string;
  consultationTime?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  advancePaid: boolean;
  advanceAmount: number;
  status: "pending" | "confirmed" | "advance_paid" | "completed" | "cancelled";
  createdAt: string;
}

const bookings: Booking[] = [];
let nextId = 1;

function sessionUserId(
  req: Parameters<Parameters<typeof router.post>[1]>[0],
): number | undefined {
  const s = req.session as unknown as Record<string, unknown>;
  const uid = s["userId"];
  return typeof uid === "number" ? uid : undefined;
}

/* ── Create booking ── */
router.post("/bookings", (req, res) => {
  const {
    vendorName, vendorCategory, city,
    packageName, packagePrice,
    eventDate, eventType, guestCount,
    consultationDate, consultationTime,
    name, email, phone, message,
    advancePaid, advanceAmount,
  } = req.body as Record<string, string | number | boolean>;

  if (!vendorName || !packageName || !eventDate || !name || !email || !phone) {
    res.status(400).json({ error: "Required fields missing." });
    return;
  }

  const booking: Booking = {
    id: nextId++,
    userId: sessionUserId(req),
    vendorName: String(vendorName),
    vendorCategory: String(vendorCategory || ""),
    city: String(city || ""),
    packageName: String(packageName),
    packagePrice: Number(packagePrice) || 0,
    eventDate: String(eventDate),
    eventType: String(eventType || ""),
    guestCount: Number(guestCount) || 0,
    consultationDate: consultationDate ? String(consultationDate) : undefined,
    consultationTime: consultationTime ? String(consultationTime) : undefined,
    name: String(name),
    email: String(email).toLowerCase().trim(),
    phone: String(phone),
    message: message ? String(message) : undefined,
    advancePaid: Boolean(advancePaid),
    advanceAmount: Number(advanceAmount) || 0,
    status: advancePaid ? "advance_paid" : "pending",
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);
  req.log.info({ bookingId: booking.id, vendorName, status: booking.status }, "New booking created");
  res.status(201).json({ success: true, booking, id: booking.id });
});

/* ── Get all bookings (admin) ── */
router.get("/bookings", requireAdmin, (_req, res) => {
  const sorted = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  res.json({ bookings: sorted, total: sorted.length });
});

/* ── Get current user's bookings ── */
router.get("/bookings/my", requireAuth, (req, res) => {
  const uid = sessionUserId(req);
  const mine = uid
    ? bookings.filter((b) => b.userId === uid)
    : [];
  const sorted = [...mine].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  res.json({ bookings: sorted, total: sorted.length });
});

/* ── Get bookings for vendor/venue portal (auth required) ── */
router.get("/bookings/portal", requireAuth, (_req, res) => {
  const sorted = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  res.json({ bookings: sorted.slice(0, 100), total: sorted.length });
});

/* ── Update booking status (admin) ── */
router.patch("/bookings/:id/status", requireAdmin, (req, res) => {
  const id = Number(req.params["id"]);
  const { status } = req.body as { status?: string };
  const VALID = ["pending", "confirmed", "advance_paid", "completed", "cancelled"];

  if (!status || !VALID.includes(status)) {
    res.status(400).json({ error: "Invalid status." });
    return;
  }

  const booking = bookings.find((b) => b.id === id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found." });
    return;
  }

  booking.status = status as Booking["status"];
  req.log.info({ bookingId: id, status }, "Booking status updated");
  res.json({ success: true, booking });
});

export default router;
