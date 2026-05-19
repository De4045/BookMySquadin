import { Router, type IRouter } from "express";
import { sendEnquiryReceipt } from "../lib/mailer.js";
import { getUserById } from "../lib/usersStore.js";

const router: IRouter = Router();

export type LeadStatus = "new" | "replied" | "converted";

interface Enquiry {
  id: number;
  userId?: number;
  type: "vendor" | "venue" | "contact" | "listing";
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  category?: string;
  city?: string;
  vendorName?: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

export const enquiries: Enquiry[] = [];
let nextId = 1;

function sessionUserId(req: Parameters<Parameters<typeof router.post>[1]>[0]): number | undefined {
  const session = req.session as unknown as Record<string, unknown>;
  const uid = session["userId"];
  return typeof uid === "number" ? uid : undefined;
}

function sessionRole(req: Parameters<Parameters<typeof router.post>[1]>[0]): string | undefined {
  const uid = sessionUserId(req);
  if (!uid) return undefined;
  return getUserById(uid)?.role;
}

// General contact enquiry
router.post("/enquiry/contact", (req, res) => {
  const { name, email, phone, message } = req.body as {
    name?: string; email?: string; phone?: string; message?: string;
  };
  if (!name || !email || !message) {
    res.status(400).json({ error: "Name, email, and message are required" }); return;
  }
  const enquiry: Enquiry = {
    id: nextId++, userId: sessionUserId(req), type: "contact",
    name: name.trim(), email: email.toLowerCase().trim(),
    phone: phone?.trim() || "", message: message.trim(),
    status: "new", createdAt: new Date().toISOString(),
  };
  enquiries.push(enquiry);
  req.log.info({ enquiryId: enquiry.id }, "Contact enquiry received");
  sendEnquiryReceipt(enquiry.email, { name: enquiry.name, subject: "General Contact", message: enquiry.message }).catch(() => {});
  res.status(201).json({ success: true, message: "Thank you for reaching out! We'll respond within 24 hours.", id: enquiry.id });
});

// Business listing application
router.post("/enquiry/listing", (req, res) => {
  const { businessName, ownerName, category, city, phone, email, website, experience, priceRange, description } = req.body as Record<string, string>;
  if (!businessName || !ownerName || !category || !city || !phone || !email) {
    res.status(400).json({ error: "All required fields must be provided" }); return;
  }
  const enquiry: Enquiry = {
    id: nextId++, userId: sessionUserId(req), type: "listing",
    name: ownerName.trim(), email: email.toLowerCase().trim(), phone: phone.trim(),
    businessName: businessName.trim(), category, city,
    message: `Experience: ${experience || "N/A"} | Price: ${priceRange || "N/A"} | Website: ${website || "N/A"} | Description: ${description || "N/A"}`,
    status: "new", createdAt: new Date().toISOString(),
  };
  enquiries.push(enquiry);
  req.log.info({ enquiryId: enquiry.id, businessName }, "Business listing application received");
  res.status(201).json({ success: true, message: "Application received! Our team will review and contact you within 48 hours.", id: enquiry.id });
});

// Vendor booking enquiry
router.post("/enquiry/vendor", (req, res) => {
  const { name, email, phone, vendorName, vendorCategory, eventDate, city, message } = req.body as Record<string, string>;
  if (!name || !email || !phone) {
    res.status(400).json({ error: "Name, email, and phone are required" }); return;
  }
  const enquiry: Enquiry = {
    id: nextId++, userId: sessionUserId(req), type: "vendor",
    name: name.trim(), email: email.toLowerCase().trim(), phone: phone.trim(),
    category: vendorCategory, city, vendorName: vendorName?.trim(),
    message: `Vendor: ${vendorName || "N/A"} | Date: ${eventDate || "N/A"} | Message: ${message || "N/A"}`,
    status: "new", createdAt: new Date().toISOString(),
  };
  enquiries.push(enquiry);
  req.log.info({ enquiryId: enquiry.id, vendorName }, "Vendor enquiry received");
  res.status(201).json({ success: true, message: "Enquiry sent! The vendor will contact you shortly.", id: enquiry.id });
});

// Venue enquiry
router.post("/enquiry/venue", (req, res) => {
  const { name, email, phone, venueName, eventDate, guestCount, city, message } = req.body as Record<string, string>;
  if (!name || !email || !phone) {
    res.status(400).json({ error: "Name, email, and phone are required" }); return;
  }
  const enquiry: Enquiry = {
    id: nextId++, userId: sessionUserId(req), type: "venue",
    name: name.trim(), email: email.toLowerCase().trim(), phone: phone.trim(),
    vendorName: venueName?.trim(), city,
    message: `Venue: ${venueName || "N/A"} | Date: ${eventDate || "N/A"} | Guests: ${guestCount || "N/A"} | Message: ${message || "N/A"}`,
    status: "new", createdAt: new Date().toISOString(),
  };
  enquiries.push(enquiry);
  req.log.info({ enquiryId: enquiry.id, venueName }, "Venue enquiry received");
  res.status(201).json({ success: true, message: "Enquiry sent! The venue will contact you shortly.", id: enquiry.id });
});

// Get all enquiries (admin)
router.get("/enquiries", (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) { res.status(401).json({ error: "Not authenticated" }); return; }
  res.json({ enquiries, total: enquiries.length });
});

// Get current user's enquiries
router.get("/enquiries/my", (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) { res.status(401).json({ error: "Not authenticated" }); return; }
  const mine = enquiries.filter(e => e.userId === uid);
  res.json({ enquiries: mine, total: mine.length });
});

// Update lead status (vendor cycles new → replied → converted)
router.patch("/enquiries/:id/status", (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) { res.status(401).json({ error: "Not authenticated" }); return; }
  const role = sessionRole(req);
  const id = Number(req.params["id"]);
  const { status } = req.body as { status?: string };
  const valid: LeadStatus[] = ["new", "replied", "converted"];
  if (!status || !valid.includes(status as LeadStatus)) {
    res.status(400).json({ error: "status must be new | replied | converted" }); return;
  }
  const e = enquiries.find(x => x.id === id);
  if (!e) { res.status(404).json({ error: "Not found" }); return; }
  if (role !== "admin" && e.userId !== uid) {
    res.status(403).json({ error: "Forbidden" }); return;
  }
  e.status = status as LeadStatus;
  req.log.info({ enquiryId: id, status }, "Lead status updated");
  res.json({ enquiry: e });
});

export default router;
