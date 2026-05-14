import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Curated gallery — premium wedding & event images.
   All images: Unsplash free license, copyright-safe.
   All cards rendered at uniform aspect-[3/4] for perfect grid alignment.
───────────────────────────────────────────────────────────── */
const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=88",
    alt: "Royal palace Indian wedding — bride in elaborate red lehenga",
    tag: "Bridal",
  },
  {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=88",
    alt: "Heritage venue wedding ceremony with grand floral arch",
    tag: "Heritage",
  },
  {
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=900&q=88",
    alt: "Premium luxury wedding mandap with crystal chandeliers",
    tag: "Ceremony",
  },
  {
    src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=900&q=88",
    alt: "Mountain destination wedding with panoramic backdrop",
    tag: "Destination",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=88",
    alt: "Luxury floral event decor — roses and orchid centrepiece",
    tag: "Decor",
  },
  {
    src: "https://images.unsplash.com/photo-1554774853-719586f82d77?w=900&q=88",
    alt: "Elegant wedding reception hall with candlelit table settings",
    tag: "Reception",
  },
  {
    src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=88",
    alt: "Editorial bridal styling — high-fashion wedding look",
    tag: "Styling",
  },
  {
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=88",
    alt: "Bridal portrait — artistic wedding makeup close-up",
    tag: "Bridal",
  },
  {
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=88",
    alt: "Luxury five-star hotel wedding venue — pool and grounds",
    tag: "Venue",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=88",
    alt: "Premium farmhouse event venue — sprawling estate grounds",
    tag: "Farmhouse",
  },
  {
    src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=900&q=88",
    alt: "Live music and entertainment at wedding celebration",
    tag: "Entertainment",
  },
  {
    src: "https://images.unsplash.com/photo-1555244162-803834f70033?w=900&q=88",
    alt: "Premium wedding catering — gourmet food table spread",
    tag: "Catering",
  },
  {
    src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&q=88",
    alt: "Luxury resort wedding — overwater ceremony setup",
    tag: "Resort",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=88",
    alt: "Lush outdoor garden wedding ceremony aisle",
    tag: "Garden",
  },
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=88",
    alt: "Elegant wedding rings detail — platinum and diamond",
    tag: "Details",
  },
  {
    src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&q=88",
    alt: "Couple's first dance at wedding reception",
    tag: "Reception",
  },
  {
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=700&q=88",
    alt: "Bridal jewellery — intricate gold necklace and maang tikka",
    tag: "Jewellery",
  },
  {
    src: "https://images.unsplash.com/photo-1475695752828-7735b96bfcb3?w=900&q=88",
    alt: "Outdoor twilight wedding ceremony with fairy lights",
    tag: "Ceremony",
  },
];

const TAGS = ["All", ...Array.from(new Set(PHOTOS.map(p => p.tag)))];

export default function Photos() {
  const [activeTag, setActiveTag] = useState("All");
  const [lightbox, setLightbox]   = useState<number | null>(null);

  const filtered = activeTag === "All" ? PHOTOS : PHOTOS.filter(p => p.tag === activeTag);

  const prev = () => setLightbox(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null);
  const next = () => setLightbox(i => i !== null ? (i + 1) % filtered.length                   : null);

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">

        {/* ── Hero ── */}
        <section className="relative py-24 px-6 md:px-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06)_0%,transparent_65%)]" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative z-10"
          >
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Visual Stories ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h1 className="font-cormorant text-5xl md:text-7xl font-light mb-6">
              Wedding <span className="text-primary italic font-semibold">Photos</span>
            </h1>
            <p className="font-manrope text-white/60 text-base max-w-lg mx-auto mb-10">
              A curated gallery of extraordinary moments captured by India's finest wedding photographers.
            </p>

            {/* Category filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-1.5 border font-cinzel text-[9px] tracking-[0.2em] uppercase transition-all duration-200 ${
                    activeTag === tag
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 text-white/40 hover:border-primary/30 hover:text-primary/70"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Gallery grid ── */}
        <section className="pb-24 px-4 md:px-10">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeTag}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3"
              >
                {filtered.map((photo, i) => (
                  <motion.div
                    key={photo.src + i}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(i * 0.04, 0.28), duration: 0.35 }}
                    onClick={() => setLightbox(i)}
                    className="group cursor-pointer overflow-hidden relative aspect-[3/4]"
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-500" />

                    {/* Gold border shimmer on hover */}
                    <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 transition-colors duration-500" />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="font-cinzel text-[8px] tracking-[0.2em] uppercase text-primary bg-black/70 border border-primary/40 px-2 py-0.5 backdrop-blur-sm">
                        {photo.tag}
                      </span>
                    </div>

                    {/* Zoom icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 rounded-full bg-black/45 border border-white/30 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/96 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            {/* Prev */}
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center z-10"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            {/* Image */}
            <motion.img
              key={lightbox}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
              onClick={e => e.stopPropagation()}
              className="max-h-[85vh] max-w-[85vw] object-contain shadow-2xl"
            />

            {/* Next */}
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center z-10"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Footer bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <span className="font-cinzel text-[9px] tracking-[0.3em] text-primary uppercase">
                {filtered[lightbox].tag}
              </span>
              <span className="text-white/25 text-xs">·</span>
              <span className="font-manrope text-white/35 text-xs">
                {lightbox + 1} / {filtered.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
