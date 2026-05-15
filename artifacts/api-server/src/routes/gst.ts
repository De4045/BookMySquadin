import { Router, type IRouter } from "express";

const router: IRouter = Router();

/* ── Constants ────────────────────────────────────────────────────────── */

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const STATE_MAP: Record<string, string> = {
  "01": "Jammu & Kashmir",      "02": "Himachal Pradesh",   "03": "Punjab",
  "04": "Chandigarh",           "05": "Uttarakhand",        "06": "Haryana",
  "07": "Delhi",                "08": "Rajasthan",          "09": "Uttar Pradesh",
  "10": "Bihar",                "11": "Sikkim",             "12": "Arunachal Pradesh",
  "13": "Nagaland",             "14": "Manipur",            "15": "Mizoram",
  "16": "Tripura",              "17": "Meghalaya",          "18": "Assam",
  "19": "West Bengal",          "20": "Jharkhand",          "21": "Odisha",
  "22": "Chhattisgarh",         "23": "Madhya Pradesh",     "24": "Gujarat",
  "25": "Daman & Diu",          "26": "Dadra & Nagar Haveli", "27": "Maharashtra",
  "28": "Andhra Pradesh",       "29": "Karnataka",          "30": "Goa",
  "31": "Lakshadweep",          "32": "Kerala",             "33": "Tamil Nadu",
  "34": "Puducherry",           "35": "Andaman & Nicobar Islands",
  "36": "Telangana",            "37": "Andhra Pradesh (New)",
};

/* ── Result type ──────────────────────────────────────────────────────── */

interface GstResult {
  gstin:                  string;
  status:                 "Active" | "Cancelled" | "Suspended";
  businessName:           string;
  taxpayerType:           string;
  constitutionOfBusiness: string;
  registrationDate:       string;
  address:                string;
  stateCode:              string;
  stateName:              string;
  verifiedAt:             string;
  source:                 "masters-india" | "gov-portal";
}

/* ── In-memory cache (15-minute TTL) ─────────────────────────────────── */

const cache = new Map<string, GstResult>();

function cacheSet(gstin: string, result: GstResult) {
  cache.set(gstin, result);
  setTimeout(() => cache.delete(gstin), 15 * 60 * 1000);
}

/* ── Helpers ──────────────────────────────────────────────────────────── */

function normalizeStatus(raw: string): GstResult["status"] {
  const s = raw.toLowerCase().trim();
  if (s === "active"    || s === "act") return "Active";
  if (s === "cancelled" || s === "cnl" || s === "cancel") return "Cancelled";
  if (s === "suspended" || s === "sus") return "Suspended";
  return "Active";
}

/** Convert DD/MM/YYYY → YYYY-MM-DD; pass through ISO dates unchanged. */
function normalizeDate(raw: string): string {
  if (!raw) return "";
  const m = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return raw;
}

/** Build a single-line address string from a GST portal address object. */
function buildAddress(
  addr: Record<string, string | undefined>,
  fallbackJurisdiction: string,
): string {
  const parts = [
    addr["bno"], addr["flno"], addr["bnm"], addr["st"],
    addr["loc"], addr["dst"], addr["stcd"],
  ].filter(Boolean) as string[];

  if (parts.length === 0) return fallbackJurisdiction || "";
  const pincode = addr["pncd"] ? ` - ${addr["pncd"]}` : "";
  return parts.join(", ") + pincode;
}

/* ── Provider 1: Masters India API ───────────────────────────────────── */
/*
 * Sign up at https://mastersindia.co/developer — free trial available.
 * Set MASTERS_INDIA_API_KEY (Bearer token) and optionally
 * MASTERS_INDIA_CLIENT_ID in environment secrets.
 */
async function verifyViaMastersIndia(
  gstin: string,
): Promise<GstResult | null> {
  const apiKey  = process.env["MASTERS_INDIA_API_KEY"];
  const clientId = process.env["MASTERS_INDIA_CLIENT_ID"];
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://commonapi.mastersindia.co/commonapis/searchgstin?gstin=${encodeURIComponent(gstin)}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          ...(clientId ? { "client_id": clientId } : {}),
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!res.ok) return null;
    const raw = await res.json() as Record<string, unknown>;

    /* Masters India wraps data under a `data` key */
    const d = (raw["data"] ?? raw) as Record<string, unknown>;
    if (!d || raw["error"]) return null;

    const stateCode = gstin.substring(0, 2);
    const addrObj   = (
      (d["pradr"] as Record<string, unknown>)?.["addr"] ??
      d["address"] ?? {}
    ) as Record<string, string | undefined>;

    return {
      gstin,
      status:                 normalizeStatus(String(d["sts"] ?? d["status"] ?? "")),
      businessName:           String(d["lgnm"] ?? d["legalName"] ?? d["tradeNam"] ?? d["tradeName"] ?? ""),
      taxpayerType:           String(d["dty"]  ?? d["taxPayerType"] ?? "Regular"),
      constitutionOfBusiness: String(d["ctb"]  ?? d["constitutuionOfBusiness"] ?? ""),
      registrationDate:       normalizeDate(String(d["rgdt"] ?? d["registrationDate"] ?? "")),
      address:                buildAddress(addrObj, String(d["stj"] ?? "")),
      stateCode,
      stateName:              STATE_MAP[stateCode] ?? String((addrObj)["stcd"] ?? ""),
      verifiedAt:             new Date().toISOString(),
      source:                 "masters-india",
    };
  } catch {
    return null;
  }
}

