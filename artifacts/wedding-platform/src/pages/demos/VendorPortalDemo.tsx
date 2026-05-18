import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GOLD = "#d4af37";
const SCENE_MS = 6500;
const TOTAL = 7;

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

/* ── Scene 0: Login ─────────────────────────────── */
function SceneLogin() {
  return (
    <motion.div {...fadeScene} className="flex flex-col items-center justify-center gap-8 px-6 text-center w-full max-w-sm mx-auto">
      <SceneLabel text="Vendor Sign In" />
      <motion.div {...stagger(0)} className="font-[Cinzel] text-[11px] tracking-[0.3em] uppercase" style={{ color: GOLD }}>
        Book My Squad
      </motion.div>
      <motion.h2 {...stagger(1)} className="font-[Cormorant_Garamond] text-4xl font-light text-white">
        Welcome Back
      </motion.h2>
      <GoldLine />
      <div className="w-full space-y-3">
        <motion.div {...stagger(2)} className="w-full border border-white/10 bg-white/5 rounded-sm px-4 py-3 text-left">
          <p className="font-[Manrope] text-[11px] text-white/30 mb-1">Email</p>
          <TypedText text="vendor@bookmysquad.in" delay={0.8} />
        </motion.div>
        <motion.div {...stagger(3)} className="w-full border border-white/10 bg-white/5 rounded-sm px-4 py-3 text-left">
          <p className="font-[Manrope] text-[11px] text-white/30 mb-1">Password</p>
          <p className="font-[Manrope] text-sm text-white/70 tracking-widest">••••••••••</p>
        </motion.div>
        <motion.div
          {...stagger(4)}
          className="w-full py-3 rounded-sm font-[Cinzel] text-[11px] tracking-[0.2em] uppercase flex items-center justify-center"
          style={{ background: GOLD, color: "#080604" }}
        >
          Sign In
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Scene 1: Dashboard ─────────────────────────── */
function SceneDashboard() {
  const stats = [
    { label: "Enquiries", value: "12", sub: "This month" },
    { label: "Bookings", value: "5",  sub: "Confirmed" },
    { label: "Revenue",  value: "₹1.8L", sub: "Earned" },
  ];
  return (
    <motion.div {...fadeScene} className="flex flex-col items-center gap-8 px-8 w-full max-w-2xl mx-auto">
      <SceneLabel text="Vendor Dashboard" />
      <motion.div {...stagger(0)} className="text-center">
        <p className="font-[Cinzel] text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>Vendor Portal</p>
        <h2 className="font-[Cormorant_Garamond] text-3xl font-light text-white">
          Welcome back,{" "}
          <span style={{ color: GOLD }}>Royal Photography Studio</span>
        </h2>
      </motion.div>
      <GoldLine />
      <div className="grid grid-cols-3 gap-4 w-full">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            {...stagger(i + 1)}
            className="border rounded-sm p-5 text-center"
            style={{ borderColor: "rgba(212,175,55,0.2)", background: "rgba(212,175,55,0.04)" }}
          >
            <p className="font-[Cormorant_Garamond] text-4xl font-bold mb-1" style={{ color: GOLD }}>{s.value}</p>
            <p className="font-[Cinzel] text-[9px] tracking-[0.2em] uppercase text-white/70">{s.label}</p>
            <p className="font-[Manrope] text-[10px] text-white/30 mt-1">{s.sub}</p>
          </motion.div>
        ))}
      </div>
      <motion.div {...stagger(4)} className="flex gap-4">
        {["Enquiries","Bookings","Profile","Subscription"].map((tab) => (
          <div key={tab} className="font-[Cinzel] text-[9px] tracking-[0.18em] uppercase px-4 py-2 border border-white/10 text-white/40 rounded-sm">
            {tab}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ── Scene 2: Enquiries ─────────────────────────── */
function SceneEnquiries() {
  const enquiries = [
    { name: "Priya & Rohan", date: "12 Feb 2026", city: "Mumbai", status: "New" },
    { name: "Simran & Arjun", date: "8 Mar 2026", city: "Delhi", status: "New" },
    { name: "Kavya & Aditya", date: "22 Mar 2026", city: "Pune", status: "Read" },
  ];
  return (
    <motion.div {...fadeScene} className="flex flex-col items-center gap-6 px-8 w-full max-w-2xl mx-auto">
      <SceneLabel text="Enquiries" />
      <motion.div {...stagger(0)} className="text-center">
        <p className="font-[Cinzel] text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>Incoming</p>
        <h2 className="font-[Cormorant_Garamond] text-3xl font-light text-white">Client Enquiries</h2>
      </motion.div>
      <GoldLine />
      <div className="w-full space-y-3">
        {enquiries.map((e, i) => (
          <motion.div
            key={e.name}
            {...stagger(i + 1)}
            className="flex items-center justify-between border border-white/8 bg-white/[0.03] rounded-sm px-5 py-4"
          >
            <div>
              <p className="font-[Cormorant_Garamond] text-lg text-white font-semibold">{e.name}</p>
              <p className="font-[Manrope] text-[11px] text-white/40">{e.city} · {e.date}</p>
            </div>
            <span
              className="font-[Cinzel] text-[8px] tracking-[0.2em] uppercase px-3 py-1 rounded-sm border"
              style={e.status === "New"
                ? { color: GOLD, borderColor: `${GOLD}40`, background: `${GOLD}10` }
                : { color: "rgba(255,255,255,0.3)", borderColor: "rgba(255,255,255,0.1)" }
              }
            >
              {e.status}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Scene 3: Profile Edit ──────────────────────── */
function SceneProfile() {
  const fields = [
    { label: "Business Name", value: "Royal Photography Studio" },
    { label: "City", value: "Mumbai, Maharashtra" },
    { label: "Phone", value: "+91 98765 43210" },
    { label: "Bio", value: "Candid moments & cinematic films since 2018." },
  ];
  return (
    <motion.div {...fadeScene} className="flex flex-col items-center gap-6 px-8 w-full max-w-lg mx-auto">
      <SceneLabel text="My Profile" />
      <motion.div {...stagger(0)} className="text-center">
        <p className="font-[Cinzel] text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>Edit Profile</p>
        <h2 className="font-[Cormorant_Garamond] text-3xl font-light text-white">Your Business Identity</h2>
      </motion.div>
      <GoldLine />
      <div className="w-full space-y-3">
        {fields.map((f, i) => (
          <motion.div key={f.label} {...stagger(i + 1)} className="w-full">
            <p className="font-[Cinzel] text-[9px] tracking-[0.2em] uppercase mb-1.5" style={{ color: `${GOLD}99` }}>{f.label}</p>
            <div className="border rounded-sm px-4 py-2.5" style={{ borderColor: `${GOLD}40`, background: `${GOLD}06` }}>
              <TypedText text={f.value} delay={0.4 + i * 0.15} speed={30} />
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        {...stagger(5)}
        className="px-8 py-2.5 rounded-sm font-[Cinzel] text-[10px] tracking-[0.2em] uppercase"
        style={{ background: GOLD, color: "#080604" }}
      >
        Save Changes
      </motion.div>
    </motion.div>
  );
}

/* ── Scene 4: Bookings ──────────────────────────── */
function SceneBookings() {
  const bookings = [
    { venue: "Le Meridien, Mumbai", date: "14 Feb 2026", pkg: "Gold Package", status: "CONFIRMED", amount: "₹85,000" },
    { venue: "ITC Grand Bharat", date: "8 Mar 2026",  pkg: "Platinum",      status: "PENDING",   amount: "₹1,25,000" },
    { venue: "The Leela Palace",  date: "1 Apr 2026",  pkg: "Silver Package", status: "CONFIRMED", amount: "₹55,000" },
  ];
  return (
    <motion.div {...fadeScene} className="flex flex-col items-center gap-6 px-8 w-full max-w-2xl mx-auto">
      <SceneLabel text="My Bookings" />
      <motion.div {...stagger(0)} className="text-center">
        <p className="font-[Cinzel] text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>Bookings</p>
        <h2 className="font-[Cormorant_Garamond] text-3xl font-light text-white">Upcoming Events</h2>
      </motion.div>
      <GoldLine />
      <div className="w-full space-y-3">
        {bookings.map((b, i) => (
          <motion.div key={b.venue} {...stagger(i + 1)} className="flex items-center justify-between border border-white/8 bg-white/[0.03] rounded-sm px-5 py-4">
            <div>
              <p className="font-[Cormorant_Garamond] text-lg font-semibold text-white">{b.venue}</p>
              <p className="font-[Manrope] text-[11px] text-white/40">{b.pkg} · {b.date}</p>
            </div>
            <div className="text-right">
              <p className="font-[Cormorant_Garamond] text-lg font-bold" style={{ color: GOLD }}>{b.amount}</p>
              <span
                className="font-[Cinzel] text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm"
                style={b.status === "CONFIRMED"
                  ? { color: "#4ade80", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)" }
                  : { color: GOLD, background: `${GOLD}15`, border: `1px solid ${GOLD}40` }
                }
              >
                {b.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Scene 5: Subscription ──────────────────────── */
function SceneSubscription() {
  return (
    <motion.div {...fadeScene} className="flex flex-col items-center gap-6 px-8 w-full max-w-2xl mx-auto">
      <SceneLabel text="Subscription" />
      <motion.div {...stagger(0)} className="text-center">
        <p className="font-[Cinzel] text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>Grow Your Business</p>
        <h2 className="font-[Cormorant_Garamond] text-3xl font-light text-white">Visibility Plans</h2>
      </motion.div>
      <GoldLine />
      <div className="grid grid-cols-3 gap-4 w-full">
        {[
          { name: "Silver", price: "₹2,999", features: ["Listed in directory","5 enquiries/mo","Basic badge"], highlight: false },
          { name: "Gold",   price: "₹7,999", features: ["Priority listing","Unlimited enquiries","Verified badge"], highlight: true },
          { name: "Platinum", price: "₹14,999", features: ["Top placement","Featured homepage","Dedicated manager"], highlight: false },
        ].map((plan, i) => (
          <motion.div
            key={plan.name}
            {...stagger(i + 1)}
            className="rounded-sm p-5 flex flex-col gap-3 border"
            style={{
              borderColor: plan.highlight ? GOLD : "rgba(255,255,255,0.08)",
              background: plan.highlight ? `${GOLD}08` : "rgba(255,255,255,0.02)",
            }}
          >
            <p className="font-[Cinzel] text-[10px] tracking-[0.2em] uppercase" style={{ color: plan.highlight ? GOLD : "rgba(255,255,255,0.5)" }}>{plan.name}</p>
            <p className="font-[Cormorant_Garamond] text-3xl font-bold text-white">{plan.price}</p>
            <p className="font-[Manrope] text-[10px] text-white/30">/month</p>
            {plan.features.map(f => (
              <p key={f} className="font-[Manrope] text-[11px] text-white/60 flex items-center gap-2">
                <span style={{ color: GOLD }}>✦</span> {f}
              </p>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Scene 6: Outro ─────────────────────────────── */
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
        Grow Your Wedding<br />
        <span style={{ color: GOLD }}>Business</span>
      </motion.h1>
      <GoldLine />
      <motion.p {...stagger(2)} className="font-[Manrope] text-white/50 text-sm leading-relaxed max-w-sm">
        Join 700+ vendors on India's premium<br />wedding planning marketplace
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

/* ── Typed Text utility ─────────────────────────── */
function TypedText({ text, delay = 0, speed = 40 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    const start = setTimeout(() => {
      let i = 0;
      const t = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(t);
      }, speed);
      return () => clearInterval(t);
    }, delay * 1000);
    return () => clearTimeout(start);
  }, [text, delay, speed]);
  return <span className="font-[Manrope] text-sm text-white/80">{displayed}<span className="animate-pulse" style={{ color: GOLD }}>|</span></span>;
}

/* ── Main export ────────────────────────────────── */
const SCENES = [SceneLogin, SceneDashboard, SceneEnquiries, SceneProfile, SceneBookings, SceneSubscription, SceneOutro];

export default function VendorPortalDemo() {
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

      {/* Ambient gold glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)" }} />
      </div>

      {/* Corner decoration */}
      <div className="absolute top-6 left-8 font-[Cinzel] text-[10px] tracking-[0.3em] uppercase opacity-30 text-white">
        Vendor Portal Demo
      </div>

      <AnimatePresence mode="wait">
        <SceneComponent key={scene} />
      </AnimatePresence>

      {/* Progress dots */}
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
