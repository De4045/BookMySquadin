import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useMeta } from "@/hooks/useMeta";
import { motion } from "framer-motion";

export default function ContactUs() {
  useMeta({
    title: "Contact Us | Book My Squad",
    description: "Get in touch with Book My Squad for wedding planning support, vendor partnerships, and premium event assistance.",
    keywords: "contact, support, wedding planning, vendor partnership, customer support",
  });

  return (
    <div className="min-h-screen bg-[#050302] text-white font-sans">
      <Navbar />

      <main className="relative overflow-hidden pt-24 px-6 md:px-12 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,210,110,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,190,70,0.04),transparent_22%)]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="font-cinzel text-[10px] tracking-[0.4em] uppercase text-primary/70 mb-4">✦ Contact Us ✦</p>
          <h1 className="font-cormorant text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight" style={{ textShadow: "0 0 24px rgba(255,205,95,0.16)" }}>
            Get in Touch
          </h1>
          <p className="font-manrope text-white/70 max-w-2xl mx-auto mt-6 text-base md:text-lg leading-8">
            Whether you need help with booking, vendor discovery, or premium event planning, our team is ready to assist you.
          </p>
        </div>

        <motion.section
          className="relative z-10 mx-auto mt-16 max-w-4xl space-y-10 text-white/75"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-4 border-t border-white/10 pt-10">
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70">Customer Support</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight">Questions about the platform?</h2>
            <p className="font-manrope text-base leading-8 text-white/70">
              Email our support team at <a className="text-primary hover:text-[#ffe7a4] transition" href="mailto:support@bookmysquad.com">support@bookmysquad.com</a> for personalized assistance.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-10">
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70">Vendor Partnerships</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight">Want to list your services?</h2>
            <p className="font-manrope text-base leading-8 text-white/70">
              Connect with our partnerships team at <a className="text-primary hover:text-[#ffe7a4] transition" href="mailto:partnerships@bookmysquad.com">partnerships@bookmysquad.com</a> to join the curated marketplace.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-10">
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70">Book a Consultation</div>
            <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight">Let us help plan your celebration.</h2>
            <p className="font-manrope text-base leading-8 text-white/70">
              For tailored support, share your event details and we’ll connect you with premium planners, venues, and vendors matched to your needs.
            </p>
          </div>

          <div className="space-y-4 rounded-[1.75rem] border border-[#d5b86a]/10 bg-[#090704]/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70">Contact Details</div>
            <div className="space-y-4 text-white/70">
              <p className="font-manrope text-base leading-8">Email: <a className="text-primary hover:text-[#ffe7a4] transition" href="mailto:support@bookmysquad.com">support@bookmysquad.com</a></p>
              <p className="font-manrope text-base leading-8">Partnerships: <a className="text-primary hover:text-[#ffe7a4] transition" href="mailto:partnerships@bookmysquad.com">partnerships@bookmysquad.com</a></p>
              <p className="font-manrope text-base leading-8">Phone: <span className="text-white">+91 98877 66554</span></p>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
