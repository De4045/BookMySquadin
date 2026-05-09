import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone, Heart, CheckCircle2, ChevronRight, Building2 } from "lucide-react";
import { useShortlist } from "@/context/ShortlistContext";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

const CAT_IMAGES: Record<string, string> = {
  "PHOTOGRAPHER":     "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=85",
  "MAKEUP ARTIST":    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=85",
  "CATERER":          "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=85",
  "DECOR":            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=85",
  "WEDDING PLANNERS": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&q=85",
  "MUSIC & DJ":       "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=85",
};

const CAT_COLORS: Record<string, string> = {
  "DECOR":            "#8ab4e8",
  "WEDDING PLANNERS": "#c9a96e",
  "MAKEUP ARTIST":    "#e8a4c8",
  "PHOTOGRAPHER":     "#50e3c2",
  "CATERER":          "#f5a623",
  "MUSIC & DJ":       "#bd10e0",
};

const INPUT = "w-full bg-white/[0.05] border border-white/10 focus:border-primary/50 outline-none px-4 py-3 font-manrope text-sm text-white placeholder:text-white/30 transition-colors rounded-sm";

export interface VendorLike {
  name: string;
  company?: string;
  category: string;
  city?: string;
  state?: string;
  contact?: string;
}

interface Props {
  vendor: VendorLike | null;
  onClose: () => void;
}

function normalizeCategory(raw: string): string {
  const s = (raw || "").trim().toUpperCase();
  if (s === "DEOCR" || s === "DECOR") return "DECOR";
  if (s.includes("PLANNER")) return "WEDDING PLANNERS";
  if (s.includes("MAKE")) return "MAKEUP ARTIST";
  if (s.includes("PHOTO")) return "PHOTOGRAPHER";
  if (s.includes("CATER")) return "CATERER";
  if (s.includes("MUSIC") || s.includes("DJ")) return "MUSIC & DJ";
  return s || "VENDOR";
}

export function VendorDetailModal({ vendor, onClose }: Props) {
  const { has, toggle } = useShortlist();
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!vendor) return null;

  const cat = normalizeCategory(vendor.category);
  const coverImg = CAT_IMAGES[cat] || CAT_IMAGES["PHOTOGRAPHER"];
  const accentColor = CAT_COLORS[cat] || "#c9a96e";
  const initials = vendor.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const shortlistId = `vendor-${vendor.name}-${vendor.city || ""}`;
  const isShortlisted = has(shortlistId);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone) {
      setError("Name, email and phone are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/api/enquiry/vendor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          eventDate: form.date,
          message: form.message,
          vendorName: vendor.name,
          vendorCategory: cat,
          city: vendor.city,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
      />
      <motion.div
        key="panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#0d0a07] z-50 overflow-y-auto flex flex-col shadow-2xl"
      >
        {/* Cover */}
        <div className="relative h-52 shrink-0 overflow-hidden">
          <img src={coverImg} alt={cat} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a07] via-black/60 to-transparent" />

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => toggle({ id: shortlistId, type: "vendor", name: vendor.name, city: vendor.city, category: cat })}
              className={`w-9 h-9 rounded-sm flex items-center justify-center backdrop-blur-sm border transition-all duration-300 ${
                isShortlisted ? "bg-primary/20 border-primary text-primary" : "bg-black/50 border-white/20 text-white/70 hover:border-primary/60 hover:text-primary"
              }`}
            >
              <Heart className={`w-4 h-4 ${isShortlisted ? "fill-primary" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-sm bg-black/50 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile header */}
        <div className="px-6 -mt-10 relative z-10 pb-4 border-b border-white/8">
          <div className="flex items-end gap-4">
            <div
              className="w-16 h-16 rounded-sm flex items-center justify-center text-xl font-cinzel font-bold shrink-0 border-2"
              style={{ backgroundColor: accentColor + "20", borderColor: accentColor + "50", color: accentColor }}
            >
              {initials}
            </div>
            <div className="pb-1">
              <span
                className="font-cinzel text-[9px] tracking-[0.2em] uppercase font-bold mb-1 block"
                style={{ color: accentColor }}
              >
                {cat}
              </span>
              <h2 className="font-cormorant text-2xl text-white font-semibold leading-tight">{vendor.name}</h2>
              {vendor.company && (
                <p className="font-manrope text-sm text-white/50">{vendor.company}</p>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-6 space-y-6">

          {/* Location & contact */}
          <div className="space-y-3">
            {(vendor.city || vendor.state) && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary/50 shrink-0" />
                <span className="font-manrope text-sm text-white/65">
                  {[vendor.city, vendor.state].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
            {vendor.company && (
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-primary/50 shrink-0" />
                <span className="font-manrope text-sm text-white/65">{vendor.company}</span>
              </div>
            )}
            {vendor.contact && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary/50 shrink-0" />
                <a href={`tel:${vendor.contact}`} className="font-mono text-sm text-white/65 hover:text-primary transition-colors">
                  {vendor.contact}
                </a>
              </div>
            )}
          </div>

          {/* Why book */}
          <div className="border-t border-white/8 pt-5 space-y-2.5">
            <p className="font-cinzel text-[9px] tracking-[0.3em] text-primary/50 uppercase mb-3">Why book through BMS</p>
            {[
              "Verified profile — vetted by our quality team",
              "Transparent pricing with no hidden charges",
              "100% response guarantee within 24 hours",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <span className="font-manrope text-sm text-white/55">{point}</span>
              </div>
            ))}
          </div>

          {/* Enquiry form */}
          <div className="border-t border-white/8 pt-5">
            <p className="font-cinzel text-[9px] tracking-[0.3em] text-primary/50 uppercase mb-5">Book / Enquire</p>

            {submitted ? (
              <div className="text-center py-10">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
                  <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
                  <h3 className="font-cormorant text-2xl text-white font-medium mb-2">Enquiry Sent!</h3>
                  <p className="font-manrope text-white/50 text-sm leading-relaxed">
                    {vendor.name} will contact you shortly.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name:"",email:"",phone:"",date:"",message:"" }); }}
                    className="mt-6 font-cinzel text-[10px] tracking-[0.2em] text-primary/60 uppercase hover:text-primary transition-colors"
                  >
                    Send Another →
                  </button>
                </motion.div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <p className="text-red-400/90 font-manrope text-sm bg-red-400/8 border border-red-400/20 px-4 py-2.5 rounded-sm">{error}</p>
                )}
                <input type="text" placeholder="Your Full Name *" value={form.name} onChange={set("name")} className={INPUT} />
                <input type="email" placeholder="Email Address *" value={form.email} onChange={set("email")} className={INPUT} />
                <input type="tel" placeholder="Phone Number *" value={form.phone} onChange={set("phone")} className={INPUT} />
                <input type="date" value={form.date} onChange={set("date")}
                  className={INPUT + " [color-scheme:dark]"} />
                <textarea
                  placeholder="Tell the vendor about your event…"
                  value={form.message} onChange={set("message")} rows={3}
                  className={INPUT + " resize-none"}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed gold-glow rounded-sm mt-1"
                >
                  {submitting ? "Sending…" : "Send Enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
