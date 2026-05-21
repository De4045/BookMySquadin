import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useMeta } from "@/hooks/useMeta";
import { motion } from "framer-motion";

export default function TermsOfService() {
  useMeta({
    title: "Terms & Conditions | Book My Squad",
    description: "Book My Squad terms and conditions covering vendor responsibilities, bookings, payment terms, cancellations, and dispute handling.",
    keywords: "terms and conditions, wedding marketplace terms, booking policy, vendor obligations",
  });

  return (
    <div className="min-h-screen bg-[#050302] text-white font-sans">
      <Navbar />

      <main className="relative overflow-hidden pt-24 px-6 md:px-12 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,212,105,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,200,80,0.04),transparent_22%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-24 blur-3xl bg-gradient-to-r from-[#f7dc8d]/30 via-transparent to-[#f7dc8d]/10 pointer-events-none" />
            <p className="relative font-cinzel text-[10px] tracking-[0.4em] uppercase text-primary/70 mb-4">✦ Terms & Conditions ✦</p>
          </div>
          <h1 className="relative font-cormorant text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight" style={{ textShadow: "0 0 32px rgba(255,205,95,0.14)" }}>
            Terms & Conditions
          </h1>
          <p className="font-manrope text-white/70 max-w-2xl mx-auto mt-6 text-base md:text-lg leading-8">
            Clear guidelines for vendors and customers within our premium marketplace.
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
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Vendor Standards</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight" style={{ textShadow: "0 0 20px rgba(255,205,95,0.12)" }}>
              Vendors present polished, accurate listings.
            </h2>
            <p className="font-manrope text-base md:text-lg leading-8 text-white/70">
              Vendors keep their profiles current so your event planning stays elegant and reliable.
            </p>
          </div>

          <div className="relative pt-10">
            <div className="absolute -top-4 left-1/2 w-24 h-px -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-90" />
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Booking Clarity</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight" style={{ textShadow: "0 0 20px rgba(255,205,95,0.12)" }}>
              Bookings are confirmed by vendors.
            </h2>
            <p className="font-manrope text-base md:text-lg leading-8 text-white/70">
              We connect you with curated vendors, while confirmations and terms remain directly between you and the provider.
            </p>
          </div>

          <div className="relative pt-10">
            <div className="absolute -top-4 left-1/2 w-24 h-px -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-90" />
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Platform Role</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight" style={{ textShadow: "0 0 20px rgba(255,205,95,0.12)" }}>
              We support the journey, not deliver the service.
            </h2>
            <p className="font-manrope text-base md:text-lg leading-8 text-white/70">
              Our marketplace is designed to make discovery effortless, while vendors remain responsible for service delivery.
            </p>
          </div>

          <div className="relative pt-10">
            <div className="absolute -top-4 left-1/2 w-24 h-px -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-90" />
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Support Assistance</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight" style={{ textShadow: "0 0 20px rgba(255,205,95,0.12)" }}>
              Questions are welcome at any time.
            </h2>
            <p className="font-manrope text-base md:text-lg leading-8 text-white/70">
              For support, email <a className="text-primary hover:text-[#ffe7a4] transition" href="mailto:support@bookmysquad.com">support@bookmysquad.com</a>.
            </p>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
