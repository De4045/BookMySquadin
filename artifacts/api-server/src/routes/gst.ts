import { Router, type IRouter } from "express";

const router: IRouter = Router();

/* ─────────────────────────────────────────────────────────────────────────
   GSTIN = {StateCode 2}{PAN 10}{EntityOrder 1}{Z 1}{Checksum 1}
   PAN  = {Seq 3}{EntityType 1}{NameFirst 1}{Digits 4}{CheckChar 1}
   ─ EntityType (GSTIN index 5) encodes legal constitution of the business.
   ─ State code (GSTIN index 0-1) maps to exact state name.
   These two fields are REAL, authoritative data extractable from any GSTIN.
───────────────────────────────────────────────────────────────────────── */

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

/** GSTIN index 5 = PAN 4th character = legal entity constitution. */
const PAN_ENTITY_MAP: Record<string, string> = {
  P: "Individual / Proprietorship",
  F: "Firm (Partnership / LLP)",
  C: "Company (Private / Public Limited)",
  H: "Hindu Undivided Family (HUF)",
  A: "Association of Persons (AOP)",
  B: "Body of Individuals (BOI)",
  G: "Government",
  J: "Artificial Juridical Person",
  L: "Local Authority",
  T: "Trust",
};

/* ── Result shape ─────────────────────────────────────────────────────── */

interface GstResult {
  gstin:                  string;
  /** "Active" | "Cancelled" | "Suspended" from live APIs;
   *  "Format Validated" from structural extraction (no live API) */
  status:                 "Active" | "Cancelled" | "Suspended" | "Format Validated";
  businessName:           string;
  taxpayerType:           string;
  constitutionOfBusiness: string;
  registrationDate:       string;
  address:                string;
  stateCode:              string;
  stateName:              string;
  verifiedAt:             string;
  source:                 "masters-india" | "gov-portal" | "format-validation";
}

/* ── In-memory cache (15-minute TTL) ─────────────────────────────────── */

const cache = new Map<string, GstResult>();
function cacheSet(gstin: string, result: GstResult) {
  cache.set(gstin, result);
  setTimeout(() => cache.delete(gstin), 15 * 60 * 1000);
}

/* ── Helpers ──────────────────────────────────────────────────────────── */

function normalizeStatus(raw: string): "Active" | "Cancelled" | "Suspended" {
  const s = raw.toLowerCase().trim();
  if (s === "active"    || s === "act") return "Active";
  if (s === "cancelled" || s === "cnl" || s === "cancel") return "Cancelled";
  if (s === "suspended" || s === "sus") return "Suspended";
  /* Unknown / empty status from API — treat as Suspended (safe default;
     never fake an Active result for an unrecognised response). */
  return "Suspended";
}

/** Convert DD/MM/YYYY → YYYY-MM-DD; pass through ISO dates unchanged. */
function normalizeDate(raw: string): string {
  if (!raw) return "";
  const m = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return raw;
}

/** Build a single-line address from a GST portal address object. */
function buildAddress(
  addr: Record<string, string | undefined>,
  fallback: string,
): string {
  const parts = [
    addr["bno"], addr["flno"], addr["bnm"], addr["st"],
    addr["loc"], addr["dst"], addr["stcd"],
  ].filter(Boolean) as string[];
  if (parts.length === 0) return fallback || "";
  const pin = addr["pncd"] ? ` - ${addr["pncd"]}` : "";
  return parts.join(", ") + pin;
}

/* ── Provider 1: Masters India ────────────────────────────────────────── */
/*
 * Get a free trial at https://mastersindia.co/developer
 * Set env secret: MASTERS_INDIA_API_KEY (Bearer token)
 * Optional:       MASTERS_INDIA_CLIENT_ID
 */
async function verifyViaMastersIndia(gstin: string): Promise<GstResult | null> {
  const apiKey   = process.env["MASTERS_INDIA_API_KEY"];
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
          "Accept":        "application/json",
        },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!res.ok) {
      return null;
    }

    const raw = await res.json() as Record<string, unknown>;
    const d   = (raw["data"] ?? raw) as Record<string, unknown>;
    if (!d || raw["error"]) return null;

    const stateCode = gstin.substring(0, 2);
    const addrObj   = (
      (d["pradr"] as Record<string, unknown>)?.["addr"] ?? d["address"] ?? {}
    ) as Record<string, string | undefined>;

    return {
      gstin,
      status:                 normalizeStatus(String(d["sts"] ?? d["status"] ?? "")),
      businessName:           String(d["lgnm"]  ?? d["legalName"] ?? d["tradeNam"] ?? d["tradeName"] ?? ""),
      taxpayerType:           String(d["dty"]   ?? d["taxPayerType"] ?? "Regular"),
      constitutionOfBusiness: String(d["ctb"]   ?? d["constitutuionOfBusiness"] ?? ""),
      registrationDate:       normalizeDate(String(d["rgdt"] ?? d["registrationDate"] ?? "")),
      address:                buildAddress(addrObj, String(d["stj"] ?? "")),
      stateCode,
      stateName:              STATE_MAP[stateCode] ?? String(addrObj["stcd"] ?? ""),
      verifiedAt:             new Date().toISOString(),
      source:                 "masters-india",
    };
  } catch (err) {
    return null;
  }
}

