import type { Venue } from "@/data/venues";
import type { Vendor } from "@/data/vendors";
import * as XLSX from "xlsx";

const toString = (value: unknown) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

const normalizeHeader = (header: string) =>
  header
    .trim()
    .toLowerCase()
    .replace(/[_\-\s]+/g, " ")
    .replace(/[^a-z0-9 ]/g, "");

const fieldNames = {
  property_name: ["property name", "venue name", "name", "property_name"],
  city_sheet: ["city_sheet", "city", "state", "location", "venue city"],
  type: ["type", "category", "venue type", "service type"],
  max_rooms: ["max rooms", "rooms", "room count"],
  max_banquet_capacity: ["max banquet capacity", "capacity", "guest capacity", "banquet capacity"],
  contact_number: ["contact number", "contact", "phone", "phone number", "mobile", "mobile number"],
  concerned_person_name: ["concerned person name", "contact person", "person name", "manager", "representative"],
  catering_type: ["catering type", "catering", "menu type"],
  location: ["location", "address", "venue location", "city"],
  vendor_category: ["category", "vendor category", "service", "type"],
  vendor_name: ["name", "vendor name", "company", "business name"],
  vendor_company: ["company", "vendor company", "business name", "organization"],
  vendor_city: ["city", "location", "venue city", "state"],
  vendor_state: ["state", "region", "province", "territory"],
  vendor_contact: ["contact", "phone", "phone number", "email", "email address", "mobile"],
  vendor_image: ["image", "photo", "image url", "photo url", "logo"],
  vendor_rating: ["rating", "stars", "review rating"],
};

function findValue(row: Record<string, unknown>, keys: string[]) {
  for (const prop of Object.keys(row)) {
    const normalized = normalizeHeader(prop);
    if (keys.includes(normalized)) {
      return row[prop];
    }
  }
  return undefined;
}

function normalizeVenueCategory(raw: string) {
  const value = toString(raw).toUpperCase();
  if (value.includes("RESORT")) return "RESORT";
  if (value.includes("HOTEL")) return "HOTEL";
  if (value.includes("FARMHOUSE")) return "FARMHOUSE";
  if (value.includes("BANQUET")) return "BANQUET";
  if (value.includes("PALACE")) return "PALACE";
  if (value.includes("BEACH")) return "BEACH VENUE";
  if (value.includes("HILL")) return "HILLTOP";
  return value || "HOTEL";
}

function normalizeVendorCategory(raw: string) {
  const value = toString(raw).toUpperCase();
  if (value.includes("MAKE")) return "MAKEUP ARTIST";
  if (value.includes("PHOTO")) return "PHOTOGRAPHER";
  if (value.includes("CATER")) return "CATERER";
  if (value.includes("DECOR")) return "DECOR";
  if (value.includes("MEHEND")) return "MEHENDI";
  if (value.includes("DJ") || value.includes("MUSIC")) return "MUSIC & DJ";
  if (value.includes("ENTERTAIN")) return "ENTERTAINMENT";
  if (value.includes("PLANNER")) return "WEDDING PLANNERS";
  if (value.includes("FLOR")) return "FLORIST";
  return value || "VENDOR";
}

function normalizeCityForFilter(value: string) {
  const raw = toString(value).toLowerCase();
  if (!raw) return "";
  if (raw.includes("goa")) return "GOA";
  return raw.toUpperCase();
}

function parseVenueRow(row: Record<string, unknown>): Venue | null {
  const name = toString(findValue(row, fieldNames.property_name));
  if (!name) return null;

  const cityRaw = toString(findValue(row, fieldNames.city_sheet));
  const city = cityRaw ? normalizeCityForFilter(cityRaw) : "";
  if (!city) return null;

  const type = normalizeVenueCategory(toString(findValue(row, fieldNames.type)));
  const location = toString(findValue(row, fieldNames.location)) || cityRaw;
  const contact = toString(findValue(row, fieldNames.contact_number));
  const person = toString(findValue(row, fieldNames.concerned_person_name));
  const catering = toString(findValue(row, fieldNames.catering_type));
  const rooms = toString(findValue(row, fieldNames.max_rooms));
  const capacity = toString(findValue(row, fieldNames.max_banquet_capacity));

  return {
    property_name: name,
    city_sheet: city,
    type,
    max_rooms: rooms,
    max_banquet_capacity: capacity,
    contact_number: contact,
    concerned_person_name: person,
    catering_type: catering,
    location: location || city,
  };
}

function parseVendorRow(row: Record<string, unknown>): Vendor | null {
  const rawName = toString(findValue(row, fieldNames.vendor_name));
  const rawCompany = toString(findValue(row, fieldNames.vendor_company));
  const name = rawName || rawCompany;
  if (!name) return null;

  const category = normalizeVendorCategory(toString(findValue(row, fieldNames.vendor_category)));
  const city = toString(findValue(row, fieldNames.vendor_city));
  const state = toString(findValue(row, fieldNames.vendor_state));
  const phone = toString(findValue(row, fieldNames.vendor_contact));
  const email = toString(findValue(row, ["email", "email address"]));
  const contact = [phone, email].filter(Boolean).join(" · ");
  const image = toString(findValue(row, fieldNames.vendor_image));
  const ratingValue = findValue(row, fieldNames.vendor_rating);
  const rating = ratingValue ? Number(ratingValue) : undefined;

  return {
    category,
    name,
    company: rawCompany || name,
    city: city || state || "",
    contact,
    state,
    rating: Number.isFinite(rating) ? rating : undefined,
    image: image || undefined,
  };
}

function uniqueBy<T>(rows: T[], keyFn: (item: T) => string) {
  const map = new Map<string, T>();
  rows.forEach(row => {
    const key = keyFn(row).toLowerCase();
    if (key && !map.has(key)) map.set(key, row);
  });
  return Array.from(map.values());
}

async function loadJsonFromXlsx(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Excel file not found");
  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
}

export async function loadVenueDataFromExcel(url: string): Promise<Venue[]> {
  const rows = await loadJsonFromXlsx(url);
  const parsed: Venue[] = rows.map(parseVenueRow).filter((item): item is Venue => item !== null);
  return uniqueBy(parsed, row => `${row.property_name}|${row.city_sheet}`);
}

export async function loadVendorDataFromExcel(url: string): Promise<Vendor[]> {
  const rows = await loadJsonFromXlsx(url);
  const parsed: Vendor[] = rows.map(parseVendorRow).filter((item): item is Vendor => item !== null);
  return uniqueBy(parsed, row => `${row.name}|${row.company}|${row.city}`);
}
