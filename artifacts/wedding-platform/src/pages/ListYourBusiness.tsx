import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  MapPin, Phone, Mail, User, Building2, ChevronDown, CheckCircle2,
  ArrowRight, FileText, AlertCircle, ShieldCheck, BadgeCheck, Loader2,
  Calendar, Hash, Globe, XCircle, Star, BarChart2, Headphones, Lock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ─── Constants ─── */
const CATEGORIES = [
  "Wedding Planner", "Photographer", "Videographer", "Makeup Artist",
  "Mehendi Artist", "Decorator", "Caterer", "DJ / Music", "Venue / Banquet",
  "Bridal Wear", "Groom Wear", "Jewellery", "Pandit / Priest", "Anchor / MC",
  "Entertainer", "Choreographer", "Florist", "Transportation", "Other",
];
const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Jaipur", "Udaipur", "Goa", "Pune", "Ahmedabad", "Lucknow",
  "Chandigarh", "Rishikesh", "Mussoorie", "Dehradun", "Agra", "Varanasi",
  "Amritsar", "Kochi", "Coimbatore", "Bhubaneswar", "Nagpur", "Indore",
];
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

/* ─── Styles ─── */
const INPUT_CLS =
  "w-full bg-white/5 border border-white/15 focus:border-primary/50 outline-none px-4 py-3.5 font-manrope text-sm text-white/85 placeholder:text-white/30 transition-colors duration-300 rounded-sm focus:bg-white/[0.07]";
const SELECT_CLS = INPUT_CLS + " cursor-pointer appearance-none";

/* ─── GST Verification Types ─── */
type GstStatus = "idle" | "loading" | "verified" | "inactive" | "error";
interface GstData {
  gstin: string;
  status: "Active" | "Cancelled" | "Suspended";
  businessName: string;
  taxpayerType: string;
  registrationDate: string;
  address: string;
  stateName: string;
  verifiedAt: string;
}

/* ─── Reusable UI ─── */
function FIELD({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-cinzel text-xs tracking-[0.25em] text-primary uppercase font-semibold">{label}</label>
      {children}
      {hint && <p className="font-manrope text-xs text-white/40 leading-snug">{hint}</p>}
    </div>
  );
}

/* ─── GSTIN Live Segment Breakdown ─── */
const GSTIN_STATE_MAP: Record<string, string> = {
  "01": "Jammu & Kashmir",  "02": "Himachal Pradesh", "03": "Punjab",
  "04": "Chandigarh",       "05": "Uttarakhand",       "06": "Haryana",
  "07": "Delhi",            "08": "Rajasthan",         "09": "Uttar Pradesh",
  "10": "Bihar",            "11": "Sikkim",            "12": "Arunachal Pradesh",
  "13": "Nagaland",         "14": "Manipur",           "15": "Mizoram",
  "16": "Tripura",          "17": "Meghalaya",         "18": "Assam",
  "19": "West Bengal",      "20": "Jharkhand",         "21": "Odisha",
  "22": "Chhattisgarh",     "23": "Madhya Pradesh",    "24": "Gujarat",
  "25": "Daman & Diu",      "26": "Dadra & NH",        "27": "Maharashtra",
  "28": "Andhra Pradesh",   "29": "Karnataka",         "30": "Goa",
  "31": "Lakshadweep",      "32": "Kerala",            "33": "Tamil Nadu",
  "34": "Puducherry",       "35": "A&N Islands",       "36": "Telangana",
  "37": "AP (New)",
};

const GSTIN_ENTITY_MAP: Record<string, string> = {
  P: "Proprietor", F: "Firm/LLP", C: "Company",
  T: "Trust",      B: "Body/Individuals",
  L: "Local Auth", J: "Juridical", G: "Government",
};

type SegDef = {
  label: string;
  len: number;
  valid: (v: string) => boolean;
  sublabel?: (v: string) => string | undefined;
  errorHint: string;
};