/* ── Provider 2: Official Government GST Portal (free, no key) ───────── */
/*
 * Powers the public search at services.gst.gov.in/services/searchtp.
 * No registration or API key required. Subject to GST portal availability.
 * Response spec: https://services.gst.gov.in (taxpayerDetails endpoint)
 */
async function verifyViaGovPortal(
  gstin: string,
): Promise<GstResult | null> {
  try {
    const res = await fetch(
      `https://services.gst.gov.in/services/api/search/taxpayerDetails?gstin=${encodeURIComponent(gstin)}`,
      {
        method: "GET",
        headers: {
          "Accept":          "application/json, text/plain, */*",
          "Accept-Language": "en-IN,en-US;q=0.9,en;q=0.8",
          "Referer":         "https://services.gst.gov.in/services/searchtp",
          "Origin":          "https://services.gst.gov.in",
          "User-Agent":      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
        signal: AbortSignal.timeout(12000),
      },
    );

    if (!res.ok) return null;
    const d = await res.json() as Record<string, unknown>;

    /* Portal returns errorCode when GSTIN is not found */
    if (d["errorCode"] || d["error"] || !d["gstin"]) return null;

    const stateCode = gstin.substring(0, 2);
    const addrObj   = (
      (d["pradr"] as Record<string, unknown>)?.["addr"] ?? {}
    ) as Record<string, string | undefined>;

    return {
      gstin,
      status:                 normalizeStatus(String(d["sts"] ?? "")),
      businessName:           String(d["lgnm"] ?? d["tradeNam"] ?? ""),
      taxpayerType:           String(d["dty"]  ?? "Regular"),
      constitutionOfBusiness: String(d["ctb"]  ?? ""),
      registrationDate:       normalizeDate(String(d["rgdt"] ?? "")),
      address:                buildAddress(addrObj, String(d["stj"] ?? "")),
      stateCode,
      stateName:              STATE_MAP[stateCode] ?? String(addrObj["stcd"] ?? ""),
      verifiedAt:             new Date().toISOString(),
      source:                 "gov-portal",
    };
  } catch {
    return null;
  }
}

/* ── Route: POST /api/gst/verify ─────────────────────────────────────── */

router.post("/gst/verify", async (req, res) => {
  const { gstin } = req.body as { gstin?: string };

  if (!gstin || typeof gstin !== "string") {
    res.status(400).json({ valid: false, error: "GSTIN is required" });
    return;
  }

  const normalized = gstin.trim().toUpperCase();

  /* ── Format validation ── */
  if (normalized.length !== 15) {
    res.json({
      valid: false,
      error: `GSTIN must be exactly 15 characters. You entered ${normalized.length}.`,
    });
    return;
  }

  if (!GSTIN_REGEX.test(normalized)) {
    res.json({
      valid: false,
      error: "Invalid GSTIN format. Expected: 2 digits · 5 letters · 4 digits · 1 letter · 1 alphanumeric · Z · 1 alphanumeric.",
    });
    return;
  }

  /* ── Cache hit ── */
  if (cache.has(normalized)) {
    req.log.info({ gstin: normalized }, "GST verification served from cache");
    res.json({ valid: true, ...cache.get(normalized)!, cached: true });
    return;
  }

  req.log.info({ gstin: normalized }, "Verifying GSTIN via live APIs");

  /* ── Try each provider in priority order ── */
  let result: GstResult | null = null;

  result = await verifyViaMastersIndia(normalized);
  if (result) {
    req.log.info({ gstin: normalized, source: result.source }, "GST verified via Masters India");
  }

  if (!result) {
    result = await verifyViaGovPortal(normalized);
    if (result) {
      req.log.info({ gstin: normalized, source: result.source }, "GST verified via government portal");
    }
  }

  if (!result) {
    req.log.warn({ gstin: normalized }, "All GST verification sources failed");
    res.json({
      valid: false,
      error:
        "Unable to verify this GSTIN right now. The GST verification service may be temporarily unavailable. " +
        "Please try again in a moment or verify manually at services.gst.gov.in.",
    });
    return;
  }

  cacheSet(normalized, result);
  req.log.info(
    { gstin: normalized, status: result.status, source: result.source },
    "GST verification complete",
  );

  res.json({ valid: true, ...result });
});

export default router;
