import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronRight, ChevronLeft, CheckCircle2, Calendar,
  Users, IndianRupee, Phone, Mail, MessageSquare,
  Clock, Sparkles, Star, Crown,
} from "lucide-react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

interface Package {
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  highlights: string[];
  tier: "essential" | "premium" | "luxury";
}

const PACKAGES: Record<string, Package[]> = {
  PHOTOGRAPHER: [
    { name: "Candid Coverage", priceLabel: "From ₹50,000", price: 50000, description: "Natural moments beautifully captured", highlights: ["8 hrs coverage", "500+ edited photos", "Online gallery"], tier: "essential" },
    { name: "Premium Story", priceLabel: "From ₹1,00,000", price: 100000, description: "Cinematic storytelling for your big day", highlights: ["12 hrs coverage", "1000+ edited photos", "Cinematic highlight reel", "2 photographers"], tier: "premium" },
    { name: "Luxury Archive", priceLabel: "From ₹2,00,000", price: 200000, description: "Full event documentation & fine art prints", highlights: ["3-day coverage", "Unlimited photos", "4K film + reels", "Fine art album", "3 photographers"], tier: "luxury" },
  ],
  "MAKEUP ARTIST": [
    { name: "Party Glam", priceLabel: "From ₹15,000", price: 15000, description: "Flawless look for functions & events", highlights: ["1 look", "Premium products", "Touch-up kit"], tier: "essential" },
    { name: "Bridal Complete", priceLabel: "From ₹35,000", price: 35000, description: "Complete bridal transformation", highlights: ["Mehendi + wedding look", "Trial session", "HD products", "Saree draping"], tier: "premium" },
    { name: "Signature HD Bridal", priceLabel: "From ₹60,000", price: 60000, description: "Airbrush artistry with exclusive products", highlights: ["3-day coverage", "Airbrush makeup", "International products", "Pre-bridal session", "Hairstyling"], tier: "luxury" },
  ],
  CATERER: [
    { name: "Classic Veg Menu", priceLabel: "₹800 / plate", price: 800, description: "Wholesome vegetarian spread", highlights: ["3 live counters", "Veg starters + mains", "Dessert station", "Service staff"], tier: "essential" },
    { name: "Mixed Celebration", priceLabel: "₹1,200 / plate", price: 1200, description: "Diverse veg & non-veg selection", highlights: ["5 live counters", "Full veg + non-veg menu", "Welcome drinks", "Branded crockery", "Chef table"], tier: "premium" },
    { name: "Premium Gourmet", priceLabel: "₹2,000 / plate", price: 2000, description: "Signature fine-dining experience", highlights: ["Unlimited counters", "Multi-cuisine + fusion", "Bar setup", "Personal chef", "Styled platters"], tier: "luxury" },
  ],
  DECOR: [
    { name: "Floral Elegance", priceLabel: "From ₹50,000", price: 50000, description: "Classic florals & draping", highlights: ["Stage backdrop", "Entrance arch", "Table centrepieces", "Fairy lights"], tier: "essential" },
    { name: "Grand Floral", priceLabel: "From ₹1,00,000", price: 100000, description: "Immersive floral experience", highlights: ["Ceiling installation", "Custom stage design", "Photo booth", "Aisle décor", "Led lighting"], tier: "premium" },
    { name: "Couture Experience", priceLabel: "From ₹3,00,000", price: 300000, description: "Bespoke theme design, wall to wall", highlights: ["Full venue transformation", "Bespoke theme", "GOBO projections", "Floral wall", "Branded elements"], tier: "luxury" },
  ],
  "WEDDING PLANNERS": [
    { name: "Coordination", priceLabel: "From ₹50,000", price: 50000, description: "Day-of coordination & vendor liaison", highlights: ["Single day coordinator", "Vendor check-in", "Timeline management", "Emergency kit"], tier: "essential" },
    { name: "Full Planning", priceLabel: "From ₹2,00,000", price: 200000, description: "End-to-end wedding management", highlights: ["3-month planning", "Vendor selection", "Budget tracking", "RSVP management", "2 coordinators"], tier: "premium" },
    { name: "Destination Wedding", priceLabel: "From ₹5,00,000", price: 500000, description: "Luxury destination event production", highlights: ["Destination logistics", "Guest management", "Exclusive vendor network", "Travel coordination", "On-site team"], tier: "luxury" },
  ],
  "MUSIC & DJ": [
    { name: "DJ Night", priceLabel: "From ₹25,000", price: 25000, description: "High-energy DJ set for your sangeet or reception", highlights: ["4 hrs set", "Sound system", "1 DJ", "LED setup"], tier: "essential" },
    { name: "Full Band", priceLabel: "From ₹75,000", price: 75000, description: "Live band + DJ combo", highlights: ["6 hrs", "Live band (5 members)", "DJ + MC", "Premium sound"], tier: "premium" },
    { name: "Symphony Orchestra", priceLabel: "From ₹2,00,000", price: 200000, description: "Live orchestra for a royal affair", highlights: ["Full orchestra", "DJ + Live band", "Customised setlist", "Sound engineers", "Lighting rig"], tier: "luxury" },
  ],
};

