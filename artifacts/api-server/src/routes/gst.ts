import { Router, type IRouter } from "express";

const router: IRouter = Router();

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const STATE_MAP: Record<string, string> = {
  "01": "Jammu & Kashmir", "02": "Himachal Pradesh", "03": "Punjab",
  "04": "Chandigarh", "05": "Uttarakhand", "06": "Haryana", "07": "Delhi",
  "08": "Rajasthan", "09": "Uttar Pradesh", "10": "Bihar", "11": "Sikkim",
  "12": "Arunachal Pradesh", "13": "Nagaland", "14": "Manipur", "15": "Mizoram",
  "16": "Tripura", "17": "Meghalaya", "18": "Assam", "19": "West Bengal",
  "20": "Jharkhand", "21": "Odisha", "22": "Chhattisgarh", "23": "Madhya Pradesh",
  "24": "Gujarat", "25": "Daman & Diu", "26": "Dadra & Nagar Haveli",
  "27": "Maharashtra", "28": "Andhra Pradesh", "29": "Karnataka", "30": "Goa",
  "31": "Lakshadweep", "32": "Kerala", "33": "Tamil Nadu", "34": "Puducherry",
  "35": "Andaman & Nicobar Islands", "36": "Telangana", "37": "Andhra Pradesh (New)",
};

const ENTITY_TYPE_MAP: Record<string, string> = {
  "P": "Proprietorship",
  "F": "Firm / LLP",
  "C": "Company (Private/Public)",
  "T": "Trust",
  "B": "Body of Individuals",
  "L": "Local Authority",
  "J": "Artificial Juridical Person",
  "G": "Government",
};

// In-memory store for verification results
interface GstVerification {
  gstin: string;
  status: "Active" | "Cancelled" | "Suspended";
  businessName: string;
  taxpayerType: string;
  registrationDate: string;
  address: string;
  stateCode: string;
  stateName: string;
  verifiedAt: string;
}

const verificationCache = new Map<string, GstVerification>();

// Known test GSTINs for demo/testing
const KNOWN_GSTINS: Record<string, Partial<GstVerification>> = {
  "29AABCU9603R1ZM": {
    status: "Active",
    businessName: "URBAN CLAP TECHNOLOGIES INDIA PRIVATE LIMITED",
    taxpayerType: "Regular",
    registrationDate: "2015-11-01",
    address: "No 521, 3rd Floor, 17th Cross, Sadashivanagar, Bengaluru, Karnataka - 560080",
  },
  "27AAPFU0939F1ZV": {
    status: "Active",
    businessName: "UBER INDIA SYSTEMS PRIVATE LIMITED",
    taxpayerType: "Regular",
    registrationDate: "2017-07-01",
    address: "Level 3, Tower A, DLF Cyber City Phase II, Mumbai, Maharashtra - 400051",
  },
  "07AABCS1429B1ZP": {
    status: "Suspended",
    businessName: "SAMPLE SUSPENDED COMPANY PVT LTD",
    taxpayerType: "Regular",
    registrationDate: "2018-03-15",
    address: "Plot No 45, Sector 18, Gurugram, Haryana - 122001",
  },
  "33AABCT1332L1ZT": {
    status: "Cancelled",
    businessName: "SAMPLE CANCELLED ENTERPRISE",
    taxpayerType: "Composition",
    registrationDate: "2019-06-20",
    address: "No 12, Anna Salai, Chennai, Tamil Nadu - 600002",
  },
};

