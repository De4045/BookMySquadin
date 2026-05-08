import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";

const POSTS = [
  { img: "https://images.unsplash.com/photo-1583396618422-c6cf3b31e30c?w=800&q=80", tag: "Bridal Fashion", title: "15 Stunning Lehenga Trends for 2025 Brides", time: "5 min read", excerpt: "From pastel pinks to deep burgundy, discover the hottest bridal lehenga styles dominating 2025 wedding seasons." },
  { img: "https://images.unsplash.com/photo-1554774853-719586f82d77?w=800&q=80", tag: "Planning", title: "How to Plan Your Wedding Budget Without Stress", time: "7 min read", excerpt: "A step-by-step guide to prioritising your wedding spend, from venue and catering to photography and florals." },
  { img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80", tag: "Decor", title: "Minimalist Decor Ideas That Look Expensive", time: "4 min read", excerpt: "Less is more — learn how to create an ultra-luxe ambience with restrained, editorial-inspired décor choices." },
  { img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80", tag: "Venues", title: "Top 10 Destination Wedding Venues in India 2025", time: "6 min read", excerpt: "Palace hotels, hill-station retreats, and beachside resorts — India's most jaw-dropping wedding backdrops ranked." },
  { img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80", tag: "Photography", title: "How to Choose the Perfect Wedding Photographer", time: "5 min read", excerpt: "Portfolio tips, pricing red flags, and the questions you must ask before signing any photography contract." },
  { img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80", tag: "Food & Catering", title: "2025 Wedding Menu Trends: From Live Stations to Dessert Bars", time: "4 min read", excerpt: "Couples are ditching the buffet for curated food journeys. Here's what's trending in Indian wedding menus." },
];

export default function Blog() {
  const [featured, ...rest] = POSTS;
  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <section className="relative py-24 px-6 md:px-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06)_0%,transparent_65%)]" />
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative z-10">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ The Editorial ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h1 className="font-cormorant text-5xl md:text-7xl font-light mb-6">
              Wedding <span className="text-primary italic font-semibold">Magazine</span>
            </h1>
            <p className="font-manrope text-white/60 text-base max-w-lg mx-auto">
              Expert advice, trend reports and real-wedding inspiration — curated for the modern couple.
            </p>
          </motion.div>
        </section>

        <section className="py-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Featured */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="group cursor-pointer mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 luxury-card overflow-hidden"
            >
              <div className="relative h-72 lg:h-auto overflow-hidden">
                <img src={featured.img} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="font-cinzel text-[10px] tracking-[0.3em] text-primary uppercase border border-primary/30 px-3 py-1 self-start mb-4">{featured.tag}</span>
                <h2 className="font-cormorant text-3xl md:text-4xl text-white font-medium mb-4 group-hover:text-primary transition-colors leading-snug">{featured.title}</h2>
                <p className="font-manrope text-white/55 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">
                  Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((post, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer luxury-card overflow-hidden"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-cinzel text-[9px] tracking-[0.2em] text-primary uppercase">{post.tag}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="font-manrope text-[10px] text-white/40">{post.time}</span>
                    </div>
                    <h3 className="font-cormorant text-xl text-white font-medium group-hover:text-primary transition-colors leading-snug mb-3">{post.title}</h3>
                    <p className="font-manrope text-xs text-white/50 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-4 font-cinzel text-[9px] tracking-[0.2em] uppercase text-primary">
                      Read More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