const SEG_DEFS: SegDef[] = [
  {
    label: "State", len: 2,
    valid: v => /^[0-9]{2}$/.test(v) && v in GSTIN_STATE_MAP,
    sublabel: v => GSTIN_STATE_MAP[v],
    errorHint: "Must be a valid state code (01–37)",
  },
  {
    label: "PAN", len: 5,
    valid: v => /^[A-Z]{5}$/.test(v),
    sublabel: () => "PAN letters",
    errorHint: "Positions 3–7 must be uppercase letters",
  },
  {
    label: "PAN No.", len: 4,
    valid: v => /^[0-9]{4}$/.test(v),
    sublabel: () => "PAN digits",
    errorHint: "Positions 8–11 must be 4 digits",
  },
  {
    label: "Entity", len: 1,
    valid: v => /^[A-Z]$/.test(v),
    sublabel: v => GSTIN_ENTITY_MAP[v],
    errorHint: "Position 12 must be an uppercase letter",
  },
  {
    label: "Reg.", len: 1,
    valid: v => /^[1-9A-Z]$/.test(v),
    sublabel: () => "Reg. no.",
    errorHint: "Position 13 must be 1–9 or A–Z (not zero)",
  },
  {
    label: "Z", len: 1,
    valid: v => v === "Z",
    sublabel: () => "Fixed 'Z'",
    errorHint: "Position 14 must always be 'Z'",
  },
  {
    label: "Check", len: 1,
    valid: v => /^[0-9A-Z]$/.test(v),
    sublabel: () => "Checksum",
    errorHint: "Position 15 must be a digit or uppercase letter",
  },
];

