import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const PHOTOS = [
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80",
  "https://images.unsplash.com/photo-1583396618422-c6cf3b31e30c?w=800&q=80",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  "https://images.unsplash.com/photo-1554774853-719586f82d77?w=800&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
];

export default function Photos() {
  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <section className="relative py-24 px-6 md:px-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06)_0%,transparent_65%)]" />
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative z-10">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Visual Stories ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h1 className="font-cormorant text-5xl md:text-7xl font-light mb-6">
              Wedding <span className="text-primary italic font-semibold">Photos</span>
            </h1>
            <p className="font-manrope text-white/60 text-base max-w-lg mx-auto">
              A curated gallery of extraordinary moments captured by India's finest wedding photographers.
            </p>
          </motion.div>
        </section>

        <section className="pb-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {PHOTOS.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="break-inside-avoid group cursor-pointer overflow-hidden luxury-card"
              >
                <img
                  src={src}
                  alt={`Wedding photo ${i + 1}`}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ aspectRatio: i % 3 === 0 ? "3/4" : "4/3" }}
                />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
