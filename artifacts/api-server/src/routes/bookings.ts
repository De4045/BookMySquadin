import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, bookingsTable } from "@workspace/db";
import { sendBookingConfirmation } from "../lib/mailer.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

export type Booking = typeof bookingsTable.$inferSelect;

function sessionUserId(
  req: Parameters<Parameters<typeof router.post>[1]>[0],
): number | undefined {
  const s = req.session as unknown as Record<string, unknown>;
  const uid = s["userId"];
  return typeof uid === "number" ? uid : undefined;
}

/* ── Create booking ── */
router.post("/bookings", async (req, res) => {
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

  const isPaid = Boolean(advancePaid);

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      userId:           sessionUserId(req) ?? null,
      vendorName:       String(vendorName),
      vendorCategory:   String(vendorCategory || ""),
      city:             String(city || ""),
      packageName:      String(packageName),
      packagePrice:     Number(packagePrice) || 0,
      eventDate:        String(eventDate),
      eventType:        String(eventType || ""),
      guestCount:       Number(guestCount) || 0,
      consultationDate: consultationDate ? String(consultationDate) : null,
      consultationTime: consultationTime ? String(consultationTime) : null,
      name:             String(name),
      email:            String(email).toLowerCase().trim(),
      phone:            String(phone),
      message:          message ? String(message) : null,
      advancePaid:      isPaid,
      advanceAmount:    Number(advanceAmount) || 0,
      status:           isPaid ? "advance_paid" : "pending",
    })
    .returning();

  req.log.info(
    { bookingId: booking!.id, vendorName, status: booking!.status },
    "New booking created",
  );

  sendBookingConfirmation(booking!.email, {
    name:          booking!.name,
    vendorName:    booking!.vendorName,
    packageName:   booking!.packageName,
    eventDate:     booking!.eventDate,
    eventType:     booking!.eventType,
    advancePaid:   booking!.advancePaid,
    advanceAmount: booking!.advanceAmount,
  }).catch(() => {});

  res.status(201).json({ success: true, booking, id: booking!.id });
});

/* ── Get all bookings (admin) ── */
router.get("/bookings", requireAdmin, async (_req, res) => {
  const rows = await db
    .select()
    .from(bookingsTable)
    .orderBy(desc(bookingsTable.createdAt));
  res.json({ bookings: rows, total: rows.length });
});

/* ── Get current user's bookings ── */
router.get("/bookings/my", requireAuth, async (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) {
    res.json({ bookings: [], total: 0 });
    return;
  }
  const rows = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.userId, uid))
    .orderBy(desc(bookingsTable.createdAt));
  res.json({ bookings: rows, total: rows.length });
});

/* ── Get bookings for vendor/venue portal (auth required) ── */
router.get("/bookings/portal", requireAuth, async (_req, res) => {
  const rows = await db
    .select()
    .from(bookingsTable)
    .orderBy(desc(bookingsTable.createdAt))
    .limit(100);
  res.json({ bookings: rows, total: rows.length });
});

/* ── Update booking status (admin) ── */
router.patch("/bookings/:id/status", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  const { status } = req.body as { status?: string };
  const VALID = [
    "pending",
    "confirmed",
    "advance_paid",
    "completed",
    "cancelled",
  ] as const;

  if (!status || !VALID.includes(status as (typeof VALID)[number])) {
    res.status(400).json({ error: "Invalid status." });
    return;
  }

  const [updated] = await db
    .update(bookingsTable)
    .set({ status: status as Booking["status"] })
    .where(eq(bookingsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Booking not found." });
    return;
  }

  req.log.info({ bookingId: id, status }, "Booking status updated");
  res.json({ success: true, booking: updated });
});

export default router;