const DEFAULT_PACKAGES: Package[] = [
  { name: "Essential", priceLabel: "From ₹25,000", price: 25000, description: "Solid quality service for your event", highlights: ["Standard coverage", "Professional team", "On-time delivery"], tier: "essential" },
  { name: "Premium", priceLabel: "From ₹75,000", price: 75000, description: "Enhanced experience with extra touches", highlights: ["Extended coverage", "Senior professionals", "Priority response", "2 revisions"], tier: "premium" },
  { name: "Luxury", priceLabel: "Custom pricing", price: 150000, description: "White-glove, fully bespoke service", highlights: ["Unlimited scope", "Dedicated team lead", "VIP access", "Personalized planning"], tier: "luxury" },
];

const TIER_STYLE = {
  essential: { label: "Essential",  border: "border-white/20",    bg: "bg-white/[0.04]",  accent: "#ffffff80",  icon: Star },
  premium:   { label: "Premium",    border: "border-primary/50",  bg: "bg-primary/[0.07]", accent: "#d4af37",   icon: Sparkles },
  luxury:    { label: "Luxury",     border: "border-purple-400/50", bg: "bg-purple-500/[0.07]", accent: "#c084fc", icon: Crown },
};

const EVENT_TYPES = ["Wedding", "Sangeet", "Mehndi", "Haldi", "Reception", "Engagement", "Birthday", "Corporate Event", "Other"];

const CONSULT_TIMES = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

const INPUT = "w-full bg-white/[0.05] border border-white/12 focus:border-primary/55 outline-none px-4 py-3 font-manrope text-sm text-white placeholder:text-white/30 transition-colors rounded-sm";
const SELECT = INPUT + " appearance-none cursor-pointer";

const ADVANCE = 2000;

/* ── Razorpay types ── */
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
interface RazorpayOptions {
  key: string; amount: number; currency: string; order_id: string;
  name: string; description: string; prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (r: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
}
declare global {
  interface Window { Razorpay: new (opts: RazorpayOptions) => { open(): void } }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (typeof window !== "undefined" && window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function fmt(n: number) {
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0] ?? "";
}

function getMinConsultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0] ?? "";
}

export interface BookingVendor {
  name: string;
  category: string;
  city?: string;
  company?: string;
}