function GstinSegmentBreakdown({ gstin, gstStatus }: { gstin: string; gstStatus: GstStatus }) {
  if (!gstin.length || gstStatus === "verified" || gstStatus === "inactive") return null;

  let offset = 0;
  const segments = SEG_DEFS.map(def => {
    const filled  = gstin.slice(offset, offset + def.len);
    const isFull  = filled.length === def.len;
    const isValid = isFull && def.valid(filled);
    const isInvalid = isFull && !isValid;
    offset += def.len;
    const display  = filled + "·".repeat(def.len - filled.length);
    const sublabel = isFull ? def.sublabel?.(filled) : undefined;
    return { def, display, filled, isValid, isInvalid, sublabel };
  });

  const totalValid = segments.filter(s => s.isValid).length;
  const firstInvalid = gstin.length === 15 ? segments.find(s => s.isInvalid) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-3"
    >
      {/* Segment pills */}
      <div className="flex flex-wrap gap-1.5">
        {segments.map(({ def, display, filled, isValid, isInvalid, sublabel }, i) => {
          const hasChars = filled.length > 0;
          const borderCls = isValid
            ? "border-primary/50"
            : isInvalid
            ? "border-red-500/45"
            : hasChars
            ? "border-white/18"
            : "border-white/8";
          const textCls = isValid
            ? "text-primary"
            : isInvalid
            ? "text-red-400"
            : hasChars
            ? "text-white/55"
            : "text-white/18";
          const bgCls = isValid
            ? "bg-primary/5"
            : isInvalid
            ? "bg-red-500/5"
            : "bg-white/[0.025]";

          return (
            <div
              key={i}
              className={`flex flex-col items-center px-2 py-1.5 border rounded-sm transition-colors duration-200 ${borderCls} ${bgCls}`}
              style={{ minWidth: def.len === 1 ? 34 : def.len === 2 ? 46 : def.len === 4 ? 68 : 84 }}
            >
              <span className={`font-mono text-[11px] tracking-widest font-semibold leading-none ${textCls}`}>
                {display}
              </span>
              <span className="font-cinzel text-[6.5px] tracking-[0.12em] text-white/22 uppercase mt-1 leading-none">
                {def.label}
              </span>
              {sublabel && (
                <span className={`font-manrope text-[7.5px] mt-0.5 leading-none truncate max-w-full px-0.5 text-center ${isValid ? "text-primary/55" : "text-red-400/55"}`}>
                  {sublabel}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 h-px rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.45), #d4af37)" }}
            initial={{ width: 0 }}
            animate={{ width: `${(totalValid / SEG_DEFS.length) * 100}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <span className="font-manrope text-[9.5px] text-white/22 tabular-nums shrink-0">
          {totalValid}/{SEG_DEFS.length} valid
        </span>
      </div>

      {/* Specific error for the first failing segment */}
      <AnimatePresence>
        {firstInvalid && (
          <motion.p
            key="seg-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-manrope text-[11px] text-red-400/80 flex items-center gap-1.5"
          >
            <AlertCircle className="w-3 h-3 shrink-0 text-red-400/70" />
            <span><strong className="text-red-400">{firstInvalid.def.label}:</strong> {firstInvalid.def.errorHint}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-stretch gap-4 mb-8">
      <div className="w-1 rounded-full shrink-0" style={{ background: "linear-gradient(180deg, #d4af37 0%, #b8943a 100%)" }} />
      <h3 className="font-cormorant text-3xl md:text-4xl font-semibold pb-3 border-b border-primary/20 flex-1 flex items-baseline gap-4 flex-wrap"
        style={{ color: "#fff", textShadow: "0 0 40px rgba(212,175,55,0.15)" }}>
        {children}
      </h3>
    </div>
  );
}

function ConsentBox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      className="flex gap-4 items-start cursor-pointer group select-none"
      onClick={() => onChange(!checked)}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); onChange(!checked); } }}
    >
      <div
        className={`mt-0.5 w-5 h-5 shrink-0 border flex items-center justify-center rounded-sm transition-all duration-200 ${
          checked ? "bg-primary border-primary" : "border-white/25 bg-white/5 group-hover:border-primary/50"
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <p className="font-manrope text-sm text-white/55 leading-relaxed">
        I have read and agree to the{" "}
        <a
          href="/terms-of-service"
          className="text-primary/80 hover:text-primary underline underline-offset-2 transition-colors"
          onClick={e => e.stopPropagation()}
        >Terms of Service</a>
        {" "}and{" "}
        <a
          href="/privacy-policy"
          className="text-primary/80 hover:text-primary underline underline-offset-2 transition-colors"
          onClick={e => e.stopPropagation()}
        >Privacy Policy</a>
        {" "}of Book My Squad. I confirm that all information provided is accurate and I consent to being contacted by the BMS team.{" "}
        <span className="text-primary/70 font-semibold">This consent is mandatory to proceed.</span>
      </p>
    </div>
  );
}

/* ─── GST Verification Panel ─── */
function GstVerificationPanel({
  gstin, onGstinChange, gstStatus, gstData, gstError, onVerify,
}: {
  gstin: string;
  onGstinChange: (v: string) => void;
  gstStatus: GstStatus;
  gstData: GstData | null;
  gstError: string;
  onVerify: () => void;
}) {
  const formatValid = gstin.length === 15 && GSTIN_REGEX.test(gstin);

  const borderCls =
    gstStatus === "verified" ? "border-green-500/60 focus:border-green-500/80" :
    gstStatus === "inactive" || gstStatus === "error" ? "border-red-500/50 focus:border-red-500/70" :
    formatValid ? "border-primary/50 focus:border-primary/70" :
    gstin.length > 0 && !formatValid ? "border-red-500/40 focus:border-red-500/60" :
    "border-white/15 focus:border-primary/50";

  return (
    <div className="space-y-5">
      {/* Header info box */}
      <div className="p-4 bg-[#1a1208] border border-primary/25 rounded-sm flex gap-3">
        <ShieldCheck className="w-5 h-5 text-primary/70 shrink-0 mt-0.5" />
        <div>
          <p className="font-manrope text-sm text-white/70 leading-relaxed">
            GST verification is required to ensure trusted and verified vendor listings on Book My Squad.{" "}
            <strong className="text-white/85">Only vendors with an Active GST status</strong> can complete registration.
          </p>
        </div>
      </div>

      {/* GSTIN Input */}
      <FIELD label="GSTIN — GST Identification Number *">
        <div className="relative">
          <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 pointer-events-none" />
          <input
            type="text"
            placeholder="e.g. 27AAPFU0939F1ZV"
            maxLength={15}
            value={gstin}
            onChange={e => onGstinChange(e.target.value.toUpperCase())}
            onBlur={() => { if (formatValid && gstStatus === "idle") onVerify(); }}
            disabled={gstStatus === "loading"}
            className={`${INPUT_CLS} pl-10 pr-4 tracking-widest font-mono uppercase ${borderCls} ${gstStatus === "loading" ? "opacity-60 cursor-wait" : ""}`}
          />
        </div>
        {/* Live segment breakdown — shows as user types */}
        <GstinSegmentBreakdown gstin={gstin} gstStatus={gstStatus} />
      </FIELD>

      {/* Verify button — shown when format is valid and not yet verified */}
      {formatValid && gstStatus !== "verified" && (
        <motion.button
          type="button"
          onClick={onVerify}
          disabled={gstStatus === "loading"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 px-6 py-3 border border-primary/40 hover:border-primary/70 bg-primary/8 hover:bg-primary/15 text-primary font-cinzel text-[10px] tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-wait rounded-sm"
        >
          {gstStatus === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying GST details…
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Verify GST Status
            </>
          )}
        </motion.button>
      )}

      {/* Loading animation */}
      <AnimatePresence>
        {gstStatus === "loading" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 border border-primary/20 bg-[#110e04] rounded-sm flex items-center gap-4">
              <div className="relative w-10 h-10 shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
              </div>
              <div>
                <p className="font-cinzel text-[11px] tracking-[0.25em] uppercase text-primary/80">Verifying GST Details</p>
                <p className="font-manrope text-xs text-white/35 mt-0.5">Checking registration status with GST records…</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS — Verified Active */}
      <AnimatePresence>
        {gstStatus === "verified" && gstData && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-sm border border-green-500/30"
            style={{ background: "linear-gradient(145deg, #081a0d 0%, #061208 100%)" }}
          >
            {/* Top line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-400/70 to-transparent" />
            <div className="p-6">
              {/* Verified badge header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-green-400/80">GST Verified</p>
                    <p className="font-cormorant text-lg text-green-300 font-semibold leading-tight">{gstData.status}</p>
                  </div>
                </div>
                <div className="font-mono text-[10px] text-green-400/50 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-sm tracking-widest">
                  {gstData.gstin}
                </div>
              </div>

              {/* Business details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="font-cinzel text-[8px] tracking-[0.25em] text-white/30 uppercase">Business Name</p>
                  <p className="font-manrope text-sm text-white/80 font-medium leading-snug">{gstData.businessName}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-cinzel text-[8px] tracking-[0.25em] text-white/30 uppercase">Taxpayer Type</p>
                  <p className="font-manrope text-sm text-white/80">{gstData.taxpayerType}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-cinzel text-[8px] tracking-[0.25em] text-white/30 uppercase flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" /> Registration Date
                  </p>
                  <p className="font-manrope text-sm text-white/80">
                    {new Date(gstData.registrationDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-cinzel text-[8px] tracking-[0.25em] text-white/30 uppercase flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" /> State
                  </p>
                  <p className="font-manrope text-sm text-white/80">{gstData.stateName}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="font-cinzel text-[8px] tracking-[0.25em] text-white/30 uppercase flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" /> Registered Address
                  </p>
                  <p className="font-manrope text-sm text-white/65 leading-relaxed">{gstData.address}</p>
                </div>
              </div>

              {/* Verified timestamp */}
              <div className="mt-4 pt-4 border-t border-green-500/15 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400/60 shrink-0" />
                <p className="font-manrope text-[10px] text-green-400/50">
                  Verified on {new Date(gstData.verifiedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
            </div>
            {/* Bottom line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ERROR — Inactive / Cancelled / Suspended */}
      <AnimatePresence>
        {gstStatus === "inactive" && gstData && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-sm border border-red-500/40"
            style={{ background: "linear-gradient(145deg, #1f0808 0%, #130404 55%, #0e0303 100%)" }}
          >
            {/* Top stripe */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            {/* "APPLICATION BLOCKED" stamp */}
            <div className="absolute top-5 right-5 rotate-[-8deg] opacity-20 pointer-events-none select-none">
              <div className="border-2 border-red-500 px-3 py-1 rounded-sm">
                <span className="font-cinzel text-[11px] tracking-[0.3em] uppercase text-red-500 font-bold">Blocked</span>
              </div>
            </div>

            <div className="p-6">
              {/* Header row */}
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <p className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-red-400/70">GST Status</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/15 border border-red-500/30 rounded-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      <span className="font-cinzel text-[9px] tracking-[0.15em] uppercase text-red-400 font-bold">{gstData.status}</span>
                    </span>
                  </div>
                  <p className="font-cormorant text-2xl text-red-300 font-semibold leading-tight">Application Cannot Proceed</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 pl-14">
                <div>
                  <p className="font-cinzel text-[8px] tracking-[0.2em] uppercase text-white/25 mb-1">Business Name</p>
                  <p className="font-manrope text-sm text-white/55">{gstData.businessName}</p>
                </div>
                <div>
                  <p className="font-cinzel text-[8px] tracking-[0.2em] uppercase text-white/25 mb-1">GSTIN</p>
                  <p className="font-mono text-sm text-red-400/50 tracking-widest">{gstData.gstin}</p>
                </div>
              </div>

              {/* Explanation */}
              <div className="pl-14 mb-5 p-4 bg-red-500/8 border border-red-500/20 rounded-sm">
                <p className="font-manrope text-sm text-white/60 leading-relaxed">
                  Only vendors with an <strong className="text-white/80">Active GST status</strong> can register and be listed on Book My Squad.
                  Your GSTIN is currently <strong className="text-red-400">{gstData.status}</strong> — this means your registration has been{" "}
                  {gstData.status === "Cancelled" ? "permanently cancelled" : "temporarily suspended"} by the GST authorities.
                </p>
                <p className="font-manrope text-xs text-white/35 mt-3 leading-relaxed">
                  Please {gstData.status === "Cancelled" ? "obtain a new GST registration" : "contact the GST helpdesk to reactivate your registration"}{" "}
                  before applying. You may visit{" "}
                  <a
                    href="https://services.gst.gov.in/services/searchtp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/60 hover:text-primary underline underline-offset-2 transition-colors"
                  >
                    services.gst.gov.in
                  </a>{" "}
                  to check your current status.
                </p>
              </div>

              {/* Try different GSTIN */}
              <div className="pl-14">
                <button
                  type="button"
                  onClick={() => {
                    onGstinChange("");
                  }}
                  className="flex items-center gap-2 font-cinzel text-[9px] tracking-[0.2em] uppercase text-red-400/70 hover:text-red-300 border border-red-500/25 hover:border-red-500/50 px-4 py-2 transition-all duration-300"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Try a Different GSTIN
                </button>
              </div>
            </div>
            {/* Bottom line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* API / Network Error */}
      <AnimatePresence>
        {gstStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 border border-yellow-500/25 bg-yellow-500/5 rounded-sm flex gap-3"
          >
            <AlertCircle className="w-4 h-4 text-yellow-400/70 shrink-0 mt-0.5" />
            <p className="font-manrope text-sm text-white/50 leading-relaxed">
              {gstError || "Verification service is temporarily unavailable. Please try again."}{" "}
              <button type="button" onClick={onVerify} className="text-primary/70 hover:text-primary underline underline-offset-2 transition-colors">
                Retry verification
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust badge */}
      <div className="flex items-center gap-2.5 pt-1">
        <div className="flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-primary/5 rounded-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-primary/60" />
          <span className="font-cinzel text-[8px] tracking-[0.2em] uppercase text-primary/60">Government GST Verification Enabled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Hash className="w-2.5 h-2.5 text-white/20" />
          <span className="font-manrope text-[10px] text-white/20">Secured &amp; Encrypted</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Vendor Form ─── */
function VendorForm({ onSuccess }: { onSuccess: (name: string, gstVerified: boolean) => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    businessName: "", ownerName: "", phone: "", email: "",
    businessAddress: "", billingAddress: "", category: "", city: "",
    website: "", experience: "", description: "",
  });
  const [billingSame, setBillingSame] = useState(false);
  const [consent, setConsent] = useState(false);

  // GST state
  const [gstin, setGstin] = useState("");
  const [gstStatus, setGstStatus] = useState<GstStatus>("idle");
  const [gstData, setGstData] = useState<GstData | null>(null);
  const [gstError, setGstError] = useState("");
  const verifyRef = useRef<AbortController | null>(null);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  // Match GST address string to one of our known cities
  const extractCityFromAddress = (address: string): string => {
    const lower = address.toLowerCase();
    // Alias map handles alternate spellings in addresses
    const ALIASES: Record<string, string> = {
      bengaluru: "Bangalore", bangalore: "Bangalore",
      bombay: "Mumbai", mumbai: "Mumbai",
      calcutta: "Kolkata", kolkata: "Kolkata",
      madras: "Chennai", chennai: "Chennai",
      delhi: "Delhi", "new delhi": "Delhi",
      hyderabad: "Hyderabad", jaipur: "Jaipur",
      udaipur: "Udaipur", goa: "Goa", pune: "Pune",
      ahmedabad: "Ahmedabad", lucknow: "Lucknow",
      chandigarh: "Chandigarh", rishikesh: "Rishikesh",
      mussoorie: "Mussoorie", dehradun: "Dehradun",
      agra: "Agra", varanasi: "Varanasi", amritsar: "Amritsar",
      kochi: "Kochi", coimbatore: "Coimbatore", bhubaneswar: "Bhubaneswar",
      nagpur: "Nagpur", indore: "Indore",
    };
    for (const [alias, city] of Object.entries(ALIASES)) {
      if (lower.includes(alias)) return city;
    }
    return "";
  };

  const handleGstinChange = (val: string) => {
    const upper = val.toUpperCase();
    setGstin(upper);
    // Reset ALL GST-prefilled fields when user changes the GSTIN
    if (gstStatus !== "idle") {
      setGstStatus("idle");
      setGstData(null);
      setGstError("");
      setForm(f => ({ ...f, businessName: "", businessAddress: "", city: "" }));
    }
  };

  const verifyGstin = useCallback(async () => {
    if (verifyRef.current) verifyRef.current.abort();
    const controller = new AbortController();
    verifyRef.current = controller;

    setGstStatus("loading");
    setGstData(null);
    setGstError("");

    try {
      const res = await fetch("/api/gst/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gstin }),
        signal: controller.signal,
        credentials: "include",
      });
      const data = await res.json() as {
        valid: boolean; error?: string;
        status?: string; businessName?: string;
        taxpayerType?: string; registrationDate?: string;
        address?: string; stateName?: string; stateCode?: string; verifiedAt?: string;
      };

      if (!data.valid) {
        setGstStatus("error");
        setGstError(data.error || "Verification failed. Please check your GSTIN.");
        return;
      }

      const gst: GstData = {
        gstin,
        status: data.status as GstData["status"],
        businessName: data.businessName || "",
        taxpayerType: data.taxpayerType || "Regular",
        registrationDate: data.registrationDate || "",
        address: data.address || "",
        stateName: data.stateName || "",
        verifiedAt: data.verifiedAt || new Date().toISOString(),
      };
      setGstData(gst);

      if (data.status === "Active") {
        setGstStatus("verified");
        // Auto-fill all available fields from GST records (always overwrite with authoritative data)
        const detectedCity = extractCityFromAddress(gst.address);
        setForm(f => ({
          ...f,
          businessName: gst.businessName || f.businessName,
          businessAddress: gst.address || f.businessAddress,
          city: detectedCity || f.city,
        }));
      } else {
        setGstStatus("inactive");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setGstStatus("error");
      setGstError("Unable to reach the verification service. Please check your connection and try again.");
    }
  }, [gstin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      toast({ title: "Consent Required", description: "Please agree to our Terms & Privacy Policy to continue.", variant: "destructive" });
      return;
    }
    if (!gstin) {
      toast({ title: "GSTIN Required", description: "A valid GSTIN is mandatory for vendor registration.", variant: "destructive" });
      return;
    }
    if (gstStatus !== "verified") {
      toast({ title: "GST Verification Required", description: "Please verify your GSTIN before submitting. Only vendors with Active GST status can register.", variant: "destructive" });
      return;
    }

    onSuccess(form.ownerName || form.businessName, true);
  };

  const isVerified = gstStatus === "verified";
  const canSubmit = isVerified && consent;

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="luxury-card p-8 md:p-12 space-y-10"
    >
      {/* Business Info */}
      <div>
        <SectionHeading>
          Business Information
          <span className="text-primary/50 text-sm font-manrope font-light">* required</span>
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FIELD label="Business Name *">
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 pointer-events-none" />
              <input type="text" placeholder="Registered business name" className={INPUT_CLS + " pl-10"} value={form.businessName} onChange={set("businessName")} required />
            </div>
          </FIELD>
          <FIELD label="Owner / Contact Name *">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 pointer-events-none" />
              <input type="text" placeholder="Full name of proprietor" className={INPUT_CLS + " pl-10"} value={form.ownerName} onChange={set("ownerName")} required />
            </div>
          </FIELD>
          <FIELD label="Service Category *">
            <div className="relative">
              <select className={SELECT_CLS} value={form.category} onChange={set("category")} required>
                <option value="" className="bg-[#0d0b08]">Select your category</option>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0d0b08]">{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </FIELD>
          <FIELD label="Primary City *">
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 pointer-events-none" />
              <select
                className={SELECT_CLS + " pl-10 " + (isVerified && form.city ? "border-green-500/30" : "")}
                value={form.city}
                onChange={set("city")}
                required
              >
                <option value="" className="bg-[#0d0b08]">Select city</option>
                {CITIES.map(c => <option key={c} value={c} className="bg-[#0d0b08]">{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
            {isVerified && form.city && (
              <p className="font-manrope text-xs text-green-400/60 flex items-center gap-1.5">
                <BadgeCheck className="w-3 h-3 shrink-0" /> Auto-detected from GST registered address
              </p>
            )}
          </FIELD>
        </div>
      </div>

      {/* Contact Details */}
      <div>
        <SectionHeading>Contact Details</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FIELD label="Phone Number *">
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 pointer-events-none" />
              <input type="tel" placeholder="+91 XXXXX XXXXX" className={INPUT_CLS + " pl-10"} value={form.phone} onChange={set("phone")} required />
            </div>
          </FIELD>
          <FIELD label="Email Address *">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 pointer-events-none" />
              <input type="email" placeholder="your@business.com" className={INPUT_CLS + " pl-10"} value={form.email} onChange={set("email")} required />
            </div>
          </FIELD>
          <FIELD label="Website URL">
            <input type="url" placeholder="https://yourbusiness.com" className={INPUT_CLS} value={form.website} onChange={set("website")} />
          </FIELD>
          <FIELD label="Years of Experience">
            <div className="relative">
              <select className={SELECT_CLS} value={form.experience} onChange={set("experience")}>
                <option value="" className="bg-[#0d0b08]">Select experience</option>
                {["Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"].map(e => (
                  <option key={e} value={e} className="bg-[#0d0b08]">{e}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </FIELD>
        </div>
      </div>

      {/* Addresses */}
      <div>
        <SectionHeading>Address Details</SectionHeading>
        <div className="space-y-6">
          <FIELD label="Business Address *">
            <textarea
              rows={3}
              placeholder={isVerified && gstData?.address ? "Auto-filled from GST records — edit if needed" : "Full registered business address (street, area, city, pincode)"}
              className={INPUT_CLS + " resize-none " + (isVerified && gstData?.address ? "border-green-500/30" : "")}
              value={form.businessAddress}
              onChange={set("businessAddress")}
              required
            />
            {isVerified && gstData?.address && (
              <p className="font-manrope text-[11px] text-green-400/60 flex items-center gap-1.5">
                <BadgeCheck className="w-3 h-3" /> Auto-filled from your GST registration records
              </p>
            )}
          </FIELD>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-cinzel text-[10px] tracking-[0.3em] text-primary/80 uppercase">Billing Address</label>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setBillingSame(s => !s)}
              >
                <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${billingSame ? "bg-primary border-primary" : "border-white/25 bg-white/5 hover:border-primary/40"}`}>
                  {billingSame && (
                    <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="font-manrope text-xs text-white/50">Same as business address</span>
              </div>
            </div>
            <textarea
              rows={3}
              placeholder={billingSame ? "Using business address above" : "Full billing address (if different)"}
              className={INPUT_CLS + " resize-none " + (billingSame ? "opacity-40 cursor-not-allowed" : "")}
              value={billingSame ? form.businessAddress : form.billingAddress}
              onChange={billingSame ? undefined : set("billingAddress")}
              readOnly={billingSame}
            />
          </div>
        </div>
      </div>

      {/* GST Registration — MANDATORY */}
      <div>
        <SectionHeading>
          GST Registration
          <span className="text-xs font-manrope font-semibold tracking-wide" style={{ color: "#d4af37" }}>
            Mandatory for Vendor Verification
          </span>
        </SectionHeading>
        <GstVerificationPanel
          gstin={gstin}
          onGstinChange={handleGstinChange}
          gstStatus={gstStatus}
          gstData={gstData}
          gstError={gstError}
          onVerify={verifyGstin}
        />
      </div>

      {/* About */}
      <div>
        <SectionHeading>About Your Business</SectionHeading>
        <FIELD label="Tell Us About Your Services">
          <textarea
            rows={5}
            placeholder="Describe your services, specialties, notable events you've covered, and what sets you apart…"
            className={INPUT_CLS + " resize-none"}
            value={form.description}
            onChange={set("description")}
          />
        </FIELD>
      </div>

      {/* Consent + Submit */}
      <div className="pt-4 border-t border-white/8 space-y-6">
        <ConsentBox checked={consent} onChange={setConsent} />

        {/* Verification gate message */}
        <AnimatePresence mode="wait">
          {gstStatus === "inactive" ? (
            <motion.div
              key="blocked"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 p-4 bg-red-500/8 border border-red-500/30 rounded-sm"
            >
              <XCircle className="w-4 h-4 text-red-400/70 shrink-0 mt-0.5" />
              <p className="font-manrope text-sm text-white/50 leading-relaxed">
                <strong className="text-red-400/80">Registration blocked.</strong>{" "}
                Your GSTIN has an inactive GST status. Only vendors with an{" "}
                <strong className="text-white/70">Active GST registration</strong> can complete this application.
                Please resolve your GST status before reapplying.
              </p>
            </motion.div>
          ) : !isVerified ? (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-sm"
            >
              <ShieldCheck className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" />
              <p className="font-manrope text-sm text-white/45 leading-relaxed">
                The <strong className="text-white/65">Submit Application</strong> button will unlock once your GSTIN is verified as Active.
                GST verification is mandatory for all vendor registrations on Book My Squad.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full md:w-auto px-12 py-4 font-cinzel font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-3 group ${
            canSubmit
              ? "bg-primary text-black hover:bg-primary/90 gold-glow"
              : "bg-white/8 text-white/25 border border-white/10 cursor-not-allowed"
          }`}
        >
          {isVerified ? (
            <>
              <BadgeCheck className="w-4 h-4" />
              Submit Verified Application
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Verify GST to Continue
            </>
          )}
          {canSubmit && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </button>
      </div>
    </motion.form>
  );
}

/* ─── Main Page ─── */
export default function ListYourBusiness() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [gstVerified, setGstVerified] = useState(false);

  const handleSuccess = (name: string, verified = false) => {
    setSubmittedName(name);
    setGstVerified(verified);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28">
        {/* Hero */}
        <section className="relative py-28 px-6 md:px-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.10)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.04)_0%,transparent_70%)]" />
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative z-10 max-w-4xl mx-auto">
            <p className="font-cinzel text-xs tracking-[0.6em] text-primary uppercase mb-5">✦ For Vendors & Businesses ✦</p>
            <div className="gold-line w-20 mx-auto mb-8" />
            <h1 className="font-cormorant text-6xl md:text-8xl font-semibold mb-6 leading-[1.05]">
              <span style={{ color: "#d4af37", textShadow: "0 0 60px rgba(212,175,55,0.55), 0 4px 40px rgba(212,175,55,0.25)" }}>
                List Your
              </span>{" "}
              <span className="italic" style={{ color: "#d4af37", textShadow: "0 0 80px rgba(212,175,55,0.65), 0 0 120px rgba(212,175,55,0.30)" }}>
                Business
              </span>
            </h1>
            <p className="font-manrope text-white/65 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Join India's most trusted wedding & event marketplace. GST-verified vendors get a priority listing and a Verified badge visible to thousands of couples.
            </p>
          </motion.div>
        </section>

        {/* Stats strip */}
        <section className="bg-primary/8 border-y border-primary/20 py-10 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{ n: "50,000+", l: "Monthly Couples" }, { n: "255+", l: "Verified Vendors" }, { n: "76+", l: "Cities" }, { n: "Free", l: "Basic Listing" }].map(s => (
              <div key={s.l} className="text-center">
                <div className="font-cormorant text-4xl md:text-5xl text-primary font-semibold"
                  style={{ textShadow: "0 0 30px rgba(212,175,55,0.3)" }}>{s.n}</div>
                <div className="font-cinzel text-[10px] text-white/50 uppercase tracking-widest mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Form section */}
        <section className="py-20 px-6 md:px-12" style={{ background: "linear-gradient(180deg, #080604 0%, #0a0805 50%, #080604 100%)" }}>
          <div className="max-w-4xl mx-auto">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="luxury-card p-16 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-500/10 border-2 border-green-500/30">
                  <BadgeCheck className="w-10 h-10 text-green-400" />
                </div>
                <p className="font-cinzel text-[9px] tracking-[0.4em] uppercase text-primary/60 mb-3">✦ Application Received ✦</p>
                <h2 className="font-cormorant text-4xl md:text-5xl text-white font-semibold mb-4"
                  style={{ textShadow: "0 0 40px rgba(212,175,55,0.15)" }}>
                  {gstVerified ? "GST-Verified Application Received!" : "Application Received!"}
                </h2>
                <p className="font-manrope text-white/55 text-base mb-2 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-primary font-medium">{submittedName}</span>. Our team will review your vendor listing and reach out within 48 hours.
                </p>
                <p className="font-manrope text-sm text-green-400/70 mt-3 mb-10 flex items-center justify-center gap-2">
                  <BadgeCheck className="w-4 h-4 shrink-0" />
                  Your GST-verified application will receive priority review and a Verified badge upon approval.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setGstVerified(false); setSubmittedName(""); }}
                  className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-primary border border-primary/30 px-8 py-3.5 hover:bg-primary hover:text-black transition-all duration-300"
                >
                  Submit Another Application
                </button>
              </motion.div>
            ) : (
              <>
                {/* Premium GST disclaimer card */}
                <div className="mb-8 relative overflow-hidden rounded-sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.05) 50%, rgba(212,175,55,0.10) 100%)",
                    boxShadow: "0 0 32px rgba(212,175,55,0.18), 0 0 80px rgba(212,175,55,0.08), inset 0 0 40px rgba(212,175,55,0.06)",
                  }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                    style={{ filter: "blur(1px)" }} />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/90 to-transparent" />
                  <div className="border border-primary/50 rounded-sm p-5"
                    style={{ boxShadow: "inset 0 0 20px rgba(212,175,55,0.06)" }}>
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-sm bg-primary/15 border border-primary/50 flex items-center justify-center shrink-0 mt-0.5"
                        style={{ boxShadow: "0 0 12px rgba(212,175,55,0.30)" }}>
                        <ShieldCheck className="w-4 h-4 text-primary" style={{ filter: "drop-shadow(0 0 4px rgba(212,175,55,0.8))" }} />
                      </div>
                      <div>
                        <p className="font-cinzel text-[9px] tracking-[0.4em] text-primary uppercase mb-2 font-semibold"
                          style={{ textShadow: "0 0 12px rgba(212,175,55,0.60)" }}>Verification Disclaimer</p>
                        <p className="font-manrope text-[12px] text-white/80 leading-relaxed">
                          <span className="text-primary font-semibold" style={{ textShadow: "0 0 8px rgba(212,175,55,0.50)" }}>Disclaimer:</span> Book My Squad verifies vendor business details and GST information to maintain platform authenticity and trusted listings. Submission of invalid or misleading information may result in rejection or permanent suspension.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                </div>

                <AnimatePresence mode="wait">
                  <VendorForm onSuccess={handleSuccess} />
                </AnimatePresence>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
