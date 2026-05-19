import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, MapPin, Users, Calendar, Tag, DollarSign, ArrowRight, Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { CASE_STUDIES, CATEGORY_META } from "@/data/caseStudies";
import { ConsultationModal } from "@/components/ConsultationModal";
import { TiltCard } from "@/components/TiltCard";
import { useScrollAnimation, useStaggerAnimation } from "@/hooks/useScrollAnimation";

function LightboxImage({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9900] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.img
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        src={src.replace("w=900", "w=1600")}
        alt={alt}
        className="max-w-full max-h-full object-contain rounded-sm"
        onClick={e => e.stopPropagation()}
      />
      <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors font-cinzel text-[10px] tracking-[0.3em] uppercase border border-white/15 px-4 py-2">
        Close
      </button>
    </motion.div>
  );
}

export default function CaseStudy() {
  const params = useParams<{ slug: string }>();
  const cs = CASE_STUDIES.find(c => c.slug === params.slug);

  const [consultOpen, setConsultOpen] = useState(false);
  const [lightbox, setLightbox]       = useState<string | null>(null);
  const [galIdx, setGalIdx]           = useState(0);

  const titleRef     = useScrollAnimation<HTMLDivElement>({ type: "fadeUp", duration: 1 });
  const metaRef      = useStaggerAnimation<HTMLDivElement>({ type: "fadeUp", stagger: 0.08 });
  const timelineRef  = useStaggerAnimation<HTMLDivElement>({ type: "slideRight", stagger: 0.1 });
  const vendorRef    = useStaggerAnimation<HTMLDivElement>({ type: "scaleIn", stagger: 0.07 });
  const relatedRef   = useStaggerAnimation<HTMLDivElement>({ type: "fadeUp", stagger: 0.1 });

  if (!cs) {
    return (
      <div className="min-h-screen bg-[#080604] text-white flex flex-col items-center justify-center gap-6">
        <Navbar />
        <p className="font-cormorant text-4xl text-white/60 mt-32">Event not found</p>
        <Link href="/events">
          <button className="flex items-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-primary hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
          </button>
        </Link>
      </div>
    );
  }

  const meta    = CATEGORY_META[cs.category];
  const related = CASE_STUDIES.filter(c => c.category === cs.category && c.slug !== cs.slug).slice(0, 3);

  const galleryAll = [cs.coverImg, ...cs.gallery];
  const visible    = galleryAll.slice(galIdx, galIdx + 4);
  const canPrev    = galIdx > 0;
  const canNext    = galIdx + 4 < galleryAll.length;

  return (
    <div className="min-h-screen bg-[#080604] text-white flex flex-col font-sans pb-mobile-nav lg:pb-0">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[70vh] min-h-[520px] overflow-hidden">
        <img src={cs.coverImg} alt={cs.title} className="absolute inset-0 w-full h-full object-cover scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080604] via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <Link href="/events" className="inline-flex items-center gap-2 font-cinzel text-[9px] tracking-[0.3em] uppercase text-white/50 hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-3 h-3" /> Portfolio
          </Link>
          <span
            className="inline-block font-cinzel text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 border backdrop-blur-sm mb-4"
            style={{ color: meta.color, borderColor: meta.color + "50", background: meta.color + "12" }}
          >
            {meta.icon} {meta.label}
          </span>
          <h1 className="font-cormorant text-4xl md:text-6xl lg:text-7xl text-white font-semibold leading-tight mb-2">
            {cs.title}
          </h1>
          {cs.names && (
            <p className="font-cormorant italic text-2xl md:text-3xl text-primary/90">{cs.names}</p>
          )}
        </div>
      </section>

      {/* ── META CARDS ── */}
      <section className="py-10 px-6 md:px-12 bg-[#0a0806] border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div ref={metaRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: MapPin,       label: "Location",  value: cs.location.split(",")[0] },
              { icon: DollarSign,   label: "Budget",    value: cs.budget               },
              { icon: Users,        label: "Guests",    value: cs.guests               },
              { icon: Calendar,     label: "Date",      value: cs.date                 },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass-card px-5 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="font-cinzel text-[8px] tracking-[0.25em] text-white/40 uppercase">{label}</p>
                  <p className="font-manrope text-sm text-white/85 font-medium mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* ── LEFT: Main content ── */}
          <div className="lg:col-span-2 space-y-20">

            {/* Theme */}
            <div ref={titleRef}>
              <p className="font-cinzel text-[9px] tracking-[0.4em] text-primary/60 uppercase mb-3">Theme</p>
              <div className="gold-line w-12 mb-5" />
              <p className="font-cormorant text-2xl md:text-3xl text-white font-light italic leading-relaxed">
                "{cs.theme}"
              </p>
            </div>

            {/* Highlights */}
            <div>
              <p className="font-cinzel text-[9px] tracking-[0.4em] text-primary/60 uppercase mb-3">Highlights</p>
              <div className="gold-line w-12 mb-6" />
              <ul className="space-y-4">
                {cs.highlights.map((h, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" />
                    <span className="font-manrope text-white/75 text-sm leading-relaxed">{h}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Gallery */}
            <div>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="font-cinzel text-[9px] tracking-[0.4em] text-primary/60 uppercase mb-3">Gallery</p>
                  <div className="gold-line w-12" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGalIdx(i => Math.max(0, i - 4))}
                    disabled={!canPrev}
                    className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/50 hover:border-primary/40 hover:text-primary transition-all disabled:opacity-25"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGalIdx(i => Math.min(galleryAll.length - 4, i + 4))}
                    disabled={!canNext}
                    className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/50 hover:border-primary/40 hover:text-primary transition-all disabled:opacity-25"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {visible.map((img, i) => (
                  <motion.div
                    key={`${galIdx}-${i}`}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => setLightbox(img)}
                    className={`overflow-hidden cursor-pointer group border border-white/5 hover:border-primary/40 transition-colors ${i === 0 ? "row-span-2" : ""}`}
                    style={{ aspectRatio: i === 0 ? "4/5" : "4/3" }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Planning Timeline */}
            <div>
              <p className="font-cinzel text-[9px] tracking-[0.4em] text-primary/60 uppercase mb-3">Planning Timeline</p>
              <div className="gold-line w-12 mb-8" />
              <div ref={timelineRef} className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden md:block" />
                <div className="space-y-8">
                  {cs.timeline.map((step, i) => (
                    <div key={i} className="flex gap-6 md:gap-10">
                      {/* Dot */}
                      <div className="relative flex-shrink-0 hidden md:flex items-start justify-center w-8 pt-1.5">
                        <div className="w-3 h-3 rounded-full border-2 border-primary bg-[#080604]" />
                      </div>
                      <div className="flex-1 glass-card px-6 py-5">
                        <span className="font-cinzel text-[8px] tracking-[0.3em] text-primary/60 uppercase">{step.phase}</span>
                        <h4 className="font-cormorant text-xl text-white font-semibold mt-1 mb-2">{step.title}</h4>
                        <p className="font-manrope text-white/60 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Sticky sidebar ── */}
          <div className="space-y-6 lg:sticky lg:top-32 lg:self-start">

            {/* CTA card */}
            <TiltCard max={4} glare>
              <div className="glass-gold p-8 space-y-4">
                <p className="font-cinzel text-[9px] tracking-[0.4em] text-primary/70 uppercase">Plan a Similar Event</p>
                <div className="gold-line w-12" />
                <h3 className="font-cormorant text-2xl text-white font-semibold leading-snug">
                  Let's build your masterpiece
                </h3>
                <p className="font-manrope text-white/55 text-sm leading-relaxed">
                  Our experts are ready to craft your event with the same precision and artistry.
                </p>
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => setConsultOpen(true)}
                    className="w-full py-3.5 bg-primary text-black font-cinzel font-bold text-[9px] tracking-[0.25em] uppercase hover:bg-primary/90 transition-all gold-glow"
                  >
                    Book Consultation
                  </button>
                  <button
                    onClick={() => setConsultOpen(true)}
                    className="w-full py-3.5 border border-white/15 text-white font-cinzel text-[9px] tracking-[0.25em] uppercase hover:border-primary/40 hover:text-primary transition-all"
                  >
                    Check Availability
                  </button>
                  <button
                    onClick={() => setConsultOpen(true)}
                    className="w-full py-3.5 border border-white/15 text-white font-cinzel text-[9px] tracking-[0.25em] uppercase hover:border-primary/40 hover:text-primary transition-all"
                  >
                    Get Instant Quote
                  </button>
                </div>
              </div>
            </TiltCard>

            {/* Vendor team */}
            <div className="glass-card p-7">
              <p className="font-cinzel text-[9px] tracking-[0.4em] text-primary/60 uppercase mb-4">Vendor Team</p>
              <div ref={vendorRef} className="space-y-3">
                {cs.vendors.map((v, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="font-cinzel text-[9px] tracking-[0.15em] uppercase text-white/40">{v.role}</span>
                    <span className="font-manrope text-xs text-white/75">{v.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="glass-card p-7 relative overflow-hidden">
              <div className="font-cormorant text-7xl text-primary/15 absolute top-2 left-4 leading-none pointer-events-none">"</div>
              <div className="flex gap-0.5 mb-4 relative z-10">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-primary text-primary" />)}
              </div>
              <p className="font-cormorant italic text-lg text-white/80 leading-relaxed mb-5 relative z-10">
                {cs.testimonial.text}
              </p>
              <div className="w-10 h-px bg-primary/40 mb-4" />
              <p className="font-cinzel text-[10px] tracking-[0.1em] text-primary">{cs.testimonial.author}</p>
              <p className="font-manrope text-[11px] text-white/45 mt-1">{cs.testimonial.role}</p>
            </div>

            {/* Tags */}
            <div className="glass-card p-6">
              <p className="font-cinzel text-[8px] tracking-[0.3em] text-white/35 uppercase mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {cs.tags.map(tag => (
                  <span key={tag} className="font-cinzel text-[7px] tracking-[0.2em] uppercase text-primary/70 border border-primary/25 px-2.5 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RELATED CASE STUDIES ── */}
      {related.length > 0 && (
        <section className="py-24 px-6 md:px-12 bg-[#0a0806] border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-cinzel text-[9px] tracking-[0.4em] text-primary/60 uppercase mb-3">Similar Events</p>
                <div className="gold-line w-12 mb-4" />
                <h2 className="font-cormorant text-4xl text-white font-light">
                  You may also <span className="text-primary italic font-semibold">love</span>
                </h2>
              </div>
              <Link href="/events" className="hidden md:flex items-center gap-2 font-cinzel text-[9px] tracking-[0.2em] uppercase text-primary hover:text-white transition-colors">
                All Events <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div ref={relatedRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(rel => (
                <Link key={rel.slug} href={`/events/${rel.slug}`}>
                  <div className="group relative overflow-hidden cursor-pointer h-[340px] luxury-card">
                    <img src={rel.coverImg} alt={rel.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h4 className="font-cormorant text-xl text-white font-semibold mb-1">{rel.title}</h4>
                      {rel.names && <p className="font-cormorant italic text-base text-primary/80 mb-2">{rel.names}</p>}
                      <span className="flex items-center gap-1 font-cinzel text-[8px] tracking-[0.2em] uppercase text-primary/70 group-hover:text-primary transition-colors">
                        View Case Study <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* Lightbox */}
      {lightbox && <LightboxImage src={lightbox} alt={cs.title} onClose={() => setLightbox(null)} />}
      <ConsultationModal isOpen={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
