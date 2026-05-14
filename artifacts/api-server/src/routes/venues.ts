import { Router, type IRouter } from "express";

const router: IRouter = Router();

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
  req.log.info({ enquiryId: enquiry.id, venueName }, "Venue enquiry received");

  res.status(201).json({
    success: true,
    message: "Your enquiry has been received. Our team will contact you within 24 hours.",
    id: enquiry.id,
  });
});

export default router;
