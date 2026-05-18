import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GOLD = "#d4af37";
const SCENE_MS = 6500;
const TOTAL = 8;

const fadeScene = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
  exit:    { opacity: 0, y: -18, transition: { duration: 0.45, ease: "easeIn" } },
};

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { delay: i * 0.12 + 0.2, duration: 0.5 } },
});

function GoldLine() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
      className="h-px w-48 origin-left"
    />
  );
}

function SceneLabel({ text }: { text: string }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.45 }}
      transition={{ delay: 0.6 }}
      className="absolute top-8 right-10 font-[Cinzel] text-[10px] tracking-[0.25em] uppercase"
      style={{ color: GOLD }}
    >
      {text}
    </motion.p>
  );
}

/* ── Scene 0: Venue Directory Grid ─────────────── */
function SceneDirectory() {
  const venues = [
    { name: "The Leela Palace", city: "Delhi", type: "HOTEL", img: "1566073771259-6a8506099945" },
    { name: "Taj Falaknuma",    city: "Hyderabad", type: "RESORT",  img: "1582719508461-905c673771fd" },
    { name: "Golden Farmhouse", city: "Jaipur", type: "FARMHOUSE", img: "1600585154526-990dced4db0d" },
    { name: "Grand Ballroom",   city: "Mumbai", type: "BANQUET", img: "1519167758481-83f550bb49b3" },
    { name: "ITC Royal Bengal", city: "Kolkata", type: "HOTEL", img: "1542314831-068cd1dbfeeb" },
    { name: "Radisson Blu",     city: "Pune",   type: "RESORT",  img: "1571003123894-1f0594d2b5d9" },
  ];
  const typeColors: Record<string, string> = { HOTEL: "#4a90e2", RESORT: "#50e3c2", FARMHOUSE: "#f5a623", BANQUET: "#bd10e0" };
  return (
    <motion.div {...fadeScene} className="flex flex-col items-center gap-6 px-6 w-full max-w-3xl mx-auto">
      <SceneLabel text="Venue Directory" />
      <motion.div {...stagger(0)} className="text-center">
        <p className="font-[Cinzel] text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>436+ Venues</p>
        <h2 className="font-[Cormorant_Garamond] text-3xl font-light text-white">Find Your Dream Venue</h2>
      </motion.div>
      <GoldLine />
      <div className="grid grid-cols-3 gap-3 w-full">
        {venues.map((v, i) => (
          <motion.div key={v.name} {...stagger(i + 1)} className="rounded-sm overflow-hidden border border-white/8 relative group">
            <div className="h-24 overflow-hidden">
              <img
                src={`https://images.unsplash.com/photo-${v.img}?w=400&q=75`}
                alt={v.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080604]/90 to-transparent" />
            </div>
            <div className="absolute bottom-2 left-2">
              <p className="font-[Cinzel] text-[7px] tracking-[0.15em] uppercase" style={{ color: typeColors[v.type] ?? GOLD }}>{v.type}</p>
              <p className="font-[Cormorant_Garamond] text-xs text-white font-semibold">{v.name}</p>
              <p className="font-[Manrope] text-[9px] text-white/40">{v.city}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Scene 1: Venue Detail ──────────────────────── */
function SceneVenueDetail() {
  return (
    <motion.div {...fadeScene} className="flex flex-col items-center gap-5 px-8 w-full max-w-xl mx-auto">
      <SceneLabel text="Venue Detail" />
      <div className="w-full h-44 rounded-sm overflow-hidden relative">
        <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=85" alt="Grand Ballroom" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080604] via-[#080604]/40 to-transparent" />
        <div className="absolute bottom-4 left-5">
          <motion.p {...stagger(0)} className="font-[Cinzel] text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: GOLD }}>BANQUET HALL</motion.p>
          <motion.h3 {...stagger(1)} className="font-[Cormorant_Garamond] text-2xl font-bold text-white">Grand Ballroom, Mumbai</motion.h3>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 w-full">
        {[
          { icon: "👥", label: "Capacity", value: "500 guests" },
          { icon: "🛏️", label: "Rooms",    value: "120 rooms" },
          { icon: "🍽️", label: "Catering", value: "In-house" },
        ].map((d, i) => (
          <motion.div key={d.label} {...stagger(i + 2)} className="border border-white/8 rounded-sm p-3 text-center">
            <p className="text-xl mb-1">{d.icon}</p>
            <p className="font-[Cinzel] text-[8px] tracking-[0.15em] uppercase text-white/40">{d.label}</p>
            <p className="font-[Manrope] text-sm text-white/80 mt-0.5">{d.value}</p>
          </motion.div>
        ))}
      </div>
      <motion.div {...stagger(5)} className="w-full py-3 rounded-sm font-[Cinzel] text-[11px] tracking-[0.2em] uppercase text-center" style={{ background: GOLD, color: "#080604" }}>
        Book This Venue
      </motion.div>
    </motion.div>
  );
}

/* ── Scene 2: Package Selection ─────────────────── */
function ScenePackage() {
  const pkgs = [
    { name: "Silver", price: "₹55,000", features: ["8hr coverage","1 photographer","Online gallery"] },
    { name: "Gold",   price: "₹85,000", features: ["12hr coverage","2 photographers","Cinematic film"], selected: true },
    { name: "Platinum", price: "₹1,25,000", features: ["Full-day","3 photographers","Luxury album"] },
  ];
  return (
    <motion.div {...fadeScene} className="flex flex-col items-center gap-5 px-8 w-full max-w-2xl mx-auto">
      <SceneLabel text="Step 1 — Select Package" />
      <motion.div {...stagger(0)} className="text-center">
        <p className="font-[Cinzel] text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>Step 1 of 4</p>
        <h2 className="font-[Cormorant_Garamond] text-3xl font-light text-white">Choose Your Package</h2>
      </motion.div>
      <GoldLine />
      <div className="grid grid-cols-3 gap-4 w-full">
        {pkgs.map((p, i) => (
          <motion.div
            key={p.name}
            {...stagger(i + 1)}
            className="rounded-sm p-5 border flex flex-col gap-2"
            style={{
              borderColor: p.selected ? GOLD : "rgba(255,255,255,0.08)",
              background: p.selected ? `${GOLD}10` : "rgba(255,255,255,0.02)",
              boxShadow: p.selected ? `0 0 24px ${GOLD}20` : "none",
            }}
          >
            {p.selected && (
              <div className="font-[Cinzel] text-[7px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm self-start" style={{ background: GOLD, color: "#080604" }}>
                Selected
              </div>
            )}
            <p className="font-[Cinzel] text-[10px] tracking-[0.2em] uppercase" style={{ color: p.selected ? GOLD : "rgba(255,255,255,0.5)" }}>{p.name}</p>
            <p className="font-[Cormorant_Garamond] text-3xl font-bold text-white">{p.price}</p>
            {p.features.map(f => (
              <p key={f} className="font-[Manrope] text-[10px] text-white/50 flex items-center gap-1.5">
                <span style={{ color: GOLD }}>✦</span>{f}
              </p>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Scene 3: Event Details ─────────────────────── */
function SceneEventDetails() {
  return (
    <motion.div {...fadeScene} className="flex flex-col items-center gap-5 px-8 w-full max-w-lg mx-auto">
      <SceneLabel text="Step 2 — Event Details" />
      <motion.div {...stagger(0)} className="text-center">
        <p className="font-[Cinzel] text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>Step 2 of 4</p>
        <h2 className="font-[Cormorant_Garamond] text-3xl font-light text-white">Your Event</h2>
      </motion.div>
      <GoldLine />
      <div className="w-full space-y-3">
        {[
          { label: "Event Type",    value: "Wedding Ceremony" },
          { label: "Event Date",    value: "14 February 2026" },
          { label: "Guest Count",   value: "500 guests" },
          { label: "Special Notes", value: "Traditional Maharashtrian decor" },
        ].map((f, i) => (
          <motion.div key={f.label} {...stagger(i + 1)}>
            <p className="font-[Cinzel] text-[9px] tracking-[0.2em] uppercase mb-1.5" style={{ color: `${GOLD}99` }}>{f.label}</p>
            <div className="border rounded-sm px-4 py-2.5" style={{ borderColor: `${GOLD}40`, background: `${GOLD}06` }}>
              <p className="font-[Manrope] text-sm text-white/80">{f.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Scene 4: Contact Form ──────────────────────── */
function SceneContact() {
  return (
    <motion.div {...fadeScene} className="flex flex-col items-center gap-5 px-8 w-full max-w-lg mx-auto">
      <SceneLabel text="Step 3 — Your Details" />
      <motion.div {...stagger(0)} className="text-center">
        <p className="font-[Cinzel] text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>Step 3 of 4</p>
        <h2 className="font-[Cormorant_Garamond] text-3xl font-light text-white">Contact Information</h2>
      </motion.div>
      <GoldLine />
      <div className="w-full space-y-3">
        {[
          { label: "Full Name",     value: "Anjali Mehta" },
          { label: "Email Address", value: "anjali.mehta@gmail.com" },
          { label: "Phone Number",  value: "+91 87654 32109" },
          { label: "City",          value: "Mumbai, Maharashtra" },
        ].map((f, i) => (
          <motion.div key={f.label} {...stagger(i + 1)}>
            <p className="font-[Cinzel] text-[9px] tracking-[0.2em] uppercase mb-1.5" style={{ color: `${GOLD}99` }}>{f.label}</p>
            <div className="border border-white/10 rounded-sm px-4 py-2.5 bg-white/[0.03]">
              <p className="font-[Manrope] text-sm text-white/80">{f.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Scene 5: Payment ───────────────────────────── */
function ScenePayment() {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setPulse(true), 2500);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div {...fadeScene} className="flex flex-col items-center gap-5 px-8 w-full max-w-lg mx-auto">
      <SceneLabel text="Step 4 — Payment" />
      <motion.div {...stagger(0)} className="text-center">
        <p className="font-[Cinzel] text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>Step 4 of 4</p>
        <h2 className="font-[Cormorant_Garamond] text-3xl font-light text-white">Secure Advance Payment</h2>
      </motion.div>
      <GoldLine />
      <motion.div {...stagger(1)} className="w-full border rounded-sm p-6 text-center" style={{ borderColor: `${GOLD}40`, background: `${GOLD}06` }}>
        <p className="font-[Cinzel] text-[10px] tracking-[0.2em] uppercase mb-1 text-white/50">Refundable Advance</p>
        <p className="font-[Cormorant_Garamond] text-6xl font-bold mb-1" style={{ color: GOLD }}>₹2,000</p>
        <p className="font-[Manrope] text-[11px] text-white/40">100% refundable if you cancel before 30 days</p>
      </motion.div>
      <motion.div {...stagger(2)} className="w-full border border-white/8 rounded-sm p-4 flex items-center justify-between">
        <div>
          <p className="font-[Manrope] text-xs text-white/40 mb-0.5">Venue</p>
          <p className="font-[Cormorant_Garamond] text-lg text-white font-semibold">Grand Ballroom, Mumbai</p>
        </div>
        <div className="text-right">
          <p className="font-[Manrope] text-xs text-white/40 mb-0.5">Package</p>
          <p className="font-[Cinzel] text-[10px] tracking-[0.15em] uppercase" style={{ color: GOLD }}>Gold Package</p>
        </div>
      </motion.div>
      <motion.div
        {...stagger(3)}
        animate={pulse ? { scale: [1, 1.02, 1], boxShadow: [`0 0 0px ${GOLD}00`, `0 0 20px ${GOLD}60`, `0 0 0px ${GOLD}00`] } : {}}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="w-full py-4 rounded-sm font-[Cinzel] text-[11px] tracking-[0.25em] uppercase text-center"
        style={{ background: GOLD, color: "#080604" }}
      >
        Pay ₹2,000 Securely · Razorpay
      </motion.div>
      <motion.p {...stagger(4)} className="font-[Manrope] text-[10px] text-white/25 flex items-center gap-2">
        <span>🔒</span> 256-bit SSL encrypted · Powered by Razorpay
      </motion.p>
    </motion.div>
  );
}

/* ── Scene 6: Booking Confirmed ─────────────────── */
function SceneSuccess() {
  return (
    <motion.div {...fadeScene} className="flex flex-col items-center justify-center gap-6 text-center px-8 w-full max-w-lg mx-auto">
      <SceneLabel text="Booking Confirmed" />
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-20 h-20 rounded-full border-2 flex items-center justify-center"
        style={{ borderColor: "#4ade80", background: "rgba(74,222,128,0.08)" }}
      >
        <span className="text-3xl">✓</span>
      </motion.div>
      <motion.h2 {...stagger(1)} className="font-[Cormorant_Garamond] text-4xl font-light text-white">
        Booking <span style={{ color: GOLD }}>Confirmed!</span>
      </motion.h2>
      <GoldLine />
      <motion.div {...stagger(2)} className="w-full border border-white/8 rounded-sm p-5 space-y-2 text-left">
        {[
          { label: "Venue",   value: "Grand Ballroom, Mumbai" },
          { label: "Date",    value: "14 February 2026" },
          { label: "Package", value: "Gold Package · ₹85,000" },
          { label: "Advance", value: "₹2,000 paid · Razorpay" },
        ].map((d, i) => (
          <motion.div key={d.label} {...stagger(i + 3)} className="flex justify-between items-center">
            <span className="font-[Cinzel] text-[9px] tracking-[0.15em] uppercase text-white/35">{d.label}</span>
            <span className="font-[Manrope] text-sm text-white/80">{d.value}</span>
          </motion.div>
        ))}
      </motion.div>
      <motion.p {...stagger(7)} className="font-[Manrope] text-white/40 text-sm">
        Confirmation sent to anjali.mehta@gmail.com
      </motion.p>
    </motion.div>
  );
}

/* ── Scene 7: Outro ─────────────────────────────── */
function SceneOutro() {
  return (
    <motion.div {...fadeScene} className="flex flex-col items-center justify-center gap-6 text-center px-8 w-full max-w-xl mx-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-20 h-20 rounded-full border-2 flex items-center justify-center mb-2"
        style={{ borderColor: GOLD }}
      >
        <span className="font-[Cinzel] text-2xl font-bold" style={{ color: GOLD }}>BMS</span>
      </motion.div>
      <motion.h1 {...stagger(1)} className="font-[Cormorant_Garamond] text-5xl font-light text-white leading-tight">
        Your Dream Wedding<br />
        <span style={{ color: GOLD }}>Starts Here</span>
      </motion.h1>
      <GoldLine />
      <motion.p {...stagger(2)} className="font-[Manrope] text-white/50 text-sm leading-relaxed">
        ₹2,000 secures your venue · 100% refundable<br />
        436+ venues across India
      </motion.p>
      <motion.div
        {...stagger(3)}
        className="px-10 py-3 rounded-sm font-[Cinzel] text-[11px] tracking-[0.25em] uppercase mt-2"
        style={{ background: GOLD, color: "#080604" }}
      >
        bookmysquad.in
      </motion.div>
    </motion.div>
  );
}

const SCENES = [
  SceneDirectory, SceneVenueDetail, ScenePackage, SceneEventDetails,
  SceneContact, ScenePayment, SceneSuccess, SceneOutro,
];

export default function BookingPaymentDemo() {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setScene(s => (s + 1) % TOTAL), SCENE_MS);
    return () => clearInterval(t);
  }, []);

  const SceneComponent = SCENES[scene];

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: "#080604", fontFamily: "Manrope, sans-serif" }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Manrope:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)" }}
        />
      </div>

      <div className="absolute top-6 left-8 font-[Cinzel] text-[10px] tracking-[0.3em] uppercase opacity-30 text-white">
        Booking & Payment Demo
      </div>

      <AnimatePresence mode="wait">
        <SceneComponent key={scene} />
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ width: i === scene ? 28 : 8, opacity: i === scene ? 1 : 0.25 }}
            transition={{ duration: 0.35 }}
            className="h-0.5 rounded-full"
            style={{ background: GOLD }}
          />
        ))}
      </div>
    </div>
  );
}
