import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Press() {
  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        <section className="relative py-20 px-6 md:px-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative z-10">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ PRESS & MEDIA ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h1 className="font-cormorant text-4xl md:text-6xl font-light mb-6">Stories From the World of Luxury Celebrations</h1>
            <p className="font-manrope text-white/60 text-base max-w-3xl mx-auto leading-relaxed">Explore curated stories, collaborations, event insights, hospitality experiences, and premium celebration trends from the heart of modern event culture.</p>
          </motion.div>
        </section>

        <section className="max-w-6xl mx-auto px-6 md:px-12 pb-20">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h3 className="font-cormorant text-2xl text-white mb-4">MEDIA HIGHLIGHTS</h3>
            <ul className="text-white/70 list-inside space-y-2 mb-8">
              <li>Luxury event trends and inspiration</li>
              <li>Hospitality collaborations and brand stories</li>
              <li>Destination celebration experiences</li>
              <li>Premium lifestyle and event culture coverage</li>
              <li>Editorial celebration storytelling</li>
              <li>Platform updates and industry insights</li>
            </ul>

            <h3 className="font-cormorant text-2xl text-white mb-4">BRAND COLLABORATIONS</h3>
            <p className="text-white/70 mb-6">Book My Squad collaborates with luxury venues, hospitality brands, event creators, photographers, corporate partners, and lifestyle media platforms.</p>

            <h3 className="font-cormorant text-2xl text-white mb-4">PRESS ENQUIRIES</h3>
            <p className="text-white/70 mb-2">For media requests, collaborations, or brand partnerships:</p>
            <p className="text-white/80 font-medium">press@bookmysquad.com</p>
            <p className="text-white/80 font-medium">business@bookmysquad.com</p>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
