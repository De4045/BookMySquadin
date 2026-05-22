import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useMeta } from "@/hooks/useMeta";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EDITORIAL_ARTICLES } from "@/data/the-edit-articles";

const NEWS_CATEGORIES = [
  "Wedding Trends",
  "Luxury Venues",
  "Bridal Inspirations",
  "Destination Weddings",
  "Event Styling",
  "Celebrity Celebrations",
  "Photography Stories",
  "Décor & Floral Design",
  "Planning Guides",
];

export default function TheEdit() {
  useMeta({
    title: "The Edit",
    description: "Luxury wedding stories, editorial inspiration, and premium celebration curation from Book My Squad.",
    keywords: "luxury weddings, editorial, destination weddings, wedding trends, Indian weddings",
  });

  const featured = EDITORIAL_ARTICLES[0];

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="relative overflow-hidden py-32 px-6 md:px-12 text-center">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1800&q=80"
              alt="Luxury editorial wedding hero"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.14),transparent_45%)]" />
          </div>
          <div className="relative mx-auto max-w-5xl">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="font-cinzel text-[11px] tracking-[0.35em] uppercase text-primary/70 mb-6"
            >
              ✦ LATEST STORIES ✦
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.02] tracking-[-0.03em] text-white max-w-4xl mx-auto"
              style={{ textShadow: '0 0 36px rgba(212,175,55,0.17)' }}
            >
              Inside India’s Most Elegant Celebrations
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="font-manrope text-[18px] sm:text-[19px] md:text-[20px] text-white/70 max-w-3xl mx-auto mt-6 leading-[1.85]"
            >
              Explore destination weddings, luxury venues, bridal inspirations, event trends, décor ideas, celebrity celebrations, and curated stories crafted for modern celebrations.
            </motion.p>
          </div>
        </section>

        <section className="relative overflow-hidden px-6 md:px-12 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.06),transparent_55%)] pointer-events-none" />
          <div className="relative mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#090705] shadow-[0_48px_110px_rgba(0,0,0,0.38)] transition-transform duration-500 hover:-translate-y-1.5"
            >
              <div className="relative h-[520px] sm:h-[520px] overflow-hidden">
                <img
                  src={featured.heroImage}
                  alt="Featured editorial story"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.14),transparent_30%)] opacity-70" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-black/95 via-black/25 to-transparent">
                  <span className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-primary/80 mb-4 inline-block">Featured Story</span>
                  <h2 className="font-cormorant text-5xl sm:text-6xl lg:text-7xl text-white font-semibold leading-tight mb-6" style={{ textShadow: '0 0 48px rgba(212,175,55,0.22)' }}>
                    {featured.title}
                  </h2>
                  <p className="font-manrope text-[21px] sm:text-[22px] text-white/75 max-w-2xl leading-[1.9] mb-8">
                    {featured.subtitle}
                  </p>
                  <Link
                    href={`/the-edit/${featured.slug}`}
                    className="inline-flex items-center gap-2 mt-8 font-cinzel text-[12px] tracking-[0.25em] uppercase text-primary hover:text-white transition-all duration-300"
                  >
                    READ STORY
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="flow-root rounded-[32px] border border-white/10 bg-black/40 p-8 shadow-[0_48px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            >
              <div className="relative z-10">
                <div className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-6">A cinematic editorial moment</div>
                <h3 className="font-cormorant text-4xl lg:text-5xl text-white font-semibold leading-tight mb-8">
                  Stories that feel like a destination feature, not a collection of headlines.
                </h3>
                <p className="font-manrope text-[18px] sm:text-[20px] text-white/65 leading-[1.9] mb-12">
                  Rich storytelling, premium details, and elegant pacing make every article feel like the next chapter in a luxury wedding journal.
                </p>
                <div className="space-y-5">
                  {[
                    "Royal palace ceremonies",
                    "Cinematic décor narratives",
                    "Boutique destination escapes",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-4">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                      <p className="font-manrope text-[17px] sm:text-[18px] text-white/70 leading-[1.8]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6 md:px-12 py-24">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="overflow-x-auto no-scrollbar py-4"
            >
              <div className="inline-flex items-center gap-4 min-w-[900px] md:min-w-[720px] lg:min-w-0">
                {NEWS_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className="rounded-full border border-white/10 bg-black/40 px-5 py-3 text-xs font-cinzel uppercase tracking-[0.32em] text-primary/80 transition duration-200 hover:text-white hover:border-primary/40 hover:shadow-[0_0_40px_rgba(212,175,55,0.12)]"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6 md:px-12 py-24">
          <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {EDITORIAL_ARTICLES.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.08 * index }}
                className="group overflow-hidden rounded-[32px] border border-white/10 bg-[#090705] shadow-[0_35px_80px_rgba(0,0,0,0.28)] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1.5 hover:shadow-[0_35px_90px_rgba(212,175,55,0.18)]"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={post.cardImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.10),transparent_35%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <span className="absolute top-5 left-5 inline-flex items-center rounded-full border border-primary/25 bg-black/50 px-3 py-2 text-[10px] font-cinzel uppercase tracking-[0.24em] text-primary backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>

                <div className="p-7 pb-8">
                  <div className="flex flex-wrap items-center gap-3 text-[12px] sm:text-[13px] uppercase tracking-[0.26em] text-white/50 mb-5">
                    <span>{post.date}</span>
                    <span className="h-px w-6 bg-white/10" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-cormorant text-2xl sm:text-3xl text-white font-semibold leading-tight mb-5">
                    {post.title}
                  </h3>
                  <p className="font-manrope text-[18px] leading-[1.8] text-white/70 mb-8">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/the-edit/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-cinzel text-primary hover:text-white transition-colors"
                  >
                    <span>READ STORY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="relative px-6 md:px-12 py-24">
          <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-black/40 p-12 text-center shadow-[0_40px_120px_rgba(0,0,0,0.33)] backdrop-blur-xl overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_50%)]" />
            <div className="relative z-10">
              <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">
                Create Celebrations Worth Remembering
              </p>
              <h2 className="font-cormorant text-4xl sm:text-5xl font-semibold text-white leading-tight mb-6">
                Discover curated venues, verified vendors, and luxury event experiences crafted for unforgettable moments.
              </h2>
              <p className="font-manrope text-[18px] sm:text-[19px] text-white/65 leading-[1.85] mb-10">
                Every detail is shaped to feel editorial, cinematic and wholly unforgettable — from first enquiry to the moment your celebration begins.
              </p>
              <Link
                href="/venues"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-primary/40 bg-black/80 px-8 py-3 text-[11px] font-cinzel uppercase tracking-[0.28em] text-primary transition duration-300 hover:bg-primary/10"
              >
                EXPLORE VENUES →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
