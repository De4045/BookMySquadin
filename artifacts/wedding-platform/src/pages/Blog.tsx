import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, X, Clock, ChevronRight } from "lucide-react";

const POSTS = [
  {
    img: "https://images.unsplash.com/photo-1583396618422-c6cf3b31e30c?w=900&q=85",
    tag: "Bridal Fashion",
    title: "15 Stunning Lehenga Trends for 2026 Brides",
    time: "5 min read",
    excerpt: "From pastel pinks to deep burgundy, discover the hottest bridal lehenga styles dominating 2026 wedding seasons.",
    content: `This season's bridal silhouettes are bolder, richer, and more personal than ever. Here are the top 15 trends our editors are obsessing over:\n\n1. **Ombre Silk Lehengas** — gradient dyes transitioning from ivory to deep rose have swept every major bridal show this year.\n\n2. **Mirror-Work Revival** — intricate shisha embroidery from Gujarat is back, reimagined in contemporary cuts and neutral palettes.\n\n3. **Pastel Greens & Sage** — sage, mint, and pistachio are replacing the traditional reds for the modern minimalist bride.\n\n4. **3D Floral Appliqué** — hand-stitched dimensional florals add sculptural drama without heavy embroidery.\n\n5. **Cape Dupattas** — sheer capes replacing traditional dupattas for a fashion-forward look.\n\nBook your bridal consultation through our Makeup & Styling vendors to create your perfect look.`,
  },
  {
    img: "https://images.unsplash.com/photo-1554774853-719586f82d77?w=900&q=85",
    tag: "Planning",
    title: "How to Plan Your Wedding Budget Without Stress",
    time: "7 min read",
    excerpt: "A step-by-step guide to prioritising your wedding spend, from venue and catering to photography and florals.",
    content: `Planning a wedding budget doesn't have to be overwhelming. Here's a framework that works.\n\n**The 60/25/15 Rule**\n\n- 60% on the essentials: venue, catering, and bar\n- 25% on experience: photography, videography, entertainment\n- 15% on aesthetics: décor, florals, invitations\n\n**Start With Your Non-Negotiables**\n\nEvery couple has 2–3 things they care about most. Identify those first, allocate generously, then work backwards.\n\n**Book Early for Best Rates**\n\nMost premium vendors on our platform offer 10–15% discounts for bookings 12+ months in advance. Use our date filter to check availability today.\n\n**Build in a 10% Buffer**\n\nUnexpected costs always arise. Protect yourself with a contingency fund from the start.`,
  },
  {
    img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&q=85",
    tag: "Décor",
    title: "Minimalist Décor Ideas That Look Expensive",
    time: "4 min read",
    excerpt: "Less is more — learn how to create an ultra-luxe ambience with restrained, editorial-inspired décor choices.",
    content: `The most memorable weddings of the past two years have one thing in common: restraint.\n\n**Invest in Quality Over Quantity**\n\nFive statement flower arrangements from a premium florist will outlast fifty budget centrepieces every time.\n\n**The Power of Candlelight**\n\nBulk pillar candles and taper holders cost a fraction of florals and create warmth no spotlight can match.\n\n**Monochrome Palettes**\n\nChoose a single colour in three tones — light, mid, and dark — for a cohesive, editorial look.\n\n**Textural Linens**\n\nLinen, velvet, and silk charger plates transform even the simplest table setting into something special.`,
  },
  {
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=85",
    tag: "Venues",
    title: "Top 10 Destination Wedding Venues in India 2026",
    time: "6 min read",
    excerpt: "Palace hotels, hill-station retreats, and beachside resorts — India's most jaw-dropping wedding backdrops ranked.",
    content: `India has no shortage of spectacular backdrops. Our editors rank the top 10 for 2026:\n\n1. **Taj Lake Palace, Udaipur** — the undisputed queen of lake-palace weddings\n2. **Taj Falaknuma, Hyderabad** — a Nizam's palace overlooking the entire city\n3. **Neemrana Fort-Palace, Rajasthan** — 15th-century ramparts and dramatic scenery\n4. **IHCL Goa** — beachside luxury meets Goan warmth\n5. **Wildflower Hall, Shimla** — pine forests and Himalayan vistas\n6. **Rambagh Palace, Jaipur** — the maharaja's former residence\n7. **Leela Palace, Udaipur** — infinity pool overlooking Lake Pichola\n8. **ITC Grand Bharat, Gurugram** — 104 acres of pure luxury near Delhi\n9. **Taj Mahal Palace, Mumbai** — an iconic skyline setting\n10. **Taj Exotica, Maldives** — for those who want truly destination`,
  },
  {
    img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=900&q=85",
    tag: "Photography",
    title: "How to Choose the Perfect Wedding Photographer",
    time: "5 min read",
    excerpt: "Portfolio tips, pricing red flags, and the questions you must ask before signing any photography contract.",
    content: `Your wedding photographs will outlast everything else. Choose wisely.\n\n**Review Full Galleries, Not Highlights**\n\nAnyone can look great in a highlight reel. Ask to see complete galleries of 2–3 past weddings to assess consistency.\n\n**Match Editing Style**\n\nDark and moody, light and airy, true-to-life — know what you want before you book.\n\n**Questions to Ask**\n\n- How many hours are included? What's the overtime rate?\n- Do you have a second shooter?\n- What's the turnaround for edited photos?\n- What happens if you're ill on the day?\n\n**Red Flags**\n\n- Contracts with no cancellation clause\n- Pricing with no itemised breakdown\n- Photographers who won't show full galleries`,
  },
  {
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=85",
    tag: "Food & Catering",
    title: "2026 Wedding Menu Trends: From Live Stations to Dessert Bars",
    time: "4 min read",
    excerpt: "Couples are ditching the buffet for curated food journeys. Here's what's trending in Indian wedding menus.",
    content: `The wedding menu has evolved from a buffet line into an immersive culinary experience.\n\n**Live Chaat & Street Food Stations**\n\nGuests love interactive stations — pani puri, dahi puri, and live dosa counters are consistently the most photographed element of the night.\n\n**Regional Speciality Tables**\n\nDedicated tables celebrating the couple's home cuisines — Bengali fish curry alongside Punjabi chole — tell a cultural story.\n\n**Dessert Walls**\n\nInstagram-worthy dessert walls with 20+ Indian mithai options are replacing the traditional wedding cake.\n\n**Craft Mocktail Bars**\n\nCurated non-alcoholic cocktail bars with fresh ingredients and theatrical presentation are now a staple at premium weddings.`,
  },
];