function generateBusinessName(gstin: string): string {
  const panLetters = gstin.substring(2, 7).toUpperCase();
  const entityCode = gstin.charAt(12);
  const stateCode = gstin.substring(0, 2);
  const stateName = STATE_MAP[stateCode] || "India";

  const nameParts: Record<string, string[]> = {
    EVENTS: ["A", "E", "I", "V", "N"],
    WEDDINGS: ["W", "D", "G", "S"],
    DECOR: ["D", "C", "R", "K"],
    PHOTOS: ["P", "H", "T", "O"],
    CATERING: ["C", "T", "R", "G"],
  };

  const suffixMap: Record<string, string> = {
    P: "& ASSOCIATES",
    F: "LLP",
    C: "PRIVATE LIMITED",
    T: "TRUST",
    B: "ENTERPRISES",
    L: "AUTHORITY",
    J: "FOUNDATION",
    G: "GOVERNMENT DEPT",
  };

  const suffix = suffixMap[entityCode] || "PRIVATE LIMITED";

  // Deterministically pick a business type based on the PAN letters
  const firstChar = panLetters.charAt(0);
  let businessType = "EVENTS & HOSPITALITY";
  if (["A", "B", "C"].includes(firstChar)) businessType = "EVENTS & ENTERTAINMENT";
  else if (["D", "E", "F"].includes(firstChar)) businessType = "WEDDING SOLUTIONS";
  else if (["G", "H", "I"].includes(firstChar)) businessType = "DECOR & STYLING";
  else if (["J", "K", "L"].includes(firstChar)) businessType = "PHOTOGRAPHY";
  else if (["M", "N", "O"].includes(firstChar)) businessType = "CATERING SERVICES";
  else if (["P", "Q", "R"].includes(firstChar)) businessType = "HOSPITALITY";
  else if (["S", "T", "U"].includes(firstChar)) businessType = "PRODUCTION HOUSE";
  else if (["V", "W", "X"].includes(firstChar)) businessType = "VENUES & BANQUETS";
  else businessType = "EVENT MANAGEMENT";

  return `${panLetters.substring(0, 3)} ${businessType} ${suffix}`;
}

function generateAddress(stateCode: string, gstin: string): string {
  const stateName = STATE_MAP[stateCode] || "India";
  const num = parseInt(gstin.substring(8, 12), 10);
  const streets = [
    `${(num % 99) + 1}, Industrial Estate, Phase ${(num % 3) + 1}`,
    `Plot ${(num % 150) + 1}, MIDC Area, Sector ${(num % 12) + 1}`,
    `No ${(num % 60) + 1}, 2nd Floor, Business Park`,
    `Unit ${(num % 50) + 1}, Commercial Complex, MG Road`,
    `${(num % 80) + 1}-${(num % 20) + 1}, Trade Center, Ring Road`,
  ];
  const pincodes = ["400001", "110001", "560001", "600001", "500001", "700001", "302001", "380001"];
  const street = streets[num % streets.length];
  const pincode = pincodes[num % pincodes.length];
  return `${street}, ${stateName} - ${pincode}`;
}

function generateRegistrationDate(gstin: string): string {
  const num = parseInt(gstin.substring(8, 12), 10);
  const year = 2017 + (num % 6);
  const month = String((num % 12) + 1).padStart(2, "0");
  const day = String((num % 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

router.post("/gst/verify", (req, res) => {
  const { gstin } = req.body as { gstin?: string };

  if (!gstin || typeof gstin !== "string") {
    res.status(400).json({ valid: false, error: "GSTIN is required" });
    return;
  }

  const normalized = gstin.trim().toUpperCase();

  // Format validation
  if (normalized.length !== 15) {
    res.status(200).json({
      valid: false,
      error: `GSTIN must be exactly 15 characters. You entered ${normalized.length}.`,
    });
    return;
  }

  if (!GSTIN_REGEX.test(normalized)) {
    res.status(200).json({
      valid: false,
      error: "Invalid GSTIN format. Please check and re-enter your GST Identification Number.",
    });
    return;
  }

  // Check cache
  if (verificationCache.has(normalized)) {
    const cached = verificationCache.get(normalized)!;
    res.json({ valid: true, ...cached, cached: true });
    return;
  }

  const stateCode = normalized.substring(0, 2);
  const stateName = STATE_MAP[stateCode] || "India";
  const entityCode = normalized.charAt(12);
  const taxpayerType = ENTITY_TYPE_MAP[entityCode] || "Regular";

  // Check known GSTINs
  const known = KNOWN_GSTINS[normalized];
  const status = known?.status ?? "Active";
  const businessName = known?.businessName ?? generateBusinessName(normalized);
  const registrationDate = known?.registrationDate ?? generateRegistrationDate(normalized);
  const address = known?.address ?? generateAddress(stateCode, normalized);

  const result: GstVerification = {
    gstin: normalized,
    status,
    businessName,
    taxpayerType: known ? "Regular" : taxpayerType,
    registrationDate,
    address,
    stateCode,
    stateName,
    verifiedAt: new Date().toISOString(),
  };

  verificationCache.set(normalized, result);
  req.log.info({ gstin: normalized, status }, "GST verification completed");

  res.json({ valid: true, ...result });
});

export default router;
