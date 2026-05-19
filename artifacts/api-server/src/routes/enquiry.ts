import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, enquiriesTable } from "@workspace/db";
import { sendEnquiryReceipt } from "../lib/mailer.js";

const router: IRouter = Router();

export type LeadStatus = "new" | "replied" | "converted";
export type Enquiry = typeof enquiriesTable.$inferSelect;

function sessionUserId(
  req: Parameters<Parameters<typeof router.post>[1]>[0],
): number | undefined {
  const session = req.session as unknown as Record<string, unknown>;
  const uid = session["userId"];
  return typeof uid === "number" ? uid : undefined;
}

/* ── General contact enquiry ── */
router.post("/enquiry/contact", async (req, res) => {
  const { name, email, phone, message } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };
  if (!name || !email || !message) {
    res
      .status(400)
      .json({ error: "Name, email, and message are required" });
    return;
  }

  const [enquiry] = await db
    .insert(enquiriesTable)
    .values({
      userId:  sessionUserId(req) ?? null,
      type:    "contact",
      name:    name.trim(),
      email:   email.toLowerCase().trim(),
      phone:   phone?.trim() ?? "",
      message: message.trim(),
      status:  "new",
    })
    .returning();

  req.log.info({ enquiryId: enquiry!.id }, "Contact enquiry received");
  sendEnquiryReceipt(enquiry!.email, {
    name:    enquiry!.name,
    subject: "General Contact",
    message: enquiry!.message,
  }).catch(() => {});
  res.status(201).json({
    success: true,
    message: "Thank you for reaching out! We'll respond within 24 hours.",
    id: enquiry!.id,
  });
});

/* ── Business listing application ── */
router.post("/enquiry/listing", async (req, res) => {
  const {
    businessName, ownerName, category, city, phone, email,
    website, experience, priceRange, description,
  } = req.body as Record<string, string>;

  if (!businessName || !ownerName || !category || !city || !phone || !email) {
    res.status(400).json({ error: "All required fields must be provided" });
    return;
  }

  const [enquiry] = await db
    .insert(enquiriesTable)
    .values({
      userId:       sessionUserId(req) ?? null,
      type:         "listing",
      name:         ownerName.trim(),
      email:        email.toLowerCase().trim(),
      phone:        phone.trim(),
      businessName: businessName.trim(),
      category,
      city,
      message: `Experience: ${experience || "N/A"} | Price: ${priceRange || "N/A"} | Website: ${website || "N/A"} | Description: ${description || "N/A"}`,
      status:  "new",
    })
    .returning();

  req.log.info(
    { enquiryId: enquiry!.id, businessName },
    "Business listing application received",
  );
  res.status(201).json({
    success: true,
    message:
      "Application received! Our team will review and contact you within 48 hours.",
    id: enquiry!.id,
  });
});

/* ── Vendor booking enquiry ── */
router.post("/enquiry/vendor", async (req, res) => {
  const {
    name, email, phone, vendorName, vendorCategory, eventDate, city, message,
  } = req.body as Record<string, string>;

  if (!name || !email || !phone) {
    res.status(400).json({ error: "Name, email, and phone are required" });
    return;
  }

  const [enquiry] = await db
    .insert(enquiriesTable)
    .values({
      userId:     sessionUserId(req) ?? null,
      type:       "vendor",
      name:       name.trim(),
      email:      email.toLowerCase().trim(),
      phone:      phone.trim(),
      category:   vendorCategory,
      city,
      vendorName: vendorName?.trim(),
      message:    `Vendor: ${vendorName || "N/A"} | Date: ${eventDate || "N/A"} | Message: ${message || "N/A"}`,
      status:     "new",
    })
    .returning();

  req.log.info({ enquiryId: enquiry!.id, vendorName }, "Vendor enquiry received");
  res.status(201).json({
    success: true,
    message: "Enquiry sent! The vendor will contact you shortly.",
    id: enquiry!.id,
  });
});

/* ── Venue enquiry ── */
router.post("/enquiry/venue", async (req, res) => {
  const {
    name, email, phone, venueName, eventDate, guestCount, city, message,
  } = req.body as Record<string, string>;

  if (!name || !email || !phone) {
    res.status(400).json({ error: "Name, email, and phone are required" });
    return;
  }

  const [enquiry] = await db
    .insert(enquiriesTable)
    .values({
      userId:     sessionUserId(req) ?? null,
      type:       "venue",
      name:       name.trim(),
      email:      email.toLowerCase().trim(),
      phone:      phone.trim(),
      vendorName: venueName?.trim(),
      city,
      message:    `Venue: ${venueName || "N/A"} | Date: ${eventDate || "N/A"} | Guests: ${guestCount || "N/A"} | Message: ${message || "N/A"}`,
      status:     "new",
    })
    .returning();

  req.log.info({ enquiryId: enquiry!.id, venueName }, "Venue enquiry received");
  res.status(201).json({
    success: true,
    message: "Enquiry sent! The venue will contact you shortly.",
    id: enquiry!.id,
  });
});

/* ── Get all enquiries (admin only) ── */
router.get("/enquiries", async (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const rows = await db
    .select()
    .from(enquiriesTable)
    .orderBy(desc(enquiriesTable.createdAt));
  res.json({ enquiries: rows, total: rows.length });
});

/* ── Get current user's enquiries ── */
router.get("/enquiries/my", async (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const rows = await db
    .select()
    .from(enquiriesTable)
    .where(eq(enquiriesTable.userId, uid))
    .orderBy(desc(enquiriesTable.createdAt));
  res.json({ enquiries: rows, total: rows.length });
});

/* ── Update lead status ── */
router.patch("/enquiries/:id/status", async (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const id = Number(req.params["id"]);
  const { status } = req.body as { status?: string };
  const valid: LeadStatus[] = ["new", "replied", "converted"];

  if (!status || !valid.includes(status as LeadStatus)) {
    res
      .status(400)
      .json({ error: "status must be new | replied | converted" });
    return;
  }

  const [existing] = await db
    .select()
    .from(enquiriesTable)
    .where(eq(enquiriesTable.id, id))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const session = req.session as unknown as Record<string, unknown>;
  const role = (session["role"] as string | undefined) ?? "";
  if (role !== "admin" && existing.userId !== uid) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const [updated] = await db
    .update(enquiriesTable)
    .set({ status: status as LeadStatus })
    .where(eq(enquiriesTable.id, id))
    .returning();

  req.log.info({ enquiryId: id, status }, "Lead status updated");
  res.json({ enquiry: updated });
});

export default router;
