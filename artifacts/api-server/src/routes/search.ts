import { Router, type IRouter } from "express";
import { loadVendors } from "../lib/excel-loader.js";
import { loadVenues } from "../lib/excel-loader.js";

const router: IRouter = Router();

const CITIES = [
  "Agra","Alwar","Bangalore","Bareilly","Bikaner","Chennai","Dehradun","Delhi",
  "Faridabad","Ghaziabad","Goa","Gurgaon","Hyderabad","Jaipur","Jaisalmer",
  "Jhansi","Jodhpur","Kanpur","Leh","Lucknow","Manali","Meerut","Mumbai",
  "Noida","Prayagraj","Ramnagar","Rishikesh","Shimla","Udaipur","Varanasi",
];

const SERVICE_CATEGORIES = [
  "Photography", "Makeup Artist", "Catering", "Decor",
  "Wedding Planners", "Music & DJ", "Mehndi", "Pandit",
];

router.get("/search", (req, res) => {
  const q = ((req.query["q"] as string) || "").trim().toLowerCase();
  if (!q || q.length < 2) {
    res.json({ cities: [], vendors: [], venues: [], categories: [] });
    return;
  }

  const cities = CITIES.filter(c => c.toLowerCase().startsWith(q)).slice(0, 5);

  const categories = SERVICE_CATEGORIES
    .filter(c => c.toLowerCase().includes(q))
    .slice(0, 3);

  const allVendors = loadVendors();
  const vendors = allVendors
    .filter(v =>
      (v.name?.toLowerCase().includes(q)) ||
      (v.category?.toLowerCase().includes(q)) ||
      (v.city?.toLowerCase().includes(q)) ||
      (v.company?.toLowerCase().includes(q))
    )
    .slice(0, 6)
    .map(v => ({ name: v.name, category: v.category, city: v.city }));

  const allVenues = loadVenues();
  const venues = allVenues
    .filter(v =>
      (v.property_name?.toLowerCase().includes(q)) ||
      (v.city_sheet?.toLowerCase().includes(q)) ||
      (v.location?.toLowerCase().includes(q)) ||
      (v.type?.toLowerCase().includes(q))
    )
    .slice(0, 6)
    .map(v => ({
      name: v.property_name,
      city: v.city_sheet,
      type: v.type,
    }));

  res.json({ cities, vendors, venues, categories });
});

export default router;
