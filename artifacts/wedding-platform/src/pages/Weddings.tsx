import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Heart, ArrowRight, Camera, Users, Star } from "lucide-react";
import { Link } from "wouter";

const WEDDINGS = [
  { img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80", title: "Royal Rajasthani", names: "Priya & Rahul", city: "Udaipur", style: "Palace", guests: "800+", desc: "A regal palace wedding filled with marigold mandaps, grand baraat and royal Rajasthani traditions.", tags: ["Palace", "Heritage", "Traditional"] },
  { img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80", title: "Pink City Magic", names: "Ananya & Vikram", city: "Jaipur", style: "Heritage", guests: "600", desc: "Rustic havelis, folk music, and a timeless desert sunset ceremony with intricate floral décor.", tags: ["Heritage", "Folk", "Sunset"] },
  { img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80", title: "Beach Boho", names: "Neha & Arjun", city: "Goa", style: "Beach", guests: "200", desc: "Barefoot on golden sands with florals, fairy lights and ocean waves setting the mood.", tags: ["Beach", "Boho", "Intimate"] },
  { img: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80", title: "Modern Luxury", names: "Shriya & Karan", city: "Mumbai", style: "Contemporary", guests: "500", desc: "A skyline venue draped in ivory and champagne — the epitome of cosmopolitan chic.", tags: ["Luxury", "Modern", "City"] },
  { img: "https://images.unsplash.com/photo-1583396618422-c6cf3b31e30c?w=800&q=80", title: "Heritage Garden", names: "Pooja & Rohan", city: "Delhi", style: "Garden", guests: "400", desc: "Lush greens and heritage architecture turned into a sprawling floral dreamscape.", tags: ["Garden", "Heritage", "Floral"] },
  { img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80", title: "Mountain Serenity", names: "Aisha & Dev", city: "Mussoorie", style: "Mountain", guests: "150", desc: "Mist-wrapped mountains and pine forests created nature's own altar for this intimate ceremony.", tags: ["Mountain", "Intimate", "Nature"] },
];

const STYLES = [
  { name: "Palace & Heritage", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", count: "48 weddings" },
  { name: "Beach & Destination", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80", count: "36 weddings" },
  { name: "Modern Luxury", img: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&q=80", count: "72 weddings" },
  { name: "Garden & Outdoor", img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80", count: "54 weddings" },
];

const TESTIMONIALS = [
  { text: "Book My Squad made our dream Udaipur wedding a breathtaking reality. Every detail was impeccable.", name: "Priya & Rahul", location: "Udaipur" },
  { text: "We found our perfect photographer and decorator through BMS within a week. Absolutely seamless!", name: "Ananya & Vikram", location: "Jaipur" },
  { text: "The beach wedding in Goa was intimate and magical — exactly what we envisioned.", name: "Neha & Arjun", location: "Goa" },
];

const TIMELINE = [
  { time: "12 Months Before", title: "Set Your Vision & Budget", desc: "Define your wedding style, guest count, and overall budget. Start exploring venues on BMS." },
  { time: "9 Months Before", title: "Book Venue & Planner", desc: "Lock in your dream venue and hire a wedding planner. Popular dates book fast!" },
  { time: "6 Months Before", title: "Vendor Bookings", desc: "Finalise photographer, caterer, decorator, makeup artist, and entertainment." },
  { time: "3 Months Before", title: "Finalise Details", desc: "Confirm guest list, send invites, finalise menus, conduct venue walk-throughs." },
  { time: "1 Month Before", title: "Final Preparations", desc: "Rehearsal, bridal trial, confirm all vendor timelines and payments." },
];

function fadeUp(delay = 0) {
  return { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay } };
}

export default function Weddings() {
  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">

        {/* Hero */}
        <section className="relative py-28 px-6 md:px-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.07)_0%,transparent_65%)]" />
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
          <motion.div {...fadeUp()} className="relative z-10">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Inspiration & Stories ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h1 className="font-cormorant text-5xl md:text-7xl font-light mb-6">
              Dream <span className="text-primary italic font-semibold">Weddings</span>
            </h1>
            <p className="font-manrope text-white/60 text-base max-w-xl mx-auto leading-relaxed">
              Real love stories, breathtaking venues, and curated inspiration from couples who found their dream team on Book My Squad.
            </p>
            <div className="flex flex-wrap justify-center gap-12 mt-12">
              {[{ n: "210+", l: "Wedding Stories" }, { n: "24", l: "Cities" }, { n: "98%", l: "Happy Couples" }].map(s => (
                <div key={s.l} className="text-center">
                  <div className="font-cormorant text-4xl text-primary font-semibold">{s.n}</div>
                  <div className="font-manrope text-xs text-white/45 uppercase tracking-wider mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Wedding Styles */}
        <section className="py-20 px-6 md:px-12 bg-[#0a0806] border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp(0.1)} className="mb-12 text-center">
              <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/60 uppercase mb-3">✦ Browse By Style ✦</p>
              <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">
                Wedding <span className="text-primary italic font-semibold">Styles</span>
              </h2>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STYLES.map((s, i) => (
                <motion.div key={i} {...fadeUp(0.15 + i * 0.07)}
                  className="group relative overflow-hidden cursor-pointer h-64 luxury-card"
                >
                  <img src={s.img} alt={s.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="font-cormorant text-xl text-white font-semibold mb-1">{s.name}</h3>
                    <p className="font-manrope text-xs text-primary/70">{s.count}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Wedding Cards Grid */}
        <section className="py-20 px-6 md:px-12 bg-[#080604]">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp(0.1)} className="mb-12 flex flex-col md:flex-row justify-between items-end">
              <div>
                <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/60 uppercase mb-3">✦ Real Stories ✦</p>
                <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">
                  Featured <span className="text-primary italic font-semibold">Celebrations</span>
                </h2>
              </div>
              <Link href="/photos" className="hidden md:flex items-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-primary hover:text-white transition-colors mt-4">
                View Photo Gallery <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {WEDDINGS.map((w, i) => (
                <motion.div key={i} {...fadeUp(0.15 + i * 0.08)}
                  className="luxury-card group cursor-pointer overflow-hidden"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img src={w.img} alt={w.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-primary fill-primary" />)}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {w.tags.map(t => (
                          <span key={t} className="font-cinzel text-[8px] tracking-[0.2em] text-primary/90 bg-black/50 border border-primary/30 px-2 py-0.5 uppercase">{t}</span>
                        ))}
                      </div>
                      <span className="font-cinzel text-[9px] tracking-[0.3em] text-primary/80 uppercase">{w.title}</span>
                      <h3 className="font-cormorant text-xl text-white font-semibold">{w.names}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-primary/60" />
                        <span className="font-manrope text-xs text-white/50">{w.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-primary/50" />
                        <span className="font-manrope text-xs text-white/40">{w.guests} guests</span>
                      </div>
                    </div>
                    <p className="font-manrope text-sm text-white/60 leading-relaxed mb-4">{w.desc}</p>
                    <Link href="/photos" className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase">View Gallery</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Planning Timeline */}
        <section className="py-20 px-6 md:px-12 bg-[#0a0806] border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeUp(0.1)} className="mb-14 text-center">
              <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/60 uppercase mb-3">✦ Your Journey ✦</p>
              <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">
                Wedding <span className="text-primary italic font-semibold">Planning Timeline</span>
              </h2>
            </motion.div>
            <div className="relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-primary/20" />
              {TIMELINE.map((step, i) => (
                <motion.div key={i} {...fadeUp(0.1 + i * 0.1)}
                  className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} pl-14 md:pl-0`}
                >
                  <div className="absolute left-4 md:left-1/2 top-1.5 w-4 h-4 rounded-full bg-primary border-2 border-[#0a0806] md:-translate-x-1/2 z-10 shadow-[0_0_12px_rgba(212,175,55,0.6)]" />
                  <div className={`md:w-[45%] luxury-card p-6 ${i % 2 === 0 ? "md:text-right" : ""}`}>
                    <span className="font-cinzel text-[9px] tracking-[0.3em] text-primary/70 uppercase">{step.time}</span>
                    <h3 className="font-cormorant text-xl text-white font-semibold mt-1 mb-2">{step.title}</h3>
                    <p className="font-manrope text-sm text-white/55 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 md:px-12 bg-[#050403]">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp(0.1)} className="mb-14 text-center">
              <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/60 uppercase mb-3">✦ Love Notes ✦</p>
              <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">
                What Couples <span className="text-primary italic font-semibold">Say</span>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={i} {...fadeUp(0.15 + i * 0.12)}
                  className="luxury-card p-8 text-center relative"
                >
                  <div className="font-cormorant text-7xl text-primary/15 absolute top-3 left-5 leading-none">"</div>
                  <div className="flex justify-center gap-1 mb-6 mt-2">
                    {[1,2,3,4,5].map(s => <span key={s} className="text-primary text-sm">★</span>)}
                  </div>
                  <p className="font-cormorant italic text-lg text-white/75 leading-relaxed mb-6 relative z-10">{t.text}</p>
                  <div className="w-12 h-px bg-primary/40 mx-auto mb-4" />
                  <p className="font-cinzel text-xs text-primary uppercase tracking-[0.1em]">{t.name}</p>
                  <p className="font-manrope text-[11px] text-white/40 mt-1">{t.location}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 md:px-12 bg-[#080604] border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div {...fadeUp(0.1)}>
              <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/60 uppercase mb-4">✦ Start Your Story ✦</p>
              <div className="gold-line w-16 mx-auto mb-6" />
              <h2 className="font-cormorant text-4xl md:text-6xl text-white font-light mb-6">
                Your Dream Wedding <span className="text-primary italic font-semibold">Awaits</span>
              </h2>
              <p className="font-manrope text-white/55 text-base mb-10 max-w-lg mx-auto leading-relaxed">
                Explore 436 venues and 255+ verified vendors across India. Begin your journey with Book My Squad today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/venues">
                  <button className="px-8 py-4 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all duration-300 gold-glow">
                    Browse Venues
                  </button>
                </Link>
                <Link href="/vendors">
                  <button className="px-8 py-4 border border-primary/50 text-primary font-cinzel font-semibold text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-black transition-all duration-300">
                    Find Vendors
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
