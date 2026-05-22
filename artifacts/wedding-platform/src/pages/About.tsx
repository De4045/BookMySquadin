import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* HERO */}
        <section className="relative py-20 px-6 md:px-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative z-10">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ ABOUT BOOK MY SQUAD ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h1 className="font-cormorant text-4xl md:text-6xl lg:text-7xl font-light mb-6">
              Crafting <span className="text-primary italic font-semibold">Elegant Celebrations & Premium Experiences</span>
            </h1>
            <p className="font-manrope text-white/60 text-base max-w-3xl mx-auto leading-relaxed">
              Book My Squad is a luxury event discovery and planning platform designed for unforgettable celebrations, destination experiences, and premium social events. We serve weddings, corporate gatherings, private celebrations, destination experiences, and curated event journeys across India.
            </p>
          </motion.div>
        </section>

        <section className="max-w-6xl mx-auto px-6 md:px-12 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80",
                alt: "Luxury gala event with elegant table settings and warm lighting",
                label: "Gala Evenings",
              },
              {
                src: "https://images.unsplash.com/photo-1526481280690-3bfa7568d4f4?w=900&q=80",
                alt: "Premium rooftop celebration with city skyline and golden light",
                label: "Rooftop Celebrations",
              },
              {
                src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80",
                alt: "Destination event near water with cinematic hospitality experience",
                label: "Destination Experiences",
              },
            ].map((item) => (
              <div key={item.label} className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-black/20 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                <img src={item.src} alt={item.alt} className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 text-left">
                  <p className="font-cinzel text-[9px] tracking-[0.35em] uppercase text-primary/80 mb-2">{item.label}</p>
                  <p className="text-white text-2xl font-cormorant">Premium ambiance</p>
                </div>
              </div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="prose prose-invert mx-auto text-center">
            <h2 className="font-cormorant text-2xl md:text-3xl font-medium mb-2">WHY BOOK MY SQUAD</h2>
            <p className="text-white/70">Curated premium venues & vendors · Elegant luxury event experiences · Destination event inspirations · Verified hospitality professionals · Modern planning tools & support · Editorial celebration discovery</p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/3 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/6">
              <h3 className="font-cormorant text-xl text-white mb-3">OUR VISION</h3>
              <p className="text-white/70 leading-relaxed">To redefine event planning through luxury hospitality, cinematic storytelling, and thoughtfully curated celebration journeys.</p>
            </div>

            <div className="bg-white/3 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/6">
              <h3 className="font-cormorant text-xl text-white mb-3">WHAT WE OFFER</h3>
              <ul className="list-inside space-y-2 text-white/70">
                <li>Luxury weddings, private celebrations, and corporate events</li>
                <li>Destination experiences and hospitality collaborations</li>
                <li>Photographers, filmmakers, and event creatives</li>
                <li>Decor, floral styling, and curated event design</li>
                <li>Entertainment, DJs, and premium venue experiences</li>
                <li>Destination inspiration and premium social gatherings</li>
                <li>Event tools, planning guidance, and editorial discovery</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="font-manrope text-white/70 max-w-2xl mx-auto leading-relaxed">We combine cinematic aesthetics, curated recommendations, and seamless event planning to make every celebration feel effortless, extraordinary, and unmistakably luxurious.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
