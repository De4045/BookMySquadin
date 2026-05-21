import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useMeta } from "@/hooks/useMeta";
import { motion } from "framer-motion";

export default function RefundPolicy() {
  useMeta({
    title: "Refund Policy | Book My Squad",
    description: "Read Book My Squad refund policy for booking cancellations, vendor refunds, and marketplace terms.",
    keywords: "refund policy, cancellation, booking refund, vendor refund, marketplace terms",
  });

  return (
    <div className="min-h-screen bg-[#050302] text-white font-sans">
      <Navbar />

      <main className="relative overflow-hidden pt-24 px-6 md:px-12 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,210,110,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,190,70,0.04),transparent_22%)]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="font-cinzel text-[10px] tracking-[0.4em] uppercase text-primary/70 mb-4">✦ Refund Policy ✦</p>
          <h1 className="font-cormorant text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight" style={{ textShadow: "0 0 24px rgba(255,205,95,0.16)" }}>
            Refund Policy
          </h1>
          <p className="font-manrope text-white/70 max-w-2xl mx-auto mt-6 text-base md:text-lg leading-8">
            Our refund policy explains how cancellations are managed and what customers should expect from bookings made through Book My Squad.
          </p>
        </div>

        <motion.section
          className="relative z-10 mx-auto mt-16 max-w-4xl space-y-12 text-white/75"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-4 border-t border-white/10 pt-10">
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70">Policy Scope</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight">Marketplace refund guidance.</h2>
            <p className="font-manrope text-base leading-8 text-white/70">
              Book My Squad is a discovery and booking platform. Refunds are governed by the vendor’s cancellation terms, and we help you understand how those policies apply.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-10">
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70">Vendor Refunds</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight">Vendor refund terms apply.</h2>
            <p className="font-manrope text-base leading-8 text-white/70">
              Each vendor sets their own refund, cancellation, and rescheduling policy. Always review vendor-specific terms before booking to avoid surprises.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-10">
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70">Booking Cancellations</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight">Cancellation requests are handled by the vendor.</h2>
            <p className="font-manrope text-base leading-8 text-white/70">
              If you need to cancel, contact the vendor directly and follow their published cancellation process. We can assist by sharing booking details and communication history.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-10">
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70">Support Assistance</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight">We support communication and dispute resolution.</h2>
            <p className="font-manrope text-base leading-8 text-white/70">
              If you experience issues with a vendor refund, reach out to our support team for help coordinating the next steps.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-10">
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70">Contact Details</div>
            <p className="font-manrope text-base leading-8 text-white/70">
              Email <a className="text-primary hover:text-[#ffe7a4] transition" href="mailto:support@bookmysquad.com">support@bookmysquad.com</a> and share your booking reference for faster support.
            </p>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
