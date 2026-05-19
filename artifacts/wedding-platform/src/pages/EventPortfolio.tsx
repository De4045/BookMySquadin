import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, MapPin, Users, Tag, Calendar } from "lucide-react";
import { useMeta } from "@/hooks/useMeta";
import { useScrollAnimation, useStaggerAnimation } from "@/hooks/useScrollAnimation";
import { CASE_STUDIES, CATEGORY_META, type EventCategory } from "@/data/caseStudies";
import { ConsultationModal } from "@/components/ConsultationModal";
import { TiltCard } from "@/components/TiltCard";

const CATS: { id: EventCategory | "all"; label: string; icon: string }[] = [
  { id: "all",         label: "All Events",           icon: "✦" },
  { id: "wedding",     label: "Weddings",             icon: "♡" },
  { id: "destination", label: "Destination",          icon: "◇" },
  { id: "corporate",   label: "Corporate",            icon: "◈" },
  { id: "birthday",    label: "Birthdays",            icon: "✿" },
];

const STATS = [
  { num: "340+", label: "Events Executed" },
  { num: "₹180Cr+", label: "Combined Event Value" },
  { num: "98%", label: "Client Satisfaction" },
  { num: "24", label: "States & Countries" },
];

export default function EventPortfolio() {
  useMeta({ title: "Event Portfolio — Book My Squad" });

  const [activeFilter, setActiveFilter] = useState<EventCategory | "all">("all");
  const [consultOpen, setConsultOpen] = useState(false);

  const headRef  = useScrollAnimation<HTMLDivElement>({ type: "fadeUp", duration: 1 });
  const statsRef = useStaggerAnimation<HTMLDivElement>({ type: "fadeUp", stagger: 0.1 });
  const gridRef  = useStaggerAnimation<HTMLDivElement>({ type: "scaleIn", stagger: 0.07, start: "top 90%" });

  const filtered = activeFilter === "all"
    ? CASE_STUDIES
    : CASE_STUDIES.filter(c => c.category === activeFilter);

  return (
    <div className="min-h-screen bg-[#080604] text-white flex flex-col font-sans pb-mobile-nav lg:pb-0">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-28 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 65%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#080604] to-transparent" />
          {/* BG image collage strip */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 overflow-hidden">
            <div className="grid grid-cols-2 gap-1 h-full">
              {CASE_STUDIES.slice(0, 4).map(cs => (
                <img key={cs.slug} src={cs.coverImg} className="w-full h-full object-cover" alt="" />
              ))}
            </div>
          </div>
        </div>

        <div ref={headRef} className="max-w-4xl relative z-10">
          <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Portfolio ✦</p>
          <div className="gold-line w-16 mb-6" />
          <h1 className="font-cormorant text-5xl md:text-7xl lg:text-8xl text-white font-light leading-[0.95] mb-6">
            Events We've<br />
            <span className="text-primary italic font-semibold">Crafted</span>
          </h1>
          <p className="font-manrope text-white/60 text-base md:text-lg max-w-xl leading-relaxed mb-10">
            340+ extraordinary celebrations across India and internationally — each one a meticulously crafted story of love, achievement, and joy.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setConsultOpen(true)}
              className="px-7 py-3.5 bg-primary text-black font-cinzel font-bold text-[10px] tracking-[0.25em] uppercase hover:bg-primary/90 transition-all gold-glow"
            >
              Plan Your Event
            </button>
            <button
              onClick={() => setConsultOpen(true)}
              className="px-7 py-3.5 border border-white/20 text-white font-cinzel text-[10px] tracking-[0.25em] uppercase hover:border-primary/50 hover:text-primary transition-all"
            >
              Get Instant Quote
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-16 px-6 md:px-12 border-y border-white/5 bg-[#0a0806]">
        <div ref={statsRef} className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-cormorant text-4xl md:text-5xl text-primary font-semibold mb-2">{s.num}</div>
              <div className="font-manrope text-white/50 text-[11px] uppercase tracking-[0.25em]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY FILTER ── */}
      <section className="pt-20 pb-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {CATS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 border font-cinzel text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
                  activeFilter === cat.id
                    ? "bg-primary text-black border-primary"
                    : "border-white/15 text-white/60 hover:border-primary/40 hover:text-primary"
                }`}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDY GRID ── */}
      <section className="pb-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((cs, i) => {
                  const meta = CATEGORY_META[cs.category];
                  return (
                    <Link key={cs.slug} href={`/events/${cs.slug}`}>
                      <TiltCard max={4} glare>
                        <div className="group relative overflow-hidden cursor-pointer h-[480px] luxury-card">
                          {/* Cover image */}
                          <img
                            src={cs.coverImg}
                            alt={cs.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/96 via-black/50 to-black/10 group-hover:via-black/40 transition-all duration-500" />

                          {/* Category badge */}
                          <div className="absolute top-5 left-5">
                            <span
                              className="font-cinzel text-[8px] tracking-[0.3em] uppercase px-3 py-1.5 border backdrop-blur-sm"
                              style={{ color: meta.color, borderColor: meta.color + "40", background: meta.color + "10" }}
                            >
                              {meta.icon} {meta.label}
                            </span>
                          </div>

                          {/* Gold hover line top */}
                          <div className="absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)` }} />

                          {/* Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-7">
                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-3 h-3 text-primary/60 shrink-0" />
                              <span className="font-manrope text-[11px] text-white/55">{cs.location.split(",")[0]}</span>
                              <span className="w-1 h-1 rounded-full bg-white/20" />
                              <Users className="w-3 h-3 text-primary/60 shrink-0" />
                              <span className="font-manrope text-[11px] text-white/55">{cs.guests} guests</span>
                            </div>

                            <h3 className="font-cormorant text-2xl text-white font-semibold leading-tight mb-1">
                              {cs.title}
                            </h3>
                            {cs.names && (
                              <p className="font-cormorant italic text-lg text-primary/80 mb-3">{cs.names}</p>
                            )}

                            <div className="flex flex-wrap gap-1.5 mb-5">
                              {cs.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="font-cinzel text-[7px] tracking-[0.2em] uppercase text-white/50 border border-white/10 px-2 py-0.5 backdrop-blur-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-manrope text-[10px] text-white/40 block">Budget</span>
                                <span className="font-cinzel text-sm text-primary font-semibold">{cs.budget}</span>
                              </div>
                              <span className="flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.2em] uppercase text-primary/70 group-hover:text-primary group-hover:gap-2.5 transition-all duration-300">
                                View Case Study <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </TiltCard>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CATEGORY HIGHLIGHTS ── */}
      <section className="py-24 px-6 md:px-12 bg-[#0a0806] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Our Expertise ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="font-cormorant text-5xl md:text-6xl text-white font-light">
              Every Event <span className="text-primary italic font-semibold">Category</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(CATEGORY_META) as EventCategory[]).map((cat) => {
              const m = CATEGORY_META[cat];
              const count = CASE_STUDIES.filter(c => c.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveFilter(cat); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="glass-card p-8 text-left group hover:border-primary/30 transition-all duration-400"
                >
                  <span className="text-3xl block mb-4" style={{ color: m.color }}>{m.icon}</span>
                  <h3 className="font-cinzel text-sm tracking-[0.1em] uppercase text-white mb-2 group-hover:text-primary transition-colors">{m.label}</h3>
                  <p className="font-manrope text-white/50 text-xs leading-relaxed mb-4">{m.desc}</p>
                  <span className="font-manrope text-[10px] text-white/30">{count} case studies</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="py-24 px-6 md:px-12 bg-[#080604] border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Your Event Awaits ✦</p>
          <div className="gold-line w-16 mx-auto mb-8" />
          <h2 className="font-cormorant text-5xl md:text-6xl text-white font-light mb-6">
            Ready to plan your<br />
            <span className="text-primary italic font-semibold">dream event?</span>
          </h2>
          <p className="font-manrope text-white/55 text-base leading-relaxed mb-12 max-w-xl mx-auto">
            Our experts have crafted 340+ extraordinary celebrations. Let's make yours the next masterpiece.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setConsultOpen(true)}
              className="px-10 py-4 bg-primary text-black font-cinzel font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-primary/90 transition-all gold-glow"
            >
              Book Free Consultation
            </button>
            <button
              onClick={() => setConsultOpen(true)}
              className="px-10 py-4 border border-primary/40 text-primary font-cinzel text-[10px] tracking-[0.3em] uppercase hover:bg-primary/8 transition-all"
            >
              Get Instant Quote
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <ConsultationModal isOpen={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
