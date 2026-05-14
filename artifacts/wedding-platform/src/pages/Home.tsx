import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Search, ChevronDown, ArrowRight, LocateFixed, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";

const CITY_LIST = [
  "Agra","Alwar","Bangalore","Bareilly","Bikaner","Chennai","Dehradun","Delhi",
  "Faridabad","Ghaziabad","Goa","Gurgaon","Hyderabad","Jaipur","Jaisalmer",
  "Jhansi","Jodhpur","Kanpur","Leh","Lucknow","Manali","Meerut","Mumbai",
  "Noida","Prayagraj","Ramnagar","Rishikesh","Shimla","Udaipur","Varanasi",
];

const SERVICE_LIST = [
  { label: "Wedding Planner", value: "wedding-planner" },
  { label: "Photography", value: "photography" },
  { label: "Makeup Artist", value: "makeup-artist" },
  { label: "Catering", value: "catering" },
  { label: "Decorator", value: "decorator" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Music / DJ", value: "music" },
];

function matchToCity(raw: string): string {
  const r = raw.toLowerCase();
  const aliases: Record<string, string> = {
    mumbai: "Mumbai", bombay: "Mumbai",
    delhi: "Delhi", "new delhi": "Delhi", gurugram: "Gurgaon", gurgaon: "Gurgaon",
    noida: "Noida", faridabad: "Faridabad", ghaziabad: "Ghaziabad",
    bangalore: "Bangalore", bengaluru: "Bangalore",
    jaipur: "Jaipur", jaisalmer: "Jaisalmer", jodhpur: "Jodhpur",
    alwar: "Alwar", bikaner: "Bikaner", ajmer: "Jaipur",
    chennai: "Chennai", madras: "Chennai",
    hyderabad: "Hyderabad", secunderabad: "Hyderabad",
    goa: "Goa", panaji: "Goa",
    udaipur: "Udaipur",
    lucknow: "Lucknow", kanpur: "Kanpur", agra: "Agra",
    varanasi: "Varanasi", prayagraj: "Prayagraj", allahabad: "Prayagraj",
    bareilly: "Bareilly", jhansi: "Jhansi", meerut: "Meerut",
    dehradun: "Dehradun", rishikesh: "Rishikesh", mussoorie: "Dehradun",
    shimla: "Shimla", manali: "Manali", leh: "Leh",
    ramnagar: "Ramnagar",
  };
  for (const [key, val] of Object.entries(aliases)) {
    if (r.includes(key)) return val;
  }
  return "";
}

export default function Home() {
  const [, navigate] = useLocation();
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("");
  const [service, setService] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoLat, setGeoLat] = useState<number | null>(null);
  const [geoLon, setGeoLon] = useState<number | null>(null);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setGeoLat(latitude);
        setGeoLon(longitude);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json() as { address?: Record<string, string> };
          const addr = data.address ?? {};
          const raw = addr.city ?? addr.town ?? addr.village ?? addr.county ?? "";
          const matched = matchToCity(raw);
          if (matched) setCity(matched);
        } catch {
          // silent fallback — leave city as-is
        } finally {
          setGeoLoading(false);
        }
      },
      () => { setGeoLoading(false); },
      { timeout: 8000 }
    );
  };

  const handleSearch = () => {
    if (service === "venues") {
      const params = new URLSearchParams();
      if (city) params.set("city", city.toUpperCase());
      if (geoLat !== null) params.set("lat", geoLat.toFixed(4));
      if (geoLon !== null) params.set("lon", geoLon.toFixed(4));
      const qs = params.toString();
      navigate(`/venues${qs ? `?${qs}` : ""}`);
    } else {
      const params = new URLSearchParams();
      if (city) params.set("city", city);
      if (service) params.set("category", service);
      if (geoLat !== null) params.set("lat", geoLat.toFixed(4));
      if (geoLon !== null) params.set("lon", geoLon.toFixed(4));
      const qs = params.toString();
      navigate(`/vendors${qs ? `?${qs}` : ""}`);
    }
  };


  return (
    <div className="min-h-screen bg-[#080604] w-full overflow-x-hidden font-sans">
      <Navbar />

      {/* SECTION 1: HERO */}
      <section className="relative w-full h-screen min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover scale-[1.05]"
            poster="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-wedding-ceremony-decoration-4707-large.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-couple-dancing-at-a-wedding-party-4780-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 video-overlay" />
          <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.08) 0%, transparent 60%)'}} />
        </div>

        <div className="absolute inset-0 z-[1] opacity-20 pointer-events-none grain-overlay" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <div className="font-cinzel text-xs tracking-[0.5em] text-primary/80 uppercase mb-4">
              ✦ India's Finest Event Planning Platform ✦
            </div>
            <div className="gold-line w-32 mx-auto mb-8" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[100px] font-cormorant font-light text-white leading-[0.95] tracking-tight mb-6"
          >
            Plan your<br />
            <span className="text-shimmer font-semibold italic pr-4">dream event</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="font-manrope text-white text-base md:text-lg font-light max-w-xl mx-auto mb-12 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9)' }}
          >
            Find the best vendors for weddings, events & celebrations — with thousands of trusted reviews
          </motion.p>

          {/* 4-field Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-1.5 flex flex-col lg:flex-row gap-1.5 gold-border-glow">
              {/* City */}
              <div className="flex-1 flex items-center px-5 py-3.5 border-r border-white/10 gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <select
                  className="flex-1 bg-transparent border-none outline-none text-white/80 text-sm font-manrope font-light cursor-pointer min-w-0"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                >
                  <option value="" className="bg-[#0d0b08]">
                    {geoLoading ? "Detecting…" : "Select City"}
                  </option>
                  {CITY_LIST.map(c => (
                    <option key={c} value={c} className="bg-[#0d0b08]">{c}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={detectLocation}
                  title="Use my location"
                  className="shrink-0 text-primary/50 hover:text-primary transition-colors duration-200"
                >
                  {geoLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}>
                      <Loader2 className="w-3.5 h-3.5" />
                    </motion.div>
                  ) : (
                    <LocateFixed className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {/* Event Type */}
              <div className="flex-1 flex items-center px-5 py-3.5 border-r border-white/10">
                <Search className="w-4 h-4 text-primary mr-3 shrink-0" />
                <select
                  className="w-full bg-transparent border-none outline-none text-white/80 text-sm font-manrope font-light cursor-pointer"
                  value={eventType}
                  onChange={e => setEventType(e.target.value)}
                >
                  <option value="" className="bg-[#0d0b08]">Event Type</option>
                  {["Wedding","Destination Wedding","Live Concert","Award Show","Baby Shower","Party"].map(t => (
                    <option key={t} value={t.toLowerCase().replace(/ /g,"-")} className="bg-[#0d0b08]">{t}</option>
                  ))}
                </select>
              </div>
              {/* Date */}
              <div className="flex-1 flex items-center px-5 py-3.5 border-r border-white/10">
                <Calendar className="w-4 h-4 text-primary mr-3 shrink-0" />
                <input type="date" className="w-full bg-transparent border-none outline-none text-white/60 text-sm font-manrope font-light" />
              </div>
              {/* Service */}
              <div className="flex-1 flex items-center px-5 py-3.5">
                <Search className="w-4 h-4 text-primary mr-3 shrink-0" />
                <select
                  className="w-full bg-transparent border-none outline-none text-white/80 text-sm font-manrope font-light cursor-pointer"
                  value={service}
                  onChange={e => setService(e.target.value)}
                >
                  <option value="" className="bg-[#0d0b08]">Select Service</option>
                  <option value="venues" className="bg-[#0d0b08]">Venues</option>
                  {SERVICE_LIST.map(s => (
                    <option key={s.value} value={s.value} className="bg-[#0d0b08]">{s.label}</option>
                  ))}
                </select>
              </div>
              {/* CTA */}
              <button
                onClick={handleSearch}
                className="px-8 py-3.5 bg-primary text-black font-cinzel font-semibold text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all duration-300 gold-glow"
              >
                Search
              </button>
            </div>

            {/* Popular tags */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="font-cinzel text-[10px] tracking-[0.3em] text-white/40 uppercase mr-2">Popular:</span>
              {[
                { label: "Wedding Venues", href: "/venues" },
                { label: "Photography", href: "/vendors" },
                { label: "Bridal Makeup", href: "/vendors" },
                { label: "Entertainment", href: "/vendors" },
                { label: "Catering", href: "/vendors" },
              ].map(tag => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="px-3 py-1 text-xs font-manrope text-white/50 border border-white/10 hover:border-primary/40 hover:text-primary/80 cursor-pointer transition-all duration-300 backdrop-blur-sm"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-cinzel text-[9px] tracking-[0.4em] text-white/30 uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4 text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: MARQUEE STRIP */}
      <div className="bg-primary py-3 overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap"
        >
          {Array(3).fill(["✦ VENUES", "PHOTOGRAPHY", "BRIDAL MAKEUP", "CATERING", "ENTERTAINMENT", "DECORATOR", "WEDDING PLANNER", "MEHENDI", "PANDIT", "DJ & MUSIC"]).flat().map((item, i) => (
            <span key={i} className="font-cinzel text-xs tracking-[0.3em] text-black font-semibold uppercase">{item}</span>
          ))}
        </motion.div>
      </div>

      {/* SECTION 3: POPULAR VENUE SEARCHES */}
      <section className="py-28 px-6 md:px-12" style={{background: '#080604'}}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/60 uppercase mb-4">✦ Curated For You ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="font-cormorant text-5xl md:text-6xl text-white font-light">
              Popular <span className="text-primary italic font-semibold">Venue</span> Searches
            </h2>
          </div>

          {/* Bento grid — large left card (2 rows) + 4 right cards (2×2) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Large card spanning 2 rows */}
            <Link href="/venues">
              <motion.div
                className="lg:row-span-2 relative overflow-hidden group cursor-pointer luxury-card h-[340px] lg:h-full"
                style={{ minHeight: '600px' }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.4 }}
              >
                <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80" alt="Hotels" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 transition-all duration-500" />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="font-cinzel text-[10px] tracking-[0.3em] text-primary/70 uppercase">Hotels</span>
                  <h3 className="font-cormorant text-3xl text-white mt-2 mb-3 font-semibold">4 Star & Above Hotels</h3>
                  <p className="font-manrope text-sm text-white/50 font-light leading-relaxed mb-4">Grand ballrooms and stunning pool-side lawns in India's finest luxury hotel properties.</p>
                  <div className="flex flex-wrap gap-3">
                    {["Mumbai", "Bangalore", "Pune", "Delhi", "Hyderabad"].map(c => (
                      <span key={c} className="text-[10px] text-white/50 font-manrope border-b border-white/20 pb-0.5 hover:text-primary hover:border-primary/40 transition-colors">{c}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Four smaller cards filling the 2×2 right side */}
            {[
              {
                img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=700&q=80",
                type: "Banquet",
                title: "Banquet Halls",
                desc: "Elegant indoor spaces for up to 2,000 guests with world-class catering.",
                cities: ["Mumbai", "Delhi", "Jaipur"],
              },
              {
                img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=700&q=80",
                type: "Garden",
                title: "Marriage Garden & Lawns",
                desc: "Lush open-air venues perfect for a dreamy outdoor celebration.",
                cities: ["Bangalore", "Pune", "Ahmedabad"],
              },
              {
                img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=700&q=80",
                type: "Resort",
                title: "Destination Resorts",
                desc: "Weekend getaway venues with private villas and spa retreats.",
                cities: ["Goa", "Udaipur", "Shimla"],
              },
              {
                img: "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=700&q=80",
                type: "Farmhouse",
                title: "Heritage Farmhouses",
                desc: "Rustic yet opulent farmhouse estates blending charm with modernity.",
                cities: ["Delhi NCR", "Jaipur", "Chandigarh"],
              },
            ].map((card, i) => (
              <Link key={i} href="/venues">
                <motion.div
                  className="relative overflow-hidden group cursor-pointer luxury-card"
                  style={{ minHeight: '280px' }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.4 }}
                >
                  <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 transition-all duration-500" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="font-cinzel text-[9px] tracking-[0.3em] text-primary/70 uppercase">{card.type}</span>
                    <h3 className="font-cormorant text-xl text-white mt-1 mb-2 font-semibold">{card.title}</h3>
                    <p className="font-manrope text-xs text-white/40 font-light leading-relaxed mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-h-0 group-hover:max-h-16 overflow-hidden">
                      {card.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {card.cities.map(c => (
                        <span key={c} className="text-[9px] text-white/40 font-manrope border-b border-white/15 pb-0.5">{c}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: INHOUSE SERVICES */}
      <section className="py-24 px-6 md:px-12 bg-[#0a0804]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/60 uppercase mb-4">✦ Premium Services ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="font-cormorant text-5xl md:text-6xl text-white font-light">
              <span className="text-primary italic font-semibold">Inhouse</span> Services
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80", title: "Wedding Planning", desc: "End-to-end meticulous planning by our luxury expert team", href: "/vendors" },
              { img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=700&q=80", title: "Photography & Films", desc: "Cinematic captures of your most treasured moments", href: "/vendors" },
              { img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80", title: "Bridal Artistry", desc: "Top makeup artists curating your flawless special day look", href: "/vendors" },
            ].map((service, i) => (
              <Link key={i} href={service.href}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="luxury-card p-6 flex flex-col group cursor-pointer hover:gold-glow rounded-sm"
                >
                  <div className="w-full aspect-square mb-6 overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-colors">
                    <img src={service.img} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col flex-1 text-center items-center justify-center">
                    <h3 className="text-white font-cormorant text-3xl font-semibold mb-3">{service.title}</h3>
                    <p className="font-manrope text-white/60 font-light text-sm mb-6">{service.desc}</p>
                    <span className="mt-auto font-cinzel text-primary text-[10px] tracking-[0.2em] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all uppercase">
                      Discover More <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: BROWSE BY CATEGORY */}
      <section className="py-28 px-6 md:px-12 bg-[#080604] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="flex-1">
              <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/60 uppercase mb-4">✦ Vendor Categories ✦</p>
              <div className="gold-line w-16 mb-6" />
              <h2 className="font-cormorant text-5xl md:text-6xl text-white font-light">
                Explore <span className="text-primary italic font-semibold">Categories</span>
              </h2>
            </div>
            <Link href="/vendors" className="hidden md:inline-flex items-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-primary font-semibold hover:text-white transition-colors mt-8 md:mt-0">
              Explore All 19 Categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Venues",        num: "01", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=700&q=80", sub: ["Lawn", "Farmhouse", "Banquet", "Hotel", "Resort"],                   href: "/venues" },
              { name: "Makeup",        num: "02", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80", sub: ["Bridal Makeup", "Groom Makeup", "Party Makeup"],                     href: "/vendors" },
              { name: "Catering",      num: "03", image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=700&q=80", sub: ["Indian/Traditional", "Chinese", "Jain Food", "Punjabi", "South Indian"], href: "/vendors" },
              { name: "Photography",   num: "04", image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=700&q=80", sub: ["Pre-Wedding", "Wedding", "Corporate", "Brand Shoot"],                href: "/vendors" },
              { name: "Decorator",     num: "05", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=700&q=80", sub: ["Wedding Decorator", "Baby Party", "Balloon", "Theme Decorator"],    href: "/vendors" },
              { name: "Entertainment", num: "06", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=700&q=80", sub: ["DJ", "Comedian", "Magician", "Tarot Card Reader"],                   href: "/vendors" },
            ].map((vendor, i) => (
              <Link key={i} href={vendor.href}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                  className="group relative overflow-hidden rounded-sm h-[400px] cursor-pointer border border-transparent hover:gold-border-glow transition-all duration-500"
                >
                  <img src={vendor.image} alt={vendor.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:from-black/95 transition-colors duration-500" />
                  <div className="absolute top-6 right-6 font-cinzel text-xl text-primary/80 font-bold opacity-80 group-hover:opacity-100 group-hover:text-primary transition-all">
                    {vendor.num}
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="font-cormorant text-3xl font-semibold text-white leading-tight mb-4 group-hover:mb-2 transition-all duration-300">{vendor.name}</h4>
                    <div className="flex flex-wrap gap-2 max-h-0 opacity-0 overflow-hidden group-hover:max-h-32 group-hover:opacity-100 group-hover:mt-4 transition-all duration-500 ease-out">
                      {vendor.sub.map((sub, j) => (
                        <span key={j} className="text-[9px] font-cinzel uppercase tracking-wider font-semibold text-primary bg-black/40 border border-primary/30 backdrop-blur-md px-2.5 py-1 rounded-sm">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center md:hidden">
            <Link href="/vendors" className="inline-flex items-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-primary font-semibold hover:text-white transition-colors">
              Explore All 19 Categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: DREAM WEDDINGS */}
      <section className="py-28 px-6 md:px-12 bg-[#0d0a07]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="flex-1">
              <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/60 uppercase mb-4">✦ Inspiration ✦</p>
              <div className="gold-line w-16 mb-6" />
              <h2 className="font-cormorant text-5xl md:text-6xl text-white font-light">
                Dream <span className="text-primary italic font-semibold">Weddings</span>
              </h2>
            </div>
            <Link href="/weddings">
              <Button variant="outline" className="hidden md:flex rounded-sm border-primary/50 text-primary font-cinzel text-[10px] tracking-[0.2em] uppercase hover:bg-primary hover:text-black transition-colors">
                View All Galleries
              </Button>
            </Link>
          </div>

          {/* 2-column featured + 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=85",
                title: "Royal Rajasthani",
                names: "Priya & Rahul",
                city: "Udaipur",
                style: "Destination",
                span: "lg:col-span-2 lg:row-span-2",
                aspect: "aspect-[4/5]",
              },
              {
                img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=700&q=85",
                title: "Pink City Magic",
                names: "Ananya & Vikram",
                city: "Jaipur",
                style: "Traditional",
                span: "",
                aspect: "aspect-square",
              },
              {
                img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&q=85",
                title: "Beachside Boho",
                names: "Neha & Arjun",
                city: "Goa",
                style: "Bohemian",
                span: "",
                aspect: "aspect-square",
              },
              {
                img: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=700&q=85",
                title: "Modern Luxury",
                names: "Shriya & Karan",
                city: "Mumbai",
                style: "Contemporary",
                span: "",
                aspect: "aspect-square",
              },
              {
                img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=700&q=85",
                title: "Garden Soirée",
                names: "Riya & Dev",
                city: "Bangalore",
                style: "Garden",
                span: "",
                aspect: "aspect-square",
              },
            ].map((wedding, i) => (
              <Link key={i} href="/weddings" className={wedding.span}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group cursor-pointer h-full"
                >
                  <div className={`overflow-hidden relative ${wedding.aspect} ${wedding.span ? 'h-full min-h-[480px]' : ''} border border-white/5 group-hover:border-primary/40 transition-colors duration-500`}>
                    <img
                      src={wedding.img}
                      alt={wedding.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {/* Style tag */}
                    <div className="absolute top-4 left-4">
                      <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-primary bg-black/50 border border-primary/30 px-2 py-1 backdrop-blur-sm">
                        {wedding.style}
                      </span>
                    </div>
                    {/* Bottom info */}
                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="font-cinzel text-[10px] tracking-[0.15em] text-white/50 uppercase mb-1">{wedding.title}</h3>
                      <p className="font-cormorant italic text-xl md:text-2xl text-primary mb-1 leading-tight">{wedding.names}</p>
                      <p className="font-manrope text-xs text-white/40 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary/50 shrink-0" /> {wedding.city}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link href="/weddings">
              <Button variant="outline" className="rounded-sm border-primary/50 text-primary font-cinzel text-[10px] tracking-[0.2em] uppercase hover:bg-primary hover:text-black transition-colors w-full">
                View All Galleries
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: STATS COUNTER */}
      <section className="py-24 bg-black relative border-y border-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between divide-y md:divide-y-0 md:divide-x divide-primary/20">
            {[
              { num: "6,346+", label: "Verified Vendors" },
              { num: "76+", label: "Cities Covered" },
              { num: "63,346+", label: "Happy Couples" },
              { num: "436", label: "Wedding Venues" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex-1 py-8 md:py-0 text-center flex flex-col items-center justify-center"
              >
                <div className="text-4xl md:text-6xl font-cinzel text-shimmer mb-3">{stat.num}</div>
                <div className="font-manrope text-white/50 text-[10px] uppercase tracking-[0.3em] font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: WEDDING MAGAZINE */}
      <section className="py-28 px-6 md:px-12 bg-[#080604]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="flex-1">
              <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/60 uppercase mb-4">✦ The Editorial ✦</p>
              <div className="gold-line w-16 mb-6" />
              <h2 className="font-cormorant text-5xl md:text-6xl text-white font-light">
                Wedding <span className="text-primary italic font-semibold">Magazine</span>
              </h2>
            </div>
            <Link href="/blog" className="hidden md:inline-flex items-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-primary font-semibold hover:text-white transition-colors">
              All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Post — spans 2 columns */}
            <Link href="/blog" className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="group cursor-pointer h-full flex flex-col"
              >
                <div className="overflow-hidden h-[420px] mb-6 relative border border-white/5 group-hover:border-primary/40 transition-all duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1583396618422-c6cf3b31e30c?w=1000&q=85"
                    alt="Featured"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-primary bg-black/60 border border-primary/30 px-2.5 py-1 backdrop-blur-sm">
                      Cover Story
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-cinzel text-[10px] tracking-[0.2em] text-primary uppercase border border-primary/30 px-3 py-1">Bridal Fashion</span>
                  <span className="font-manrope font-light text-xs text-white/40">5 min read</span>
                  <span className="font-manrope font-light text-xs text-white/30">May 2026</span>
                </div>
                <h3 className="font-cormorant text-4xl text-white font-medium mb-3 group-hover:text-primary transition-colors leading-tight">
                  15 Stunning Lehenga Trends for 2026 Brides
                </h3>
                <p className="font-manrope text-white/50 text-sm font-light leading-relaxed mb-5 flex-grow">
                  From hand-embroidered Banarasi silk to contemporary mirror-work silhouettes — our fashion editors curate this season's most coveted bridal looks.
                </p>
                <div className="flex items-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">
                  Read Article <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            </Link>

            {/* Side articles */}
            <div className="flex flex-col gap-7">
              {[
                {
                  img: "https://images.unsplash.com/photo-1554774853-719586f82d77?w=600&q=85",
                  tag: "Planning",
                  title: "How to Plan Your Wedding Budget Without Stress",
                  excerpt: "A practical guide to allocating your wedding budget across venues, catering, décor and photography.",
                  time: "7 min read",
                },
                {
                  img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=85",
                  tag: "Décor",
                  title: "Minimalist Décor Ideas That Look Expensive",
                  excerpt: "Less is more — discover how restrained colour palettes and quality florals create a luxury atmosphere.",
                  time: "4 min read",
                },
                {
                  img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=85",
                  tag: "Photography",
                  title: "Golden Hour Portraits: Tips From Top Wedding Photographers",
                  excerpt: "India's leading wedding photographers share their secrets for capturing those unforgettable moments.",
                  time: "6 min read",
                },
              ].map((post, i) => (
                <Link key={i} href="/blog">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                    className="group cursor-pointer flex gap-4"
                  >
                    <div className="w-24 h-24 shrink-0 overflow-hidden border border-white/5 group-hover:border-primary/40 transition-colors duration-500">
                      <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-cinzel text-[9px] tracking-[0.2em] text-primary uppercase">{post.tag}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                        <span className="font-manrope text-[10px] text-white/35">{post.time}</span>
                      </div>
                      <h3 className="font-cormorant text-lg text-white font-medium leading-snug group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              ))}

              <Link href="/blog" className="mt-2">
                <div className="flex items-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-primary/70 hover:text-primary transition-colors font-semibold">
                  Browse all articles <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </div>
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link href="/blog" className="inline-flex items-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-primary font-semibold hover:text-white transition-colors">
              All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 9: TESTIMONIALS */}
      <section className="py-28 px-6 md:px-12 bg-[#050403] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20 text-center">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/60 uppercase mb-4">✦ Love Stories ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="font-cormorant text-5xl md:text-6xl text-white font-light">
              Words of <span className="text-primary italic font-semibold">Praise</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "The planning was flawless. Every detail was curated with such precision and elegance. Our guests are still talking about the magnificent decor and seamless experience.", name: "Rohan & Sneha", date: "Married in Jaipur" },
              { text: "Finding vendors through BMS was the best decision. The platform's luxury partners delivered beyond our wildest expectations. A truly 5-star experience from start to finish.", name: "Vikram & Aisha", date: "Married in Udaipur" },
              { text: "They understood our vision for a minimalist yet opulent celebration immediately. The venue recommendation was breathtaking and the execution was pure perfection.", name: "Karan & Meera", date: "Married in Goa" }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="luxury-card p-10 flex flex-col items-center text-center rounded-sm relative"
              >
                <div className="font-cormorant text-8xl text-primary/20 absolute top-4 left-6 leading-none">"</div>
                <div className="flex gap-1 mb-8 mt-4">
                  {[1,2,3,4,5].map(star => <span key={star} className="text-primary text-sm">★</span>)}
                </div>
                <p className="font-cormorant italic text-xl text-white/80 leading-relaxed mb-10 flex-grow relative z-10">{review.text}</p>
                <div className="w-16 h-px bg-primary/40 mb-6" />
                <h4 className="font-cinzel text-sm text-primary uppercase tracking-[0.1em] mb-1">{review.name}</h4>
                <p className="font-manrope text-xs text-white/40 font-light">{review.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: VENDOR CTA */}
      <section className="bg-[#080604] border-y border-white/10">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/60 uppercase mb-4">✦ Join The Network ✦</p>
            <h2 className="font-cormorant text-5xl md:text-6xl text-white font-light leading-tight mb-8">
              Are you a <span className="text-primary italic font-semibold">Premium</span> Vendor?
            </h2>

            <ul className="space-y-4 mb-12">
              {[
                "Showcase your portfolio to high-net-worth clients",
                "Receive verified, quality leads",
                "Join an exclusive network of luxury professionals"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-1 h-1 bg-primary rounded-full mt-2.5 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                  <span className="font-manrope text-white/70 font-light text-lg">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/list-your-business">
              <button className="self-start px-8 py-4 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all duration-300 gold-glow rounded-sm">
                List Your Business
              </button>
            </Link>
          </div>

          <div className="w-full md:w-1/2 min-h-[400px] md:min-h-full relative">
            <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80" alt="Luxury Event" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080604] to-transparent md:via-transparent md:to-transparent" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
