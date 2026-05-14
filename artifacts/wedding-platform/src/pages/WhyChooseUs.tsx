import { motion } from "framer-motion";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ShieldCheck, Star, Globe, BadgeCheck, Headphones, Lock,
  Search, Heart, MessageSquare, CheckCircle2, ArrowRight,
  Users, MapPin, Camera,
} from "lucide-react";

const WHY_CARDS = [
  {
    icon: ShieldCheck,
    title: "Verified Vendors Only",
    desc: "Every vendor on our platform is GST-verified and manually reviewed before listing — so you connect only with authentic, trusted professionals.",
    accent: "#d4af37",
  },
  {
    icon: Star,
    title: "Curated Premium Listings",
    desc: "No spam, no unverified listings. Every venue and vendor is curated for quality, ensuring your shortlist is always worth your time.",
    accent: "#f5a623",
  },
  {
    icon: Globe,
    title: "Pan-India Coverage",
    desc: "From metropolitan cities to dream destination locations — we cover 76+ cities across India including Goa, Udaipur, Jaipur, Rishikesh, and more.",
    accent: "#50e3c2",
  },
  {
    icon: BadgeCheck,
    title: "Transparent Reviews",
    desc: "Real reviews from real couples. Our review system is verified and moderated so you can make confident decisions for your big day.",
    accent: "#d4af37",
  },
  {
    icon: Headphones,
    title: "Dedicated Planning Support",
    desc: "Our onboarding and planning support team is available to help you navigate the platform, shortlist vendors, and get the best deals.",
    accent: "#e8a4c8",
  },
  {
    icon: Lock,
    title: "Safe & Secure Platform",
    desc: "Your personal data is protected. We never sell your details. All enquiries go directly to the vendor with your consent.",
    accent: "#9b8ae0",
  },
];

const STEPS = [
  { n: "01", icon: Search, title: "Search & Discover", desc: "Browse verified vendors and venues by city, category, and budget — all in one beautiful interface." },
  { n: "02", icon: Heart, title: "Save & Shortlist", desc: "Shortlist your favourites as you browse. Compare options side by side before reaching out." },
  { n: "03", icon: MessageSquare, title: "Connect Directly", desc: "Send enquiries straight to the vendor or venue. No middlemen, no hidden commissions." },
  { n: "04", icon: CheckCircle2, title: "Book with Confidence", desc: "Finalise your booking knowing every listing is verified and reviewed by couples like you." },
];

const TESTIMONIALS = [
  {
    name: "Priya & Rohan Sharma",
    city: "Delhi → Udaipur",
    text: "Book My Squad made finding a destination wedding photographer so effortless. We shortlisted 8 photographers in one evening and booked the perfect one within a week!",
    rating: 5,
  },
  {
    name: "Ananya Krishnamurthy",
    city: "Bangalore",
    text: "The GST-verified badge gave us so much confidence. We knew every vendor we contacted was a real, registered business. No stress at all.",
    rating: 5,
  },
  {
    name: "Meera & Vikram Patel",
    city: "Mumbai → Goa",
    text: "We planned our entire beach wedding through Book My Squad — venue, makeup, photographer, caterer. The platform is absolutely stunning to use.",
    rating: 5,
  },
];

const STATS = [
  { n: "50,000+", l: "Couples Served" },
  { n: "255+", l: "Verified Vendors" },
  { n: "436+", l: "Listed Venues" },
  { n: "76+", l: "Cities Covered" },
];