interface Props {
  vendor: BookingVendor | null;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4;

export function BookingModal({ vendor, onClose }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [wantConsult, setWantConsult] = useState(false);
  const [consultDate, setConsultDate] = useState("");
  const [consultTime, setConsultTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!vendor) return null;

  const handlePayWithRazorpay = async () => {
    setError("");
    setPaying(true);
    try {
      const orderRes = await fetch(`${BASE}/api/payments/razorpay/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!orderRes.ok) throw new Error("Could not create payment order. Please try again.");
      const order = await orderRes.json() as {
        orderId: string; amount: number; currency: string; keyId: string; demo?: boolean;
      };

      /* Demo mode (no Razorpay keys configured) — skip checkout UI */
      if (order.demo) {
        await handleBook(true);
        return;
      }

      /* Load Razorpay checkout script */
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Payment gateway failed to load. Please check your connection.");

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          name: "Book My Squad",
          description: `Advance booking — ${vendor.name}`,
          prefill: { name, email, contact: phone },
          theme: { color: "#d4af37" },
          handler: async (response) => {
            try {
              const verifyRes = await fetch(`${BASE}/api/payments/razorpay/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              });
              if (!verifyRes.ok) { reject(new Error("Payment could not be verified. Contact support.")); return; }
              await handleBook(true);
              resolve();
            } catch (e) {
              reject(e);
            }
          },
          modal: { ondismiss: () => reject(new Error("__dismissed__")) },
        });
        rzp.open();
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg !== "__dismissed__") setError(msg || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const cat = (vendor.category || "").trim().toUpperCase();
  const packages = PACKAGES[cat] ?? DEFAULT_PACKAGES;

  const canStep2 = !!selectedPkg;
  const canStep3 = !!eventDate && !!eventType;
  const canStep4 = !!name && !!email && !!phone;

  const handleBook = async (withAdvance: boolean) => {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          vendorName: vendor.name,
          vendorCategory: cat,
          city: vendor.city ?? "",
          packageName: selectedPkg?.name ?? "",
          packagePrice: selectedPkg?.price ?? 0,
          eventDate,
          eventType,
          guestCount: Number(guestCount) || 0,
          consultationDate: wantConsult && consultDate ? consultDate : undefined,
          consultationTime: wantConsult && consultTime ? consultTime : undefined,
          name,
          email,
          phone,
          message,
          advancePaid: withAdvance,
          advanceAmount: withAdvance ? ADVANCE : 0,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const STEPS = ["Package", "Event", "Contact", "Confirm"];

  return (
    <AnimatePresence>
      <motion.div
        key="bm-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
      />
      <motion.div
        key="bm-panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 270 }}
        className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#0a0705] z-[61] flex flex-col shadow-2xl overflow-hidden"
        style={{ borderLeft: "1px solid rgba(212,175,55,0.18)" }}
      >
        {/* Header */}
        <div className="shrink-0 px-6 pt-5 pb-4 border-b border-white/8 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-cinzel text-[9px] tracking-[0.3em] text-primary/60 uppercase mb-0.5">Book Now</p>
            <h2 className="font-cormorant text-xl text-white font-semibold leading-tight truncate">{vendor.name}</h2>
            <p className="font-cinzel text-[8px] tracking-[0.18em] text-white/35 uppercase mt-0.5">{cat}{vendor.city ? ` · ${vendor.city}` : ""}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-sm bg-white/5 border border-white/12 flex items-center justify-center text-white/50 hover:text-white transition-colors shrink-0 mt-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step indicator */}
        {!done && (
          <div className="shrink-0 px-6 py-3 border-b border-white/6 flex items-center gap-0">
            {STEPS.map((label, i) => {
              const s = (i + 1) as Step;
              const active = step === s;
              const done_ = step > s;
              return (
                <div key={label} className="flex items-center">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-cinzel font-bold transition-all ${
                      done_ ? "bg-primary text-black" : active ? "bg-primary/20 border border-primary text-primary" : "bg-white/5 border border-white/15 text-white/25"
                    }`}>
                      {done_ ? "✓" : s}
                    </div>
                    <span className={`font-cinzel text-[8px] tracking-[0.15em] uppercase transition-colors ${active ? "text-primary" : done_ ? "text-primary/50" : "text-white/20"}`}>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`mx-2 h-px w-5 transition-colors ${done_ ? "bg-primary/40" : "bg-white/8"}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait">

            {/* ── SUCCESS ── */}
            {done && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/35 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-9 h-9 text-primary" />
                </div>
                <p className="font-cinzel text-[9px] tracking-[0.35em] text-primary/60 uppercase mb-2">Booking Confirmed</p>
                <h3 className="font-cormorant text-3xl text-white font-semibold mb-3">You're All Set!</h3>
                <p className="font-manrope text-sm text-white/50 leading-relaxed max-w-sm mb-2">
                  Your booking with <span className="text-white/75">{vendor.name}</span> has been submitted.
                </p>
                <p className="font-manrope text-xs text-white/35 leading-relaxed max-w-xs mb-8">
                  {selectedPkg?.name} · {eventType} · {eventDate ? new Date(eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
                </p>
                {wantConsult && consultDate && consultTime && (
                  <div className="w-full max-w-xs bg-primary/8 border border-primary/25 rounded-sm p-4 mb-8 text-left">
                    <p className="font-cinzel text-[8px] tracking-[0.2em] text-primary/70 uppercase mb-1.5">Consultation Scheduled</p>
                    <p className="font-manrope text-sm text-white/70">{new Date(consultDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                    <p className="font-manrope text-sm text-primary/80 font-medium">{consultTime}</p>
                  </div>
                )}
                <button onClick={onClose} className="px-8 py-3 bg-primary text-black font-cinzel text-[9px] tracking-[0.25em] uppercase font-bold hover:bg-primary/90 transition-all">
                  Back to Profile
                </button>
              </motion.div>
            )}

            {/* ── STEP 1: Package ── */}
            {!done && step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.22 }}>
                <p className="font-cinzel text-[9px] tracking-[0.3em] text-white/35 uppercase mb-4">Choose Your Package</p>
                <div className="space-y-3">
                  {packages.map((pkg) => {
                    const ts = TIER_STYLE[pkg.tier];
                    const TierIcon = ts.icon;
                    const isSelected = selectedPkg?.name === pkg.name;
                    return (
                      <button
                        key={pkg.name}
                        onClick={() => setSelectedPkg(pkg)}
                        className={`w-full text-left p-4 border rounded-sm transition-all group relative overflow-hidden ${
                          isSelected ? `${ts.border} ${ts.bg}` : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                        style={isSelected ? { boxShadow: `0 0 20px ${ts.accent}18` } : {}}
                      >
                        {isSelected && (
                          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${ts.accent}, transparent)` }} />
                        )}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-sm flex items-center justify-center" style={{ background: `${ts.accent}15`, border: `1px solid ${ts.accent}35` }}>
                              <TierIcon className="w-3 h-3" style={{ color: ts.accent }} />
                            </div>
                            <div>
                              <span className="font-cinzel text-[8px] tracking-[0.15em] uppercase" style={{ color: ts.accent }}>{ts.label}</span>
                              <h4 className="font-cormorant text-lg text-white font-semibold leading-tight">{pkg.name}</h4>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-cormorant text-sm font-bold" style={{ color: ts.accent }}>{pkg.priceLabel}</p>
                          </div>
                        </div>
                        <p className="font-manrope text-xs text-white/45 mb-2.5">{pkg.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {pkg.highlights.map((h) => (
                            <span key={h} className="font-manrope text-[10px] text-white/40 bg-white/5 border border-white/8 px-2 py-0.5 rounded-sm">{h}</span>
                          ))}
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: ts.accent }}>
                              <CheckCircle2 className="w-3 h-3 text-black" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Event Details ── */}
            {!done && step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.22 }} className="space-y-4">
                <p className="font-cinzel text-[9px] tracking-[0.3em] text-white/35 uppercase">Event Details</p>

                {selectedPkg && (
                  <div className="p-3 bg-primary/8 border border-primary/25 rounded-sm flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-primary/60 shrink-0" />
                    <div>
                      <p className="font-cinzel text-[8px] tracking-[0.15em] text-primary/60 uppercase">Selected Package</p>
                      <p className="font-manrope text-sm text-white/80">{selectedPkg.name} <span className="text-primary/70">· {selectedPkg.priceLabel}</span></p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-cinzel text-[8px] tracking-[0.2em] text-white/30 uppercase mb-1.5">Event Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
                    <input
                      type="date"
                      value={eventDate}
                      min={getTodayStr()}
                      onChange={e => setEventDate(e.target.value)}
                      className={INPUT + " pl-10 [color-scheme:dark]"}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-cinzel text-[8px] tracking-[0.2em] text-white/30 uppercase mb-1.5">Event Type *</label>
                  <select value={eventType} onChange={e => setEventType(e.target.value)} className={SELECT}>
                    <option value="" disabled className="bg-[#0a0705]">Select event type…</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t} className="bg-[#0a0705]">{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-cinzel text-[8px] tracking-[0.2em] text-white/30 uppercase mb-1.5">Approximate Guest Count</label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
                    <input
                      type="number"
                      placeholder="e.g. 250"
                      value={guestCount}
                      min="1"
                      onChange={e => setGuestCount(e.target.value)}
                      className={INPUT + " pl-10"}
                    />
                  </div>
                </div>

                {/* Consultation toggle */}
                <div className="border border-white/8 rounded-sm overflow-hidden">
                  <button
                    onClick={() => setWantConsult(w => !w)}
                    className={`w-full flex items-center justify-between p-4 transition-colors ${wantConsult ? "bg-primary/8" : "bg-white/[0.025] hover:bg-white/[0.04]"}`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className={`w-4 h-4 ${wantConsult ? "text-primary" : "text-white/40"}`} />
                      <div className="text-left">
                        <p className={`font-cinzel text-[9px] tracking-[0.15em] uppercase ${wantConsult ? "text-primary" : "text-white/60"}`}>Schedule a Consultation</p>
                        <p className="font-manrope text-xs text-white/30 mt-0.5">Free 30-min call to discuss your requirements</p>
                      </div>
                    </div>
                    <div className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${wantConsult ? "bg-primary" : "bg-white/15"}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${wantConsult ? "translate-x-4" : "translate-x-0.5"}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {wantConsult && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 border-t border-white/8 space-y-3">
                          <div>
                            <label className="block font-cinzel text-[8px] tracking-[0.2em] text-white/30 uppercase mb-1.5">Preferred Date</label>
                            <input
                              type="date"
                              value={consultDate}
                              min={getMinConsultDate()}
                              onChange={e => setConsultDate(e.target.value)}
                              className={INPUT + " [color-scheme:dark]"}
                            />
                          </div>
                          <div>
                            <label className="block font-cinzel text-[8px] tracking-[0.2em] text-white/30 uppercase mb-1.5">Preferred Time</label>
                            <div className="grid grid-cols-4 gap-1.5">
                              {CONSULT_TIMES.map(t => (
                                <button
                                  key={t}
                                  onClick={() => setConsultTime(t)}
                                  className={`py-2 font-manrope text-xs border rounded-sm transition-all ${
                                    consultTime === t ? "border-primary bg-primary/15 text-primary" : "border-white/10 text-white/40 hover:border-primary/40 hover:text-white/70"
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Contact ── */}
            {!done && step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.22 }} className="space-y-4">
                <p className="font-cinzel text-[9px] tracking-[0.3em] text-white/35 uppercase">Your Contact Details</p>

                <div>
                  <label className="block font-cinzel text-[8px] tracking-[0.2em] text-white/30 uppercase mb-1.5">Full Name *</label>
                  <input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} className={INPUT} />
                </div>

                <div>
                  <label className="block font-cinzel text-[8px] tracking-[0.2em] text-white/30 uppercase mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
                    <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className={INPUT + " pl-10"} />
                  </div>
                </div>

                <div>
                  <label className="block font-cinzel text-[8px] tracking-[0.2em] text-white/30 uppercase mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
                    <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} className={INPUT + " pl-10"} />
                  </div>
                </div>

                <div>
                  <label className="block font-cinzel text-[8px] tracking-[0.2em] text-white/30 uppercase mb-1.5">Additional Notes</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-primary/40 pointer-events-none" />
                    <textarea
                      rows={4}
                      placeholder="Any special requirements, theme, preferences…"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className={INPUT + " pl-10 resize-none"}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 4: Confirm & Pay ── */}
            {!done && step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.22 }} className="space-y-4">
                <p className="font-cinzel text-[9px] tracking-[0.3em] text-white/35 uppercase">Booking Summary</p>

                {/* Summary card */}
                <div className="bg-[#1a1509] border border-primary/20 rounded-sm overflow-hidden">
                  <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  <div className="p-5 space-y-3">
                    {[
                      { label: "Vendor",   value: vendor.name },
                      { label: "Package",  value: `${selectedPkg?.name} · ${selectedPkg?.priceLabel}` },
                      { label: "Event",    value: `${eventType}${eventDate ? " · " + new Date(eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}` },
                      ...(guestCount ? [{ label: "Guests", value: `~${guestCount} guests` }] : []),
                      ...(wantConsult && consultDate && consultTime ? [{ label: "Consultation", value: `${new Date(consultDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${consultTime}` }] : []),
                      { label: "Contact",  value: `${name} · ${phone}` },
                    ].map(item => (
                      <div key={item.label} className="flex items-start justify-between gap-3">
                        <span className="font-cinzel text-[8px] tracking-[0.18em] text-white/30 uppercase shrink-0">{item.label}</span>
                        <span className="font-manrope text-xs text-white/70 text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-red-400/90 font-manrope text-sm bg-red-400/8 border border-red-400/20 px-4 py-2.5 rounded-sm">{error}</p>
                )}

                {/* Pay advance */}
                <div className="bg-[#150f04] border border-primary/25 rounded-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-sm bg-primary/15 border border-primary/35 flex items-center justify-center">
                        <IndianRupee className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-cinzel text-[9px] tracking-[0.2em] text-primary/70 uppercase">Secure Your Date</p>
                        <p className="font-cormorant text-xl text-white font-semibold">Advance Booking Amount</p>
                      </div>
                    </div>
                    <p className="font-manrope text-sm text-white/45 mb-4 leading-relaxed">
                      Pay a refundable advance of <strong className="text-primary">{fmt(ADVANCE)}</strong> to confirm your booking and lock in this vendor for your event date. Balance payable directly to the vendor.
                    </p>
                    <button
                      onClick={() => void handlePayWithRazorpay()}
                      disabled={submitting || paying}
                      className="w-full py-4 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed rounded-sm"
                      style={{ boxShadow: "0 4px 20px rgba(212,175,55,0.35)" }}
                    >
                      {paying ? "Opening Payment…" : submitting ? "Processing…" : `Pay ${fmt(ADVANCE)} Advance & Confirm`}
                    </button>
                    <p className="text-center font-cinzel text-[8px] tracking-[0.12em] text-white/20 uppercase mt-3">Powered by Razorpay · 100% Refundable if cancelled 7 days prior</p>
                  </div>
                </div>

                {/* Skip advance */}
                <div className="text-center">
                  <button
                    onClick={() => void handleBook(false)}
                    disabled={submitting}
                    className="font-cinzel text-[9px] tracking-[0.2em] text-white/30 uppercase hover:text-white/60 transition-colors disabled:opacity-50"
                  >
                    Continue without advance payment →
                  </button>
                  <p className="font-manrope text-xs text-white/20 mt-1">Your booking will be marked as pending until confirmed by the vendor</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer nav */}
        {!done && (
          <div className="shrink-0 px-6 py-4 border-t border-white/8 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                onClick={() => setStep(s => (s - 1) as Step)}
                className="flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.18em] uppercase text-white/40 hover:text-white/70 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 && (
              <button
                onClick={() => {
                  if (step === 1 && !canStep2) return;
                  if (step === 2 && !canStep3) return;
                  if (step === 3 && !canStep4) return;
                  setStep(s => (s + 1) as Step);
                }}
                disabled={(step === 1 && !canStep2) || (step === 2 && !canStep3) || (step === 3 && !canStep4)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-black font-cinzel text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
              >
                Continue <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
