import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as XLSX from "xlsx";

const DATA_DIR = resolve(process.cwd(), "data");
const TTL      = 30_000; // ms — re-reads Excel after 30 s so file updates show without restart

/* ── Types ─────────────────────────────────────────────────────────────── */

export interface VendorRow {
  id:       number;
  category: string;
  name:     string;
  company:  string;
  city:     string;
  contact:  string;
  state:    string;
}

export interface VenueRow {
  id:                    number;
  property_name:         string;
  city_sheet:            string;
  type:                  string;
  max_rooms:             string;
  max_banquet_capacity:  string;
  contact_number:        string;
  concerned_person_name: string;
  catering_type:         string;
  location:              string;
}

/* ── Column helpers ─────────────────────────────────────────────────────── */

function pick(row: Record<string, unknown>, ...candidates: string[]): string {
  for (const rawKey of Object.keys(row)) {
    const k = rawKey.trim().toUpperCase().replace(/\s+/g, " ");
    for (const c of candidates) {
      if (k === c.toUpperCase().replace(/\s+/g, " ")) {
        return String(row[rawKey] ?? "").trim();
      }
    }
  }
  return "";
}

/**
 * Name lookup: tries the standard NAME column first, then falls back to the
 * first column's value.  Some sheets (e.g. MAKE UP ARTIST) use a city name
 * as the first column header but still put the person's name in that column.
 */
function pickName(row: Record<string, unknown>): string {
  const std = pick(row, "NAME");
  if (std) return std;
  const firstVal = String(Object.values(row)[0] ?? "").trim();
  return firstVal;
}

/* ── In-memory cache ────────────────────────────────────────────────────── */

let vendorCache: { data: VendorRow[]; ts: number } | null = null;
let venueCache:  { data: VenueRow[]; ts: number }  | null = null;

/* ── Vendor reader ──────────────────────────────────────────────────────── */

function readVendorFile(): VendorRow[] {
  try {
    const buf  = readFileSync(resolve(DATA_DIR, "vendors.xlsx"));
    const wb   = XLSX.read(buf, { type: "buffer" });
    const rows: VendorRow[] = [];
    let   id   = 1;

    for (const sheetName of wb.SheetNames) {
      const category = sheetName.trim().toUpperCase();
      const ws       = wb.Sheets[sheetName];
      const data     = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });

      for (const raw of data) {
        const name = pickName(raw);
        if (!name) continue;
        rows.push({
          id:      id++,
          category,
          name,
          company: pick(raw, "COMPANY NAME", "COMPANY"),
          city:    pick(raw, "CITY"),
          contact: String(pick(raw, "CONTACT NUMBER", "CONTACT")).replace(/[^\d+(),\s-]/g, "").trim(),
          state:   pick(raw, "STATE"),
        });
      }
    }
    return rows;
  } catch {
    return [];
  }
}

export function loadVendors(): VendorRow[] {
  const now = Date.now();
  if (vendorCache && now - vendorCache.ts < TTL) return vendorCache.data;
  const data = readVendorFile();
  vendorCache = { data, ts: now };
  return data;
}

/* ── Venue reader ───────────────────────────────────────────────────────── */

function readVenueFile(): VenueRow[] {
  try {
    const buf  = readFileSync(resolve(DATA_DIR, "venues.xlsx"));
    const wb   = XLSX.read(buf, { type: "buffer" });
    const rows: VenueRow[] = [];
    let   id   = 1;

    for (const sheetName of wb.SheetNames) {
      const citySheet = sheetName.trim().toUpperCase();
      const ws        = wb.Sheets[sheetName];
      const data      = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });

      for (const raw of data) {
        const name = pick(raw, "PROPERTY NAME");
        if (!name) continue;
        rows.push({
          id:                    id++,
          property_name:         name,
          city_sheet:            citySheet,
          type:                  pick(raw, "TYPE").toUpperCase() || "BANQUET",
          max_rooms:             String(pick(raw, "MAX NO OF ROOMS", "MAX ROOMS") || ""),
          max_banquet_capacity:  String(pick(raw, "MAX BANQUET CAPACITY", "BANQUET CAPACITY") || ""),
          contact_number:        String(pick(raw, "CONTACT NUMBER", "CONTACT") || ""),
          concerned_person_name: pick(raw, "CONCERNED PERSON NAME", "CONCERNED PERSON"),
          catering_type:         pick(raw, "CATERING TYPE", "CATERING"),
          location:              pick(raw, "LOCATION") || citySheet,
        });
      }
    }
    return rows;
  } catch {
    return [];
  }
}

export function loadVenues(): VenueRow[] {
  const now = Date.now();
  if (venueCache && now - venueCache.ts < TTL) return venueCache.data;
  const data = readVenueFile();
  venueCache = { data, ts: now };
  return data;
}