export default function WhyChooseUs() {
  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28">

        {/* Hero */}
        <section className="relative py-28 px-6 md:px-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <p className="font-cinzel text-xs tracking-[0.6em] text-primary uppercase mb-5">✦ Why Book My Squad ✦</p>
            <div className="gold-line w-20 mx-auto mb-8" />
            <h1 className="font-cormorant text-6xl md:text-8xl font-semibold mb-6 leading-[1.05]"
              style={{ color: "#fff", textShadow: "0 4px 60px rgba(212,175,55,0.20)" }}>
              India's Most{" "}
              <span className="italic" style={{ color: "#d4af37", textShadow: "0 0 80px rgba(212,175,55,0.40)" }}>
                Trusted
              </span>
              <br />Event Platform
            </h1>
            <p className="font-manrope text-white/60 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-10">
              From intimate celebrations to grand destination weddings — we bring together verified vendors, stunning venues, and expert support to make your dream event a reality.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/vendors">
                <button className="px-8 py-3.5 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all duration-300 gold-glow flex items-center gap-2 group">
                  Browse Vendors
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/venues">
                <button className="px-8 py-3.5 border border-primary/40 text-primary font-cinzel font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary/10 transition-all duration-300">
                  Explore Venues
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="bg-primary/8 border-y border-primary/20 py-10 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="font-cormorant text-4xl md:text-5xl text-primary font-semibold"
                  style={{ textShadow: "0 0 30px rgba(212,175,55,0.3)" }}>{s.n}</div>
                <div className="font-cinzel text-[10px] text-white/50 uppercase tracking-widest mt-2">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why cards */}
        <section className="py-24 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Our Difference ✦</p>
              <div className="gold-line w-16 mx-auto mb-6" />
              <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-white"
                style={{ textShadow: "0 0 40px rgba(212,175,55,0.12)" }}>
                Built for couples who{" "}
                <span className="italic" style={{ color: "#d4af37" }}>demand the best</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {WHY_CARDS.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.08 * i }}
                  className="group relative p-7 rounded-sm border border-white/8 cursor-default transition-all duration-500 hover:border-primary/30 hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                  }}
                >
                  <div className="absolute top-0 left-0 w-12 h-px bg-gradient-to-r from-primary/40 to-transparent" />
                  <div className="absolute top-0 left-0 w-px h-12 bg-gradient-to-b from-primary/40 to-transparent" />
                  <div className="w-11 h-11 rounded-sm bg-primary/8 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/14 group-hover:border-primary/40 transition-all duration-300">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-cinzel text-sm tracking-[0.08em] text-white font-semibold mb-3 group-hover:text-primary/90 transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="font-manrope text-[13px] text-white/45 leading-relaxed group-hover:text-white/60 transition-colors duration-300">
                    {card.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-6 md:px-12"
          style={{ background: "linear-gradient(180deg, #080604 0%, #0a0805 50%, #080604 100%)" }}>
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ How It Works ✦</p>
              <div className="gold-line w-16 mx-auto mb-6" />
              <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-white">
                Your journey from{" "}
                <span className="italic" style={{ color: "#d4af37" }}>search to celebration</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 * i }}
                  className="relative text-center group"
                >
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(50%+24px)] right-[-calc(50%-24px)] h-px bg-gradient-to-r from-primary/30 to-primary/10" />
                  )}
                  <div className="w-16 h-16 rounded-full bg-primary/8 border border-primary/25 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/14 group-hover:border-primary/45 transition-all duration-300 relative z-10">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-cinzel text-[9px] tracking-[0.4em] text-primary/40 uppercase mb-2">{step.n}</p>
                  <h3 className="font-cinzel text-sm tracking-[0.05em] text-white font-semibold mb-3">{step.title}</h3>
                  <p className="font-manrope text-[13px] text-white/40 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Real Couples, Real Stories ✦</p>
              <div className="gold-line w-16 mx-auto mb-6" />
              <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-white">
                What our couples{" "}
                <span className="italic" style={{ color: "#d4af37" }}>say about us</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 * i }}
                  className="relative p-7 border border-white/8 rounded-sm"
                  style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.04) 0%, rgba(255,255,255,0.015) 100%)" }}
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="font-manrope text-sm text-white/60 leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/12 border border-primary/25 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-primary/60" />
                    </div>
                    <div>
                      <p className="font-cinzel text-[10px] tracking-[0.1em] text-white/80 font-semibold">{t.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-primary/40" />
                        <p className="font-manrope text-[10px] text-white/35">{t.city}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.10)_0%,transparent_65%)]" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-5">✦ Start Today ✦</p>
            <div className="gold-line w-16 mx-auto mb-8" />
            <h2 className="font-cormorant text-5xl md:text-6xl font-semibold text-white mb-6"
              style={{ textShadow: "0 0 60px rgba(212,175,55,0.15)" }}>
              Plan your{" "}
              <span className="italic" style={{ color: "#d4af37" }}>dream event</span>
              <br />with us today
            </h2>
            <p className="font-manrope text-white/50 text-base mb-10 max-w-xl mx-auto leading-relaxed">
              Join 50,000+ couples who trusted Book My Squad for their most important celebration.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/vendors">
                <button className="px-10 py-4 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.25em] uppercase hover:bg-primary/90 transition-all duration-300 gold-glow flex items-center gap-2 group">
                  Find Vendors Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/venues">
                <button className="px-10 py-4 border border-primary/35 text-primary/80 font-cinzel font-bold text-xs tracking-[0.25em] uppercase hover:bg-primary/8 hover:border-primary/55 transition-all duration-300">
                  Browse Venues
                </button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              {[
                { icon: Camera, text: "255+ Verified Vendors" },
                { icon: ShieldCheck, text: "GST Authenticated" },
                { icon: Star, text: "Curated & Reviewed" },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2 text-white/35">
                  <b.icon className="w-3.5 h-3.5 text-primary/50" />
                  <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