/* ── Provider 2: Government GST Portal ───────────────────────────────── */
/*
 * The official public taxpayer search at services.gst.gov.in.
 * Note: This endpoint requires a browser session (Angular SPA) and returns
 * an empty body for plain HTTP requests. Kept as a future integration point.
 * Currently the portal consistently returns Content-Length: 0 for server-
 * side requests — we detect that and fall through to structural extraction.
 */
async function verifyViaGovPortal(gstin: string): Promise<GstResult | null> {
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
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!res.ok) return null;

    /* The portal returns Content-Length: 0 for server-side requests —
       detect empty / non-JSON response and bail cleanly. */
    const contentLength = res.headers.get("content-length");
    const contentType   = res.headers.get("content-type") ?? "";
    if (contentLength === "0" || !contentType.includes("json")) return null;

    const d = await res.json() as Record<string, unknown>;
    if (d["errorCode"] || d["error"] || !d["gstin"]) return null;

    const stateCode = gstin.substring(0, 2);
    const addrObj   = (
      (d["pradr"] as Record<string, unknown>)?.["addr"] ?? {}
    ) as Record<string, string | undefined>;

    return {
      gstin,
      status:                 normalizeStatus(String(d["sts"] ?? "")),
      businessName:           String(d["lgnm"]  ?? d["tradeNam"] ?? ""),
      taxpayerType:           String(d["dty"]   ?? "Regular"),
      constitutionOfBusiness: String(d["ctb"]   ?? ""),
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

/* ── Fallback: Real structural extraction from GSTIN (no API needed) ──── */
/*
 * Every GSTIN encodes two authoritative, extractable fields:
 *   • State  — from the 2-digit state code prefix (GSTIN[0:2])
 *   • Entity — from PAN char 4 = GSTIN[5], encoding legal constitution
 * Returns status "Format Validated" — structure is mathematically valid,
 * but live Active/Suspended status CANNOT be confirmed without a live API key.
 * The frontend treats this as a BLOCKED (non-verified) state.
 */
function verifyViaStructureExtraction(gstin: string): GstResult {
  const stateCode    = gstin.substring(0, 2);
  const stateName    = STATE_MAP[stateCode] || "India";
  const panEntityChar = gstin.charAt(5).toUpperCase();
  const taxpayerType  = PAN_ENTITY_MAP[panEntityChar] || "Registered Taxpayer";

  return {
    gstin,
    status:                 "Format Validated",
    businessName:           "",
    taxpayerType,
    constitutionOfBusiness: taxpayerType,
    registrationDate:       "",
    address:                "",
    stateCode,
    stateName,
    verifiedAt:             new Date().toISOString(),
    source:                 "format-validation",
  };
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
      error: `GSTIN must be exactly 15 characters (you entered ${normalized.length}).`,
    });
    return;
  }
  if (!GSTIN_REGEX.test(normalized)) {
    res.json({
      valid: false,
      error: "Invalid GSTIN format. Expected pattern: 2 digits · 5 letters · 4 digits · 1 letter · 1 alphanumeric · Z · 1 alphanumeric.",
    });
    return;
  }

  /* ── Cache hit ── */
  if (cache.has(normalized)) {
    req.log.info({ gstin: normalized }, "GST verification served from cache");
    res.json({ valid: true, ...cache.get(normalized)!, cached: true });
    return;
  }

  req.log.info({ gstin: normalized }, "Starting GSTIN verification");

  /* ── Try live API providers in priority order ── */
  let result: GstResult | null = null;

  // 1. Masters India (paid, most reliable — needs MASTERS_INDIA_API_KEY secret)
  result = await verifyViaMastersIndia(normalized);
  if (result) {
    req.log.info({ gstin: normalized, source: result.source, status: result.status }, "GST verified via Masters India");
  }

  // 2. Government portal (free — currently requires browser session, kept as future path)
  if (!result) {
    result = await verifyViaGovPortal(normalized);
    if (result) {
      req.log.info({ gstin: normalized, source: result.source, status: result.status }, "GST verified via government portal");
    }
  }

  // 3. Structural extraction — always succeeds for a format-valid GSTIN
  if (!result) {
    result = verifyViaStructureExtraction(normalized);
    req.log.info(
      { gstin: normalized, source: result.source, stateCode: result.stateCode, taxpayerType: result.taxpayerType },
      "GST verified via structural extraction (no live API key configured)",
    );
  }

  cacheSet(normalized, result);
  req.log.info({ gstin: normalized, status: result.status, source: result.source }, "GSTIN verification complete");

  res.json({ valid: true, ...result });
});

/* ── Route: GET /api/gst/config (admin only) ─────────────────────────── */
/*
 * Returns the current GST verification mode without exposing the API key.
 * Used by the admin portal to surface the setup guide when no key is set.
 */
router.get("/gst/config", (req, res) => {
  const session = req.session as Record<string, unknown>;
  if (!session["userId"] || session["userRole"] !== "admin") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const hasApiKey = Boolean(process.env["MASTERS_INDIA_API_KEY"]);
  res.json({
    hasApiKey,
    mode: hasApiKey ? "live" : "format-only",
    provider: hasApiKey ? "masters-india" : null,
    envKey: "MASTERS_INDIA_API_KEY",
    optionalEnvKey: "MASTERS_INDIA_CLIENT_ID",
  });
});

export default router;
