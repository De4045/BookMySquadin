import { motion } from "framer-motion";
import { Link, useRoute } from "wouter";
import { ArrowRight } from "lucide-react";
import { useMeta } from "@/hooks/useMeta";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EDITORIAL_ARTICLES, getEditorialArticle } from "@/data/the-edit-articles";

export default function TheEditArticle() {
  const [match, params] = useRoute("/the-edit/:slug");
  const article = params ? getEditorialArticle(params.slug) : null;

  useMeta({
    title: article ? article.title : "The Edit",
    description: article ? article.subtitle : "Luxury wedding editorial stories from Book My Squad.",
    keywords: "luxury weddings, editorial article, destination weddings, Indian weddings",
  });

  if (!article) {
    return (
      <div className="min-h-screen bg-[#080604] text-white font-sans">
        <Navbar />
        <main className="pt-28 px-6 md:px-12">
          <div className="max-w-3xl mx-auto py-24 text-center">
            <p className="font-cinzel text-[10px] uppercase tracking-[0.4em] text-primary/70 mb-5">The Edit</p>
            <h1 className="font-cormorant text-5xl text-white font-semibold mb-6">Article Not Found</h1>
            <p className="font-manrope text-base text-white/60 mb-8">The story you are looking for is not available. Return to the editorial collection to discover premium wedding inspiration.</p>
            <Link href="/the-edit" className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary text-sm uppercase tracking-[0.25em] rounded-full transition hover:bg-white/5">
              Back to The Edit
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedArticles = EDITORIAL_ARTICLES.filter((item) => article.relatedSlugs.includes(item.slug)).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="relative overflow-hidden pt-32">
          <div className="absolute inset-0">
            <img
              src={article.heroImage}
              alt={article.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/70 to-black/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.14),transparent_40%)] opacity-60" />
          </div>
          <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12 py-32 text-center">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4 inline-block">{article.category}</span>
            <div className="text-white/60 text-[15px] sm:text-[16px] uppercase tracking-[0.24em] mb-4">Published {article.date} · {article.readTime}</div>
            <h1 className="font-cormorant text-6xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold leading-[1.02] mb-6" style={{ textShadow: '0 0 52px rgba(212,175,55,0.18)' }}>
              {article.title}
            </h1>
            <p className="font-manrope text-[22px] sm:text-[24px] md:text-[26px] text-white/75 max-w-3xl mx-auto leading-[1.95]">
              {article.subtitle}
            </p>
          </div>
        </section>

        <section className="px-6 md:px-12 py-24">
          <div className="max-w-7xl mx-auto grid gap-14 lg:grid-cols-[1.6fr_0.9fr] items-start">
            <div className="space-y-14">
              {article.content.map((section) => (
                <motion.div
                  key={section.heading}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7 }}
                  className="space-y-5"
                >
                  <h2 className="font-cormorant text-3xl sm:text-4xl text-white font-semibold tracking-[-0.03em] leading-tight">
                    {section.heading}
                  </h2>
                  <p className="font-manrope text-[20px] sm:text-[22px] leading-[2] text-white/70 max-w-4xl">
                    {section.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <aside className="rounded-[32px] border border-white/10 bg-black/50 p-10 shadow-[0_35px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-5">Quick Highlights</p>
              <div className="space-y-4">
                {article.highlights.map((highlight) => (
                  <div key={highlight} className="rounded-3xl border border-white/10 bg-[#090705] p-4">
                    <p className="font-cormorant text-[18px] sm:text-[19px] text-white leading-relaxed">{highlight}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="px-6 md:px-12 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 mb-10">
              <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70">Image Gallery</p>
              <h2 className="font-cormorant text-3xl sm:text-4xl text-white font-semibold">Cinematic wedding visuals</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {article.gallery.map((src) => (
                <div key={src} className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/30 shadow-[0_30px_70px_rgba(0,0,0,0.24)] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-[0_35px_80px_rgba(212,175,55,0.16)]">
                  <img
                    src={src}
                    alt={article.title}
                    className="w-full h-80 object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 md:px-12 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-2">Related Stories</p>
                <h2 className="font-cormorant text-3xl text-white font-semibold">More luxury editorial stories</h2>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {relatedArticles.map((item) => (
                <Link key={item.slug} href={`/the-edit/${item.slug}`} className="group block overflow-hidden rounded-[28px] border border-white/10 bg-[#090705] shadow-[0_30px_70px_rgba(0,0,0,0.24)] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1.5 hover:shadow-[0_35px_80px_rgba(212,175,55,0.16)]">
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={item.cardImage}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  <div className="p-6">
                    <p className="font-cinzel text-[9px] uppercase tracking-[0.35em] text-primary/70 mb-3">{item.category}</p>
                    <h3 className="font-cormorant text-2xl text-white font-semibold leading-tight mb-3">{item.title}</h3>
                    <p className="font-manrope text-[17px] sm:text-[18px] text-white/60 leading-relaxed">{item.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative px-6 md:px-12 py-20">
          <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-black/40 p-12 text-center shadow-[0_40px_120px_rgba(0,0,0,0.33)] backdrop-blur-xl overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_50%)]" />
            <div className="relative z-10">
              <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Create Your Own Luxury Celebration</p>
              <h2 className="font-cormorant text-4xl sm:text-5xl font-semibold text-white leading-tight mb-6">Discover curated venues, premium vendors, and unforgettable wedding experiences.</h2>
              <p className="font-manrope text-[20px] sm:text-[22px] text-white/65 leading-[1.8] mb-10">Craft your celebration with the same editorial luxury and premium storytelling that inspires every article on The Edit.</p>
              <Link href="/venues" className="inline-flex items-center justify-center gap-3 rounded-full border border-primary/40 bg-black/80 px-8 py-3 text-[11px] font-cinzel uppercase tracking-[0.28em] text-primary transition duration-300 hover:bg-primary/10">
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
