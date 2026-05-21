import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useMeta } from "@/hooks/useMeta";
import { motion } from "framer-motion";

export default function CookiePolicy() {
  useMeta({
    title: "Cookie Policy | Book My Squad",
    description: "Book My Squad cookie policy describing analytics, functional, and preference cookies and how users can manage them.",
    keywords: "cookie policy, tracking cookies, analytics cookies, user preferences",
  });

  return (
    <div className="min-h-screen bg-[#050302] text-white font-sans">
      <Navbar />

      <main className="relative overflow-hidden pt-24 px-6 md:px-12 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,210,110,0.07),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,190,70,0.04),transparent_22%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-24 blur-3xl bg-gradient-to-r from-[#f7dc8d]/30 via-transparent to-[#f7dc8d]/10 pointer-events-none" />
            <p className="relative font-cinzel text-[10px] tracking-[0.4em] uppercase text-primary/70 mb-4">✦ Cookie Usage ✦</p>
          </div>
          <h1 className="relative font-cormorant text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight" style={{ textShadow: "0 0 32px rgba(255,205,95,0.14)" }}>
            Cookie Policy
          </h1>
          <p className="font-manrope text-white/70 max-w-2xl mx-auto mt-6 text-base md:text-lg leading-8">
            We use cookies thoughtfully to keep your visit smooth, private, and beautifully consistent.
          </p>
        </div>

        <motion.section
          className="relative z-10 mx-auto mt-16 max-w-3xl space-y-16 text-white/75"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative pt-10">
            <div className="absolute -top-4 left-1/2 w-24 h-px -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-90" />
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Essential Cookies</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight" style={{ textShadow: "0 0 20px rgba(255,205,95,0.12)" }}>
              Essential cookies keep the site connected.
            </h2>
            <p className="font-manrope text-base md:text-lg leading-8 text-white/70">
              They preserve your session, settings, and search preferences so the experience feels smooth and uninterrupted.
            </p>
          </div>

          <div className="relative pt-10">
            <div className="absolute -top-4 left-1/2 w-24 h-px -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-90" />
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Analytics</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight" style={{ textShadow: "0 0 20px rgba(255,205,95,0.12)" }}>
              Analytics help us refine the premium experience.
            </h2>
            <p className="font-manrope text-base md:text-lg leading-8 text-white/70">
              Anonymous data reveals what works best so we can make planning more beautiful for every couple.
            </p>
          </div>

          <div className="relative pt-10">
            <div className="absolute -top-4 left-1/2 w-24 h-px -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-90" />
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Third-Party Partners</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight" style={{ textShadow: "0 0 20px rgba(255,205,95,0.12)" }}>
              Trusted partners may also enhance the journey.
            </h2>
            <p className="font-manrope text-base md:text-lg leading-8 text-white/70">
              We work with a small set of providers for performance, messaging, and analytics on our platform.
            </p>
          </div>

          <div className="relative pt-10">
            <div className="absolute -top-4 left-1/2 w-24 h-px -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-90" />
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Browser Controls</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight" style={{ textShadow: "0 0 20px rgba(255,205,95,0.12)" }}>
              You remain in control of cookies.
            </h2>
            <p className="font-manrope text-base md:text-lg leading-8 text-white/70">
              You can disable non-essential cookies anytime. Essentials keep the site working beautifully.
            </p>
          </div>
        </motion.section>

        <div className="relative z-10 mx-auto mt-16 max-w-3xl border-t border-white/10 pt-12 text-center">
          <p className="font-cormorant text-sm uppercase tracking-[0.35em] text-[#d5b86e]/80">Contact Information</p>
          <p className="mt-4 font-manrope text-sm md:text-base leading-7 text-white/70">
            Questions about cookies? Email <a className="text-primary hover:text-[#ffe7a4] transition" href="mailto:support@bookmysquad.com">support@bookmysquad.com</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
