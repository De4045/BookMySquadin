import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useMeta } from "@/hooks/useMeta";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  useMeta({
    title: "Privacy Policy | Book My Squad",
    description: "Book My Squad privacy policy covering data collection, cookies, payment information, vendor handling, security, and communication preferences.",
    keywords: "privacy policy, data protection, wedding marketplace privacy, vendor privacy",
  });

  return (
    <div className="min-h-screen bg-[#050302] text-white font-sans">
      <Navbar />

      <main className="relative overflow-hidden pt-24 px-6 md:px-12 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,210,120,0.05),transparent_22%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-24 blur-3xl bg-gradient-to-r from-[#f7dc8d]/30 via-transparent to-[#f7dc8d]/10 pointer-events-none" />
            <p className="relative font-cinzel text-[10px] tracking-[0.4em] uppercase text-primary/70 mb-4">✦ Privacy & Trust ✦</p>
          </div>
          <h1 className="relative font-cormorant text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight" style={{ textShadow: "0 0 32px rgba(255,205,95,0.14)" }}>
            Privacy Policy
          </h1>
          <p className="font-manrope text-white/70 max-w-2xl mx-auto mt-6 text-base md:text-lg leading-8">
            We keep your data secure, private, and used only to make your celebration effortless.
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
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Data Protection</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight" style={{ textShadow: "0 0 20px rgba(255,205,95,0.12)" }}>
              Only essential details are collected.
            </h2>
            <p className="font-manrope text-base md:text-lg leading-8 text-white/70">
              We gather the information needed to personalize recommendations, confirm bookings, and keep your account safe.
            </p>
          </div>

          <div className="relative pt-10">
            <div className="absolute -top-4 left-1/2 w-24 h-px -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-90" />
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Cookies & Experience</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight" style={{ textShadow: "0 0 20px rgba(255,205,95,0.12)" }}>
              Cookies support a seamless journey.
            </h2>
            <p className="font-manrope text-base md:text-lg leading-8 text-white/70">
              We use cookies for site performance, session continuity, and tailored preferences without interrupting your planning flow.
            </p>
          </div>

          <div className="relative pt-10">
            <div className="absolute -top-4 left-1/2 w-24 h-px -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-90" />
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Account Security</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight" style={{ textShadow: "0 0 20px rgba(255,205,95,0.12)" }}>
              Your profile stays private and secure.
            </h2>
            <p className="font-manrope text-base md:text-lg leading-8 text-white/70">
              Account details are used only to manage bookings, introduce vendors, and offer premium support.
            </p>
          </div>

          <div className="relative pt-10">
            <div className="absolute -top-4 left-1/2 w-24 h-px -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-90" />
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Vendor Information</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight" style={{ textShadow: "0 0 20px rgba(255,205,95,0.12)" }}>
              Vendor details are shared with care.
            </h2>
            <p className="font-manrope text-base md:text-lg leading-8 text-white/70">
              We show only the essential vendor information needed to create a confident, curated planning experience.
            </p>
          </div>

          <div className="relative pt-10">
            <div className="absolute -top-4 left-1/2 w-24 h-px -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-90" />
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Need Assistance?</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight" style={{ textShadow: "0 0 20px rgba(255,205,95,0.12)" }}>
              Our team is ready to help.
            </h2>
            <p className="font-manrope text-base md:text-lg leading-8 text-white/70">
              For privacy questions, email <a className="text-primary hover:text-[#ffe7a4] transition" href="mailto:support@bookmysquad.com">support@bookmysquad.com</a>.
            </p>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
