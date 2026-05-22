import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Careers() {
  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        <section className="relative py-20 px-6 md:px-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative z-10">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ CAREERS ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h1 className="font-cormorant text-4xl md:text-6xl font-light mb-6">Join the Team Behind Modern Celebrations</h1>
            <p className="font-manrope text-white/60 text-base max-w-3xl mx-auto leading-relaxed">Help create premium digital experiences inspired by luxury hospitality, events, and curated celebrations. We’re shaping a creative event ecosystem that blends event technology, premium branding, and storytelling for unforgettable moments.</p>
          </motion.div>
        </section>

        <section className="max-w-5xl mx-auto px-6 md:px-12 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/3 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/6">
              <h3 className="font-cormorant text-xl text-white mb-3">OPEN ROLES</h3>
              <ul className="list-inside space-y-2 text-white/70">
                <li>UI/UX Designer</li>
                <li>Frontend Developer</li>
                <li>Content & Editorial Writer</li>
                <li>Event Partnerships Executive</li>
                <li>Social Media & Branding</li>
                <li>SEO & Marketing Specialist</li>
              </ul>
            </div>

            <div className="bg-white/3 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/6">
              <h3 className="font-cormorant text-xl text-white mb-3">WHY WORK WITH US</h3>
              <ul className="text-white/70 list-inside space-y-2">
                <li>Creative luxury events industry environment</li>
                <li>Hospitality and premium celebration experiences</li>
                <li>Event technology and brand storytelling</li>
                <li>Curated celebration culture and editorial impact</li>
                <li>Real-world exposure to luxury event ecosystems</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="font-cormorant text-2xl text-white mb-3">INTERNSHIPS</h3>
            <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">We welcome students and fresh creatives interested in web design, event tech, content creation, branding, and frontend development.</p>

            <div className="mt-8">
              <p className="text-white/70">Apply with your portfolio or resume to:</p>
              <a href="mailto:careers@bookmysquad.com" className="mt-3 inline-block font-cinzel text-[11px] text-primary border border-primary/30 px-5 py-3 rounded-full hover:bg-primary/10 transition-colors">careers@bookmysquad.com</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
