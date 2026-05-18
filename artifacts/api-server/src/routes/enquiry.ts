import { Router, type IRouter } from "express";
import { sendEnquiryReceipt } from "../lib/mailer.js";

const router: IRouter = Router();

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
  message: string;
  createdAt: string;
}

const enquiries: Enquiry[] = [];
let nextId = 1;

function sessionUserId(req: Parameters<Parameters<typeof router.post>[1]>[0]): number | undefined {
  const session = req.session as unknown as Record<string, unknown>;
  const uid = session["userId"];
  return typeof uid === "number" ? uid : undefined;
}

// General contact enquiry
router.post("/enquiry/contact", (req, res) => {
  const { name, email, phone, message } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    res.status(400).json({ error: "Name, email, and message are required" });
    return;
  }

  const enquiry: Enquiry = {
    id: nextId++,
    userId: sessionUserId(req),
    type: "contact",
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone?.trim() || "",
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };
  enquiries.push(enquiry);
  req.log.info({ enquiryId: enquiry.id }, "Contact enquiry received");
  sendEnquiryReceipt(enquiry.email, {
    name: enquiry.name,
    subject: "General Contact",
    message: enquiry.message,
  }).catch(() => {});
  res.status(201).json({ success: true, message: "Thank you for reaching out! We'll respond within 24 hours.", id: enquiry.id });
});

// Business listing application
router.post("/enquiry/listing", (req, res) => {
  const { businessName, ownerName, category, city, phone, email, website, experience, priceRange, description } = req.body as Record<string, string>;

  if (!businessName || !ownerName || !category || !city || !phone || !email) {
    res.status(400).json({ error: "All required fields must be provided" });
    return;
  }

  const enquiry: Enquiry = {
    id: nextId++,
    userId: sessionUserId(req),
    type: "listing",
    name: ownerName.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    businessName: businessName.trim(),
    category,
    city,
    message: `Experience: ${experience || "N/A"} | Price: ${priceRange || "N/A"} | Website: ${website || "N/A"} | Description: ${description || "N/A"}`,
    createdAt: new Date().toISOString(),
  };
  enquiries.push(enquiry);
  req.log.info({ enquiryId: enquiry.id, businessName }, "Business listing application received");
  res.status(201).json({
    success: true,
    message: "Application received! Our team will review and contact you within 48 hours.",
    id: enquiry.id,
  });
});

// Vendor booking enquiry
router.post("/enquiry/vendor", (req, res) => {
  const { name, email, phone, vendorName, vendorCategory, eventDate, city, message } = req.body as Record<string, string>;

  if (!name || !email || !phone) {
    res.status(400).json({ error: "Name, email, and phone are required" });
    return;
  }

  const enquiry: Enquiry = {
    id: nextId++,
    userId: sessionUserId(req),
    type: "vendor",
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    category: vendorCategory,
    city,
    message: `Vendor: ${vendorName || "N/A"} | Date: ${eventDate || "N/A"} | Message: ${message || "N/A"}`,
    createdAt: new Date().toISOString(),
  };
  enquiries.push(enquiry);
  req.log.info({ enquiryId: enquiry.id, vendorName }, "Vendor enquiry received");
  res.status(201).json({ success: true, message: "Enquiry sent! The vendor will contact you shortly.", id: enquiry.id });
});

// Get all enquiries (admin)
router.get("/enquiries", (req, res) => {
  const session = req.session as unknown as Record<string, unknown>;
  const userId = session["userId"];
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({ enquiries, total: enquiries.length });
});

// Get current user's enquiries (vendor + contact + listing types)
router.get("/enquiries/my", (req, res) => {
  const uid = sessionUserId(req);
  if (!uid) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const mine = enquiries.filter((e) => e.userId === uid);
  res.json({ enquiries: mine, total: mine.length });
});

export default router;
