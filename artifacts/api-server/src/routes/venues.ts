import { Router, type IRouter } from "express";

const router: IRouter = Router();

/* ── Booked-dates store: venueName → Set<"YYYY-MM-DD"> ── */
const bookedDatesMap = new Map<string, Set<string>>();

function normDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0] ?? "";
}

function addBookedDate(venueName: string, rawDate: string) {
  const date = normDate(rawDate);
  if (!date || !venueName) return;
  if (!bookedDatesMap.has(venueName)) bookedDatesMap.set(venueName, new Set());
  bookedDatesMap.get(venueName)!.add(date);
}

/* ── Enquiries store ── */
const enquiries: Array<{
  id: number;
  name: string;
  email: string;
  phone: string;
  venueId?: number;
  venueName?: string;
  eventDate?: string;
  message: string;
  status: "new" | "contacted" | "booked";
  createdAt: string;
}> = [];

let enquiryId = 1;

/* ── Routes ── */

router.get("/venues/stats", (_req, res) => {
  res.json({
    total: 436,
    cities: 24,
    types: ["HOTEL", "RESORT", "FARMHOUSE", "BANQUET"],
  });
});

router.get("/venues/enquiries", (req, res) => {
  const session = req.session as Record<string, unknown>;
  const userId = session["userId"];
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({ enquiries, total: enquiries.length });
});

/**
 * GET /api/venues/availability?venueName=<name>
 * Returns booked dates (YYYY-MM-DD) for a given venue.
 * Public endpoint — no auth required (availability is visible to anyone).
 */
router.get("/venues/availability", (req, res) => {
  const venueName = String(req.query["venueName"] ?? "").trim();
  const dates = bookedDatesMap.get(venueName);
  res.json({
    venueName,
    bookedDates: dates ? Array.from(dates).sort() : [],
  });
});

/**
 * POST /api/venues/enquiry
 * Submits an enquiry and registers the event date as booked for that venue.
 */
router.post("/venues/enquiry", (req, res) => {
  const { name, email, phone, venueId, venueName, eventDate, message } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    venueId?: number;
    venueName?: string;
    eventDate?: string;
    message?: string;
  };

  if (!name || !email || !phone) {
    res.status(400).json({ error: "Name, email, and phone are required" });
    return;
  }

  const enquiry = {
    id: enquiryId++,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    venueId,
    venueName,
    eventDate,
    message: message?.trim() || "",
    status: "new" as const,
    createdAt: new Date().toISOString(),
  };

  enquiries.push(enquiry);

  /* Register the date as booked for this venue */
  if (eventDate && venueName) addBookedDate(venueName, eventDate);

  req.log.info({ enquiryId: enquiry.id, venueName, eventDate }, "Venue enquiry received");

  res.status(201).json({
    success: true,
    message: "Your enquiry has been received. Our team will contact you within 24 hours.",
    id: enquiry.id,
  });
});

/**
 * PATCH /api/venues/enquiries/:id/status
 * Venue manager marks an enquiry as contacted or booked.
 */
router.patch("/venues/enquiries/:id/status", (req, res) => {
  const session = req.session as Record<string, unknown>;
  if (!session["userId"]) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const id = Number(req.params["id"]);
  const { status } = req.body as { status?: string };
  const valid = ["new", "contacted", "booked"];
  if (!status || !valid.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  const enquiry = enquiries.find(e => e.id === id);
  if (!enquiry) {
    res.status(404).json({ error: "Enquiry not found" });
    return;
  }
  enquiry.status = status as "new" | "contacted" | "booked";
  res.json({ success: true, enquiry });
});

export default router;
