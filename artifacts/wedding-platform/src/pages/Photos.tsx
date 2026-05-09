import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85", alt: "Royal palace wedding", tag: "Palace" },
  { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=85", alt: "Heritage Jaipur wedding", tag: "Heritage" },
  { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=85", alt: "Beach Goa wedding", tag: "Beach" },
  { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=900&q=85", alt: "Luxury Mumbai wedding", tag: "Luxury" },
  { src: "https://images.unsplash.com/photo-1583396618422-c6cf3b31e30c?w=900&q=85", alt: "Garden Delhi wedding", tag: "Garden" },
  { src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=900&q=85", alt: "Mountain Mussoorie wedding", tag: "Mountain" },
  { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=85", alt: "Floral decoration", tag: "Decor" },
  { src: "https://images.unsplash.com/photo-1554774853-719586f82d77?w=900&q=85", alt: "Wedding reception", tag: "Reception" },
  { src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&q=85", alt: "Elegant table setting", tag: "Styling" },
  { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=85", alt: "Bridal makeup", tag: "Bridal" },
  { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=85", alt: "Luxury hotel venue", tag: "Venue" },
  { src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=85", alt: "Outdoor garden venue", tag: "Venue" },
  { src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=85", alt: "Heritage farmhouse", tag: "Farmhouse" },
  { src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=900&q=85", alt: "Wedding entertainment", tag: "Entertainment" },
  { src: "https://images.unsplash.com/photo-1555244162-803834f70033?w=900&q=85", alt: "Wedding catering spread", tag: "Catering" },
  { src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&q=85", alt: "Resort wedding destination", tag: "Resort" },
];

const TAGS = ["All", ...Array.from(new Set(PHOTOS.map(p => p.tag)))];

export default function Photos() {
  const [activeTag, setActiveTag]   = useState("All");
  const [lightbox, setLightbox]     = useState<number | null>(null);

  const filtered = activeTag === "All" ? PHOTOS : PHOTOS.filter(p => p.tag === activeTag);

  const prev = () => setLightbox(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null);
  const next = () => setLightbox(i => i !== null ? (i + 1) % filtered.length : null);

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero */}
        <section className="relative py-24 px-6 md:px-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06)_0%,transparent_65%)]" />
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative z-10">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Visual Stories ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h1 className="font-cormorant text-5xl md:text-7xl font-light mb-6">
              Wedding <span className="text-primary italic font-semibold">Photos</span>
            </h1>
            <p className="font-manrope text-white/60 text-base max-w-lg mx-auto mb-10">
              A curated gallery of extraordinary moments captured by India's finest wedding photographers.
            </p>

            {/* Tag filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-1.5 rounded-sm border font-cinzel text-[9px] tracking-[0.2em] uppercase transition-all ${
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

        {/* Gallery grid */}
        <section className="pb-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeTag}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
              >
                {filtered.map((photo, i) => (
                  <motion.div
                    key={photo.src}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.4 }}
                    onClick={() => setLightbox(i)}
                    className={`group cursor-pointer overflow-hidden relative ${i % 5 === 0 ? "col-span-2 row-span-2" : ""}`}
                    style={{ aspectRatio: i % 5 === 0 ? "1/1" : i % 3 === 0 ? "3/4" : "4/3" }}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="font-cinzel text-[8px] tracking-[0.2em] uppercase text-primary bg-black/60 border border-primary/30 px-2 py-0.5 backdrop-blur-sm">
                        {photo.tag}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 rounded-full bg-black/40 border border-white/30 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center z-10"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <motion.img
              key={lightbox}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
              onClick={e => e.stopPropagation()}
              className="max-h-[85vh] max-w-[85vw] object-contain rounded-sm shadow-2xl"
            />

            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center z-10"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <span className="font-cinzel text-[9px] tracking-[0.3em] text-primary uppercase">{filtered[lightbox].tag}</span>
              <span className="text-white/30 text-xs font-manrope">{lightbox + 1} / {filtered.length}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
