import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Phone, Mail, MapPin, ChevronDown, Check, Loader2 } from "lucide-react";

type Mode = "consultation" | "quote" | "availability";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: Mode;
  vendorName?: string;
}

const EVENT_TYPES = [
  "Wedding", "Destination Wedding", "Engagement Ceremony", "Mehendi & Sangeet",
  "Corporate Conference", "Award Ceremony", "Birthday Party", "Anniversary",
  "Baby Shower", "Product Launch", "Concert / Live Event",
];

const BUDGET_RANGES = [
  "Under ₹5 Lakhs", "₹5L – ₹15L", "₹15L – ₹30L",
  "₹30L – ₹75L", "₹75L – ₹1.5Cr", "Above ₹1.5 Crore",
];

const CITIES = [
  "Mumbai", "Delhi", "Jaipur", "Bangalore", "Hyderabad",
  "Chennai", "Kolkata", "Goa", "Pune", "Udaipur", "Other / International",
];

const MODES: { id: Mode; label: string; icon: string; desc: string }[] = [
  { id: "consultation", label: "Book Consultation", icon: "📅", desc: "30-min expert call — free" },
  { id: "quote",        label: "Get Instant Quote",  icon: "💰", desc: "Detailed quote in 24hrs"  },
  { id: "availability", label: "Check Availability", icon: "📆", desc: "Date & vendor check"      },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-cinzel text-[9px] tracking-[0.3em] text-primary/70 uppercase">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-white/5 border border-white/10 text-white placeholder-white/30 font-manrope text-sm px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors duration-200";
const selectCls = `${inputCls} cursor-pointer appearance-none`;

export function ConsultationModal({ isOpen, onClose, defaultMode = "consultation", vendorName }: ConsultationModalProps) {
  const [mode, setMode]         = useState<Mode>(defaultMode);
  const [name, setName]         = useState("");
  const [phone, setPhone]       = useState("");
  const [email, setEmail]       = useState("");
  const [city, setCity]         = useState("");
  const [eventType, setEvent]   = useState("");
  const [date, setDate]         = useState("");
  const [budget, setBudget]     = useState("");
  const [guests, setGuests]     = useState("");
  const [message, setMessage]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setDone(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setDone(false); setName(""); setPhone(""); setEmail(""); setCity(""); setEvent(""); setDate(""); setBudget(""); setGuests(""); setMessage(""); }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9800] flex items-center justify-center px-4"
          onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0d0a07] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
          >
            {/* Top gold line */}
            <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }} />

            {/* Header */}
            <div className="px-8 py-6 border-b border-white/8 flex items-start justify-between">
              <div>
                <p className="font-cinzel text-[9px] tracking-[0.4em] text-primary/70 uppercase mb-2">
                  {vendorName ? `Enquire — ${vendorName}` : "✦ Book My Squad ✦"}
                </p>
                <h2 className="font-cormorant text-3xl text-white font-semibold leading-tight">
                  {MODES.find(m => m.id === mode)?.label}
                </h2>
              </div>
              <button onClick={handleClose} className="text-white/40 hover:text-white transition-colors mt-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {done ? (
              <div className="px-8 py-16 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-16 h-16 bg-primary/15 border border-primary/40 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-7 h-7 text-primary" />
                </motion.div>
                <h3 className="font-cormorant text-3xl text-white font-semibold mb-3">We'll be in touch!</h3>
                <p className="font-manrope text-white/60 text-sm leading-relaxed mb-8">
                  Our team will contact you within <strong className="text-primary">2–4 hours</strong> on WhatsApp & email. In the meantime, explore our vendor portfolio.
                </p>
                <button onClick={handleClose} className="px-8 py-3 bg-primary text-black font-cinzel text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-primary/90 transition-colors">
                  Continue Exploring
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
                {/* Mode toggle */}
                <div className="grid grid-cols-3 gap-2">
                  {MODES.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      className={`p-3 border text-left transition-all duration-200 rounded-sm ${
                        mode === m.id
                          ? "border-primary/60 bg-primary/8"
                          : "border-white/8 bg-white/3 hover:border-white/20"
                      }`}
                    >
                      <span className="text-lg block mb-1">{m.icon}</span>
                      <span className="font-cinzel text-[8px] tracking-[0.1em] uppercase text-white/80 block leading-snug">{m.label}</span>
                      <span className="font-manrope text-[10px] text-white/40 block mt-0.5">{m.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Your Name *">
                    <input required value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Priya Sharma" />
                  </Field>
                  <Field label="Phone Number *">
                    <input required value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="+91 98765 43210" type="tel" />
                  </Field>
                </div>

                <Field label="Email Address">
                  <input value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="priya@example.com" type="email" />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Event Type">
                    <div className="relative">
                      <select value={eventType} onChange={e => setEvent(e.target.value)} className={`${selectCls} pr-8`}>
                        <option value="" className="bg-[#0d0a07]">Select type</option>
                        {EVENT_TYPES.map(t => <option key={t} value={t} className="bg-[#0d0a07]">{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
                    </div>
                  </Field>
                  <Field label="Event City">
                    <div className="relative">
                      <select value={city} onChange={e => setCity(e.target.value)} className={`${selectCls} pr-8`}>
                        <option value="" className="bg-[#0d0a07]">Select city</option>
                        {CITIES.map(c => <option key={c} value={c} className="bg-[#0d0a07]">{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
                    </div>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Event Date">
                    <input value={date} onChange={e => setDate(e.target.value)} className={inputCls} type="date" style={{ colorScheme: "dark" }} />
                  </Field>
                  <Field label="Expected Guests">
                    <input value={guests} onChange={e => setGuests(e.target.value)} className={inputCls} placeholder="e.g. 200–300" />
                  </Field>
                </div>

                <Field label="Approx. Budget">
                  <div className="relative">
                    <select value={budget} onChange={e => setBudget(e.target.value)} className={`${selectCls} pr-8`}>
                      <option value="" className="bg-[#0d0a07]">Select range</option>
                      {BUDGET_RANGES.map(b => <option key={b} value={b} className="bg-[#0d0a07]">{b}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
                  </div>
                </Field>

                <Field label="Tell us more (optional)">
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className={`${inputCls} resize-none`}
                    rows={3}
                    placeholder="Share your vision, specific vendors you need, or any questions..."
                  />
                </Field>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.25em] uppercase hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-3 gold-glow disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    MODES.find(m => m.id === mode)?.label
                  )}
                </button>

                <p className="font-manrope text-[10px] text-white/30 text-center">
                  We respond within 2–4 hours on business days. No spam, ever.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