export default function Blog() {
  const [openPost, setOpenPost] = useState<typeof POSTS[0] | null>(null);
  const [featured, ...rest] = POSTS;

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero */}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => setOpenPost(featured)}
              className="group cursor-pointer mb-16 grid grid-cols-1 lg:grid-cols-2 gap-0 luxury-card overflow-hidden hover:border-primary/40 transition-all duration-500"
            >
              <div className="relative h-72 lg:h-auto overflow-hidden">
                <img src={featured.img} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4">
                  <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-primary bg-black/60 border border-primary/30 px-2.5 py-1 backdrop-blur-sm">Cover Story</span>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="font-cinzel text-[10px] tracking-[0.3em] text-primary uppercase border border-primary/30 px-3 py-1 self-start mb-4">{featured.tag}</span>
                <h2 className="font-cormorant text-3xl md:text-4xl text-white font-medium mb-4 group-hover:text-primary transition-colors leading-snug">{featured.title}</h2>
                <p className="font-manrope text-white/55 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">
                    Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="flex items-center gap-1.5 text-white/30">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-manrope text-xs">{featured.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((post, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  onClick={() => setOpenPost(post)}
                  className="group cursor-pointer luxury-card overflow-hidden hover:border-primary/40 transition-all duration-500"
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
                    <p className="font-manrope text-xs text-white/50 leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-2 font-cinzel text-[9px] tracking-[0.2em] uppercase text-primary">
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

      {/* Article reader */}
      <AnimatePresence>
        {openPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpenPost(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 top-16 bg-[#0d0a07] z-50 overflow-y-auto rounded-t-2xl"
            >
              <div className="sticky top-0 bg-[#0d0a07]/95 backdrop-blur-xl border-b border-white/8 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <span className="font-cinzel text-[9px] tracking-[0.2em] text-primary uppercase border border-primary/30 px-2.5 py-1">{openPost.tag}</span>
                  <div className="flex items-center gap-1.5 text-white/30">
                    <Clock className="w-3 h-3" />
                    <span className="font-manrope text-xs">{openPost.time}</span>
                  </div>
                </div>
                <button onClick={() => setOpenPost(null)} className="w-9 h-9 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-w-3xl mx-auto px-6 py-10">
                <h1 className="font-cormorant text-4xl md:text-5xl text-white font-semibold leading-tight mb-6">{openPost.title}</h1>
                <div className="h-72 overflow-hidden mb-8 rounded-sm">
                  <img src={openPost.img} alt={openPost.title} className="w-full h-full object-cover" />
                </div>
                <p className="font-manrope text-white/60 text-base leading-relaxed mb-8 italic border-l-2 border-primary/40 pl-4">{openPost.excerpt}</p>
                <div className="prose prose-invert max-w-none">
                  {openPost.content.split("\n\n").map((para, i) => {
                    const formatted = para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                    if (para.startsWith("**") && para.endsWith("**")) {
                      return <h3 key={i} className="font-cormorant text-2xl text-primary font-semibold mt-8 mb-3" dangerouslySetInnerHTML={{ __html: formatted }} />;
                    }
                    return <p key={i} className="font-manrope text-white/65 text-base leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: formatted }} />;
                  })}
                </div>
                <div className="mt-12 pt-8 border-t border-white/8 flex items-center justify-between">
                  <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/60 uppercase">Book My Squad Editorial</p>
                  <button onClick={() => setOpenPost(null)} className="flex items-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-primary transition-colors">
                    Close <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
