import { Router, type IRouter } from "express";

const router: IRouter = Router();

interface Venue {
  id: number;
  property_name: string;
  type: string;
  city_sheet: string;
  location: string;
  contact_number: string;
  max_rooms?: number;
  max_banquet_capacity?: number;
}

// In-memory store — replace with DB in production
const enquiries: Array<{
  id: number;
  name: string;
  email: string;
  phone: string;
  venueId?: number;
  venueName?: string;
  eventDate?: string;
  message: string;
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
