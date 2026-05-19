import { useState, useRef } from "react";
import { useMeta } from "@/hooks/useMeta";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Search, ChevronDown, ArrowRight, LocateFixed, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useScrollAnimation, useStaggerAnimation } from "@/hooks/useScrollAnimation";
import { useParallax } from "@/hooks/useParallax";
import { TiltCard } from "@/components/TiltCard";
import { AnimatedText } from "@/components/AnimatedText";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SplitText } from "@/components/SplitText";
import { FloatingParticles } from "@/components/FloatingParticles";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";

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
  useMeta();
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
          // silent fallback
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

  /* ── Parallax refs ── */
  const heroTextRef     = useParallax<HTMLDivElement>({ speed: -0.18, scrub: 2 });
  const heroVideoRef    = useParallax<HTMLDivElement>({ speed: 0.12,  scrub: 2 });

  /* ── GSAP scroll animation refs ── */
  const venueHeadRef    = useScrollAnimation<HTMLDivElement>({ type: "fadeUp", duration: 1 });
  const venueGridRef    = useStaggerAnimation<HTMLDivElement>({ type: "scaleIn", stagger: 0.08, start: "top 90%" });
  const inhouseHeadRef  = useScrollAnimation<HTMLDivElement>({ type: "fadeUp", duration: 1 });
  const inhouseGridRef  = useStaggerAnimation<HTMLDivElement>({ type: "fadeUp", stagger: 0.12 });
  const catHeadRef      = useScrollAnimation<HTMLDivElement>({ type: "fadeUp", duration: 1 });
  const catGridRef      = useStaggerAnimation<HTMLDivElement>({ type: "fadeUp", stagger: 0.08 });
  const dreamHeadRef    = useScrollAnimation<HTMLDivElement>({ type: "fadeUp", duration: 1 });
  const dreamGridRef    = useStaggerAnimation<HTMLDivElement>({ type: "scaleIn", stagger: 0.1 });
  const statsRef        = useStaggerAnimation<HTMLDivElement>({ type: "fadeUp", stagger: 0.15, start: "top 85%" });
  const magazineHeadRef = useScrollAnimation<HTMLDivElement>({ type: "fadeUp", duration: 1 });
  const magazineGridRef = useStaggerAnimation<HTMLDivElement>({ type: "fadeUp", stagger: 0.12 });
  const testHeadRef     = useScrollAnimation<HTMLDivElement>({ type: "fadeUp", duration: 1 });
  const testGridRef     = useStaggerAnimation<HTMLDivElement>({ type: "fadeUp", stagger: 0.15 });
  const ctaTextRef      = useScrollAnimation<HTMLDivElement>({ type: "slideRight", duration: 1, start: "top 80%" });
  const ctaImgRef       = useScrollAnimation<HTMLDivElement>({ type: "imageReveal", duration: 1.2, start: "top 80%" });

  return (
    <div className="min-h-screen bg-[#080604] w-full overflow-x-hidden font-sans pb-mobile-nav lg:pb-0">
      <ScrollProgressBar />
      <Navbar />

      {/* SECTION 1: HERO */}
      <section className="relative w-full h-screen min-h-screen overflow-hidden after:absolute after:bottom-0 after:left-0 after:right-0 after:h-32 after:bg-gradient-to-t after:from-[#080604] after:to-transparent after:z-[5] after:pointer-events-none">
        {/* Video BG with parallax */}
        <div ref={heroVideoRef} className="absolute inset-0 z-0 scale-[1.15] parallax-inner">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-wedding-ceremony-decoration-4707-large.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-couple-dancing-at-a-wedding-party-4780-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 video-overlay" />
          <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.09) 0%, transparent 60%)'}} />
        </div>

        <div className="absolute inset-0 z-[1] opacity-20 pointer-events-none grain-overlay" />

        {/* Floating gold particles */}
        <div className="absolute inset-0 z-[2]">
          <FloatingParticles count={22} />
        </div>

        {/* Hero text — parallax upward on scroll */}
        <div ref={heroTextRef} className="relative z-10 h-full flex flex-col items-center justify-start px-6 text-center parallax-inner" style={{ paddingTop: 'clamp(96px, calc(50vh - 230px), 260px)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 md:mb-12"
          >
            <div className="font-cinzel text-[9px] sm:text-xs tracking-[0.2em] sm:tracking-[0.4em] text-primary/80 uppercase mb-3 md:mb-4 px-2">
              ✦ India's Finest Event Planning Platform ✦
            </div>
            <div className="gold-line w-24 md:w-32 mx-auto mb-5 md:mb-8" />
          </motion.div>

          <h1 className="font-cormorant mb-5 md:mb-8 select-none" style={{ filter: 'drop-shadow(0 0 32px rgba(212,175,55,0.18)) drop-shadow(0 2px 16px rgba(0,0,0,0.85))' }}>
            {/* "Plan your" — elegant light prelude */}
            <SplitText
              text="Plan your"
              mode="words"
              anim="load"
              delay={0.25}
              stagger={0.12}
              duration={1.1}
              className="block text-[42px] sm:text-[56px] md:text-[76px] lg:text-[96px] font-extralight text-white/90 tracking-[0.12em] sm:tracking-[0.16em] leading-[1.05] mb-0"
            />
            {/* "Dream Event" — italic for elegance */}
            <SplitText
              text="Dream Event"
              mode="words"
              anim="load"
              delay={0.45}
              stagger={0.12}
              duration={1.1}
              className="block text-[42px] sm:text-[56px] md:text-[76px] lg:text-[96px] font-light italic text-white tracking-[0.08em] sm:tracking-[0.1em] leading-[1.05]"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="font-manrope text-white text-sm sm:text-base md:text-lg font-light max-w-xs sm:max-w-md md:max-w-xl mx-auto mb-8 md:mb-12 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] px-2"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9)' }}
          >
            Every great love story deserves a perfect setting. India's finest vendors, curated for couples who refuse to settle.
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
              <div className="flex-1 flex items-center px-5 py-3.5 border-b lg:border-b-0 lg:border-r border-white/10 gap-2">
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
              <div className="flex-1 flex items-center px-5 py-3.5 border-b lg:border-b-0 lg:border-r border-white/10">
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
              <div className="flex-1 flex items-center px-5 py-3.5 border-b lg:border-b-0 lg:border-r border-white/10">
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
                className="w-full lg:w-auto px-10 py-4 lg:py-5 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all duration-300 gold-glow shrink-0"
              >
                Search
              </button>
            </div>

            {/* Popular tags */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="font-cinzel text-[10px] tracking-[0.3em] text-white/65 uppercase mr-2">Popular:</span>
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

      </section>

      {/* SECTION 2: MARQUEE STRIP */}
      <div className="bg-primary py-3 overflow-hidden mt-6 md:mt-8">
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
      <section className="py-16 md:py-32 px-6 md:px-12" style={{background: '#080604'}}>
        <div className="max-w-7xl mx-auto">
          <div ref={venueHeadRef} className="mb-8 md:mb-16 text-center">
            <p className="font-cinzel text-[11px] sm:text-[13px] tracking-[0.3em] sm:tracking-[0.45em] text-primary/80 uppercase mb-4">✦ Curated For You ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-normal drop-shadow-[0_0_35px_rgba(212,175,55,0.45)]">
              Popular <span className="text-primary italic font-semibold">Venue</span> Searches
            </h2>
          </div>

          {/* Bento grid */}
          <div ref={venueGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[310px_310px] gap-4">

            {/* Large left card — spans 2 rows */}
            <Link href="/venues" className="md:col-span-2 lg:col-span-1 lg:row-span-2">
              <div
                className="relative overflow-hidden group cursor-pointer h-[420px] md:h-[380px] lg:h-full w-full transition-transform duration-500 hover:scale-[1.015]"
              >
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=85"
                  alt="Luxury Hotels"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/5 group-hover:via-black/25 transition-all duration-600" />
                <div className="absolute inset-0 border border-white/[0.06] group-hover:border-primary/45 transition-all duration-500" />
                <div className="absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }} />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="font-cinzel text-[9px] tracking-[0.45em] text-primary/65 uppercase block mb-2">Hotels</span>
                  <h3 className="font-cormorant text-[2.1rem] text-white font-semibold leading-tight mb-3">
                    4 Star &amp; Above Hotels
                  </h3>
                  <p className="font-manrope text-sm text-white/70 font-light leading-relaxed mb-5">
                    Grand ballrooms and pool-side lawns in India's finest luxury hotel properties.
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5">
                    {["Mumbai", "Bangalore", "Delhi", "Pune", "Hyderabad"].map(c => (
                      <span key={c} className="font-manrope text-[10px] text-white/70 border-b border-white/25 pb-0.5 group-hover:text-white/90 group-hover:border-white/40 transition-colors duration-300">{c}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <span className="font-cinzel text-[9px] tracking-[0.3em] text-primary uppercase">Explore All</span>
                    <span className="text-primary text-sm">→</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Four equal small cards */}
            {[
              {
                img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=85",
                type: "Banquet",
                title: "Banquet Halls",
                cities: ["Mumbai", "Delhi", "Jaipur"],
              },
              {
                img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85",
                type: "Garden",
                title: "Marriage Garden & Lawns",
                cities: ["Bangalore", "Pune", "Ahmedabad"],
              },
              {
                img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=85",
                type: "Resort",
                title: "Destination Resorts",
                cities: ["Goa", "Udaipur", "Shimla"],
              },
              {
                img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=85",
                type: "Farmhouse",
                title: "Heritage Farmhouses",
                cities: ["Delhi NCR", "Jaipur", "Chandigarh"],
              },
            ].map((card, i) => (
              <Link key={i} href="/venues">
                <div
                  className="relative overflow-hidden group cursor-pointer h-[240px] md:h-[260px] lg:h-full w-full transition-transform duration-500 hover:scale-[1.02]"
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/30 to-black/5 group-hover:via-black/20 transition-all duration-600" />
                  <div className="absolute inset-0 border border-white/[0.05] group-hover:border-primary/40 transition-all duration-500" />
                  <div className="absolute inset-x-0 top-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }} />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="font-cinzel text-[8px] tracking-[0.4em] text-primary/60 uppercase block mb-1.5">{card.type}</span>
                    <h3 className="font-cormorant text-[1.3rem] text-white font-semibold leading-tight mb-3">{card.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {card.cities.map(c => (
                          <span key={c} className="font-manrope text-[9px] text-white/65 border-b border-white/20 pb-0.5 group-hover:text-white/85 group-hover:border-white/35 transition-colors duration-300">{c}</span>
                        ))}
                      </div>
                      <span className="text-primary/50 group-hover:text-primary text-base transition-colors duration-300 ml-2 shrink-0">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Second row — 3 more venue types */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=85",
                type: "Heritage",
                title: "Palace & Heritage Venues",
                desc: "Palaces and havelis steeped in royal Indian grandeur.",
                cities: ["Jaipur", "Udaipur", "Jodhpur"],
              },
              {
                img: "https://images.pexels.com/photos/2403017/pexels-photo-2403017.jpeg?auto=compress&cs=tinysrgb&w=1200",
                type: "Poolside",
                title: "Poolside & Lawn Venues",
                desc: "Lush lawns and shimmering poolside settings under open skies.",
                cities: ["Goa", "Mumbai", "Pune"],
              },
              {
                img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=85",
                type: "Hilltop",
                title: "Scenic Hilltop Retreats",
                desc: "Breathtaking mountain backdrops for intimate celebrations.",
                cities: ["Shimla", "Mussoorie", "Ooty"],
              },
            ].map((card, i) => (
              <Link key={`extra-${i}`} href="/venues">
                <div className="relative overflow-hidden group cursor-pointer h-[220px] w-full transition-transform duration-500 hover:scale-[1.02]">
                  <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/30 to-black/5 group-hover:via-black/20 transition-all duration-600" />
                  <div className="absolute inset-0 border border-white/[0.05] group-hover:border-primary/40 transition-all duration-500" />
                  <div className="absolute inset-x-0 top-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }} />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="font-cinzel text-[8px] tracking-[0.4em] text-primary/75 uppercase block mb-1.5">{card.type}</span>
                    <h3 className="font-cormorant text-xl text-white font-semibold leading-tight mb-2">{card.title}</h3>
                    <p className="font-manrope text-[11px] text-white/70 mb-2 leading-relaxed">{card.desc}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {card.cities.map(c => (
                        <span key={c} className="font-manrope text-[9px] text-white/60 border-b border-white/20 pb-0.5">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: INHOUSE SERVICES */}
      <section className="py-16 md:py-32 px-6 md:px-12 bg-[#0a0804]">
        <div className="max-w-7xl mx-auto">
          <div ref={inhouseHeadRef} className="mb-10 md:mb-20 text-center">
            <p className="font-cinzel text-[11px] sm:text-[13px] tracking-[0.3em] sm:tracking-[0.45em] text-primary/80 uppercase mb-4">✦ Bespoke Offerings ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-normal drop-shadow-[0_0_35px_rgba(212,175,55,0.45)]">
              <span className="text-primary italic font-semibold">Signature</span> Services
            </h2>
          </div>

          <div ref={inhouseGridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80", title: "Wedding Planning", desc: "End-to-end meticulous planning by our luxury expert team", href: "/vendors" },
              { img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=700&q=80", title: "Photography & Films", desc: "Cinematic captures of your most treasured moments", href: "/vendors" },
              { img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80", title: "Bridal Artistry", desc: "Top makeup artists curating your flawless special day look", href: "/vendors" },
            ].map((svc, i) => (
              <Link key={i} href={svc.href}>
                <TiltCard className="h-full" max={5} glare>
                  <div className="luxury-card glass-card p-6 flex flex-col group cursor-pointer h-full rounded-sm overflow-hidden">
                    <div className="w-full aspect-square mb-6 overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-colors">
                      <img src={svc.img} alt={svc.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" />
                    </div>
                    <div className="flex flex-col flex-1 text-center items-center justify-center">
                      <h3 className="text-white font-cormorant text-3xl font-semibold mb-3">{svc.title}</h3>
                      <p className="font-manrope text-white/75 font-light text-sm mb-6">{svc.desc}</p>
                      <span className="mt-auto font-cinzel text-primary text-[10px] tracking-[0.2em] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all uppercase">
                        Discover More <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: BROWSE BY CATEGORY */}
      <section className="py-16 md:py-32 px-6 md:px-12 bg-[#080604] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div ref={catHeadRef} className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-20">
            <div className="flex-1">
              <p className="font-cinzel text-[11px] sm:text-[13px] tracking-[0.3em] sm:tracking-[0.45em] text-primary/80 uppercase mb-4">✦ Vendor Categories ✦</p>
              <div className="gold-line w-16 mb-6" />
              <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-normal drop-shadow-[0_0_35px_rgba(212,175,55,0.45)]">
                Explore <span className="text-primary italic font-semibold">Categories</span>
              </h2>
            </div>
            <Link href="/vendors" className="hidden md:inline-flex items-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-primary font-semibold hover:text-white transition-colors mt-8 md:mt-0">
              Explore All 19 Categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div ref={catGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Venues",        num: "01", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=700&q=80", sub: ["Lawn", "Farmhouse", "Banquet", "Hotel", "Resort"],                   href: "/venues" },
              { name: "Makeup",        num: "02", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80", sub: ["Bridal Makeup", "Groom Makeup", "Party Makeup"],                     href: "/vendors" },
              { name: "Catering",      num: "03", image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=700&q=80", sub: ["Indian/Traditional", "Chinese", "Jain Food", "Punjabi", "South Indian"], href: "/vendors" },
              { name: "Photography",   num: "04", image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=700&q=80", sub: ["Pre-Wedding", "Wedding", "Corporate", "Brand Shoot"],                href: "/vendors" },
              { name: "Decorator",     num: "05", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=700&q=80", sub: ["Wedding Decorator", "Baby Party", "Balloon", "Theme Decorator"],    href: "/vendors" },
              { name: "Entertainment", num: "06", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=700&q=80", sub: ["DJ", "Comedian", "Magician", "Tarot Card Reader"],                   href: "/vendors" },
            ].map((vendor, i) => (
              <Link key={i} href={vendor.href}>
                <div className="group relative overflow-hidden rounded-sm h-[400px] cursor-pointer border border-transparent hover:gold-border-glow transition-all duration-500">
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
                </div>
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
      <section className="py-16 md:py-32 px-6 md:px-12 bg-[#0d0a07]">
        <div className="max-w-7xl mx-auto">
          <div ref={dreamHeadRef} className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-20">
            <div className="flex-1">
              <p className="font-cinzel text-[11px] sm:text-[13px] tracking-[0.3em] sm:tracking-[0.45em] text-primary/80 uppercase mb-4">✦ Inspiration ✦</p>
              <div className="gold-line w-16 mb-6" />
              <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-normal drop-shadow-[0_0_35px_rgba(212,175,55,0.45)]">
                Dream <span className="text-primary italic font-semibold">Weddings</span>
              </h2>
            </div>
            <Link href="/weddings">
              <Button variant="outline" className="hidden md:flex rounded-sm border-primary/50 text-primary font-cinzel text-[10px] tracking-[0.2em] uppercase hover:bg-primary hover:text-black transition-colors">
                View All Galleries
              </Button>
            </Link>
          </div>

          <div ref={dreamGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              {
                img: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=700&q=85",
                title: "Grand Reception",
                names: "Kavya & Aditya",
                city: "Delhi",
                style: "Contemporary",
                span: "",
                aspect: "aspect-square",
              },
              {
                img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=700&q=85",
                title: "Royal Banquet",
                names: "Simran & Arjun",
                city: "Jaipur",
                style: "Traditional",
                span: "",
                aspect: "aspect-square",
              },
              {
                img: "https://images.pexels.com/photos/25742763/pexels-photo-25742763/free-photo-of-creative-pre-wedding-photoshoot-fotographiya.jpeg?auto=compress&cs=tinysrgb&w=800",
                title: "Heritage Wedding",
                names: "Meera & Rohan",
                city: "Udaipur",
                style: "Heritage",
                span: "",
                aspect: "aspect-square",
              },
              {
                img: "https://images.pexels.com/photos/169214/pexels-photo-169214.jpeg?auto=compress&cs=tinysrgb&w=800",
                title: "Sunset Ceremony",
                names: "Aisha & Ishaan",
                city: "Goa",
                style: "Coastal",
                span: "",
                aspect: "aspect-square",
              },
            ].map((wedding, i) => (
              <Link key={i} href="/weddings" className={wedding.span}>
                <div className="group cursor-pointer h-full">
                  <div className={`overflow-hidden relative ${wedding.aspect} ${wedding.span ? 'h-full min-h-[480px]' : ''} border border-white/5 group-hover:border-primary/40 transition-colors duration-500`}>
                    <img
                      src={wedding.img}
                      alt={wedding.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-primary bg-black/50 border border-primary/30 px-2 py-1 backdrop-blur-sm">
                        {wedding.style}
                      </span>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="font-cinzel text-[10px] tracking-[0.15em] text-white/80 uppercase mb-1">{wedding.title}</h3>
                      <p className="font-cormorant italic text-xl md:text-2xl text-primary mb-1 leading-tight">{wedding.names}</p>
                      <p className="font-manrope text-xs text-white/65 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary/50 shrink-0" /> {wedding.city}
                      </p>
                    </div>
                  </div>
                </div>
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

      {/* SECTION 6B: MOMENTS WE CREATED */}
      <section className="py-16 md:py-32 px-6 md:px-12 bg-[#030201] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.05) 0%, transparent 65%)" }} />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-6 md:gap-8">
            <div>
              <p className="font-cinzel text-[11px] sm:text-[13px] tracking-[0.3em] sm:tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Our Work ✦</p>
              <div className="gold-line w-16 mb-6" />
              <h2 className="font-playfair text-4xl sm:text-5xl md:text-7xl lg:text-[100px] text-white font-normal italic leading-[0.9]">
                Moments<br />
                <span className="text-primary">We Created</span>
              </h2>
            </div>
            <p className="font-poppins text-white/45 text-sm leading-relaxed max-w-xs">
              Every celebration is a story. Every photograph, a memory sealed in gold. We don't plan events — we craft chapters that last forever.
            </p>
          </div>

          {/* Asymmetric 4-image grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3" style={{ height: "clamp(360px, 55vw, 680px)" }}>
            <div className="md:row-span-2 overflow-hidden relative group img-zoom border border-white/10 hover:border-primary/40 transition-colors duration-500">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=90" className="w-full h-full object-cover brightness-95" alt="Royal Wedding" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="font-cinzel text-[8px] tracking-[0.3em] uppercase text-primary bg-black/50 px-2.5 py-1 border border-primary/40 backdrop-blur-sm">Royal Wedding</span>
                <p className="font-cormorant italic text-2xl text-white mt-3 leading-tight drop-shadow-lg">Udaipur Palace</p>
              </div>
            </div>
            <div className="overflow-hidden relative group img-zoom border border-white/10 hover:border-primary/40 transition-colors duration-500">
              <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=90" className="w-full h-full object-cover brightness-100" alt="Floral Décor" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="font-cinzel text-[7px] tracking-[0.28em] uppercase text-primary bg-black/50 px-2 py-1 border border-primary/40 backdrop-blur-sm">Floral Décor</span>
              </div>
            </div>
            <div className="overflow-hidden relative group img-zoom border border-white/10 hover:border-primary/40 transition-colors duration-500">
              <img src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&q=90" className="w-full h-full object-cover brightness-100" alt="Photography" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="font-cinzel text-[7px] tracking-[0.28em] uppercase text-primary bg-black/50 px-2 py-1 border border-primary/40 backdrop-blur-sm">Photography</span>
              </div>
            </div>
            <div className="col-span-2 md:col-span-2 overflow-hidden relative group img-zoom border border-white/10 hover:border-primary/40 transition-colors duration-500">
              <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1400&q=90" className="w-full h-full object-cover brightness-100" alt="Destination Wedding" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <span className="font-cinzel text-[7px] tracking-[0.28em] uppercase text-primary bg-black/50 px-2.5 py-1 border border-primary/40 backdrop-blur-sm">Destination Wedding</span>
                  <p className="font-cormorant italic text-2xl text-white mt-2 drop-shadow-lg">Goa Beach Ceremony</p>
                </div>
                <Link href="/events">
                  <button className="font-cinzel text-[9px] tracking-[0.2em] uppercase px-4 py-2.5 border border-primary/70 text-primary hover:bg-primary hover:text-black transition-all duration-300 backdrop-blur-sm">
                    View Story
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Impact numbers */}
          <div className="mt-8 grid grid-cols-3 border border-white/8">
            {[
              { num: "500+", label: "Events Created",     note: "Across India & abroad" },
              { num: "98%",  label: "Client Satisfaction", note: "Verified post-event surveys" },
              { num: "63K+", label: "Lives Touched",       note: "Couples, families & guests" },
            ].map((s, i) => (
              <div key={i} className={`py-8 px-6 text-center ${i < 2 ? "border-r border-white/8" : ""}`}>
                <div className="font-playfair text-4xl md:text-5xl text-primary italic mb-1">{s.num}</div>
                <div className="font-cinzel text-[9px] tracking-[0.2em] text-white uppercase mb-1">{s.label}</div>
                <div className="font-poppins text-xs text-white/30">{s.note}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/events">
              <button className="px-12 py-4 border border-primary/50 text-primary font-cinzel font-semibold text-[10px] tracking-[0.28em] uppercase hover:bg-primary hover:text-black transition-all duration-300 inline-flex items-center gap-3">
                Explore Our Full Portfolio <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: STATS COUNTER */}
      <section className="py-24 bg-black relative border-y border-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_60%)] pointer-events-none" />
        {/* Ambient video overlay */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover scale-110">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-golden-confetti-falling-1-large.mp4" type="video/mp4" />
          </video>
        </div>
        <div ref={statsRef} className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: "6,346+", label: "Verified Vendors",  icon: "✦" },
              { num: "76+",    label: "Cities Covered",    icon: "◈" },
              { num: "63,346+",label: "Happy Couples",     icon: "♡" },
              { num: "436",    label: "Wedding Venues",    icon: "◇" },
            ].map((stat, i) => (
              <TiltCard key={i} max={4} scale={1.03} glare>
                <div className="glass-gold rounded-sm p-8 md:p-10 flex flex-col items-center justify-center text-center gap-3 h-full">
                  <span className="font-cinzel text-primary/50 text-lg mb-1">{stat.icon}</span>
                  <AnimatedCounter
                    value={stat.num}
                    duration={2.4}
                    className="text-4xl md:text-5xl font-cinzel text-shimmer leading-none counter-pulse"
                  />
                  <div className="font-manrope text-white/65 text-[10px] uppercase tracking-[0.3em] font-medium">{stat.label}</div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7B: HOW IT WORKS */}
      <section className="py-16 md:py-28 px-6 md:px-12 bg-[#050403] relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10 md:mb-20">
            <p className="font-cinzel text-[11px] sm:text-[13px] tracking-[0.3em] sm:tracking-[0.45em] text-primary/80 uppercase mb-4">✦ The Journey ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-normal drop-shadow-[0_0_35px_rgba(212,175,55,0.45)]">
              How It <span className="text-primary italic font-semibold">Works</span>
            </h2>
            <p className="font-manrope text-white/72 text-base font-light mt-4 max-w-lg mx-auto leading-relaxed">
              From your first search to your last dance — we make every step effortless.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
              {[
                {
                  num: "01",
                  icon: "🔍",
                  title: "Search & Discover",
                  desc: "Browse 6,346+ verified vendors and 436 curated venues across 76 Indian cities.",
                  color: "#d4af37",
                },
                {
                  num: "02",
                  icon: "❤️",
                  title: "Compare & Shortlist",
                  desc: "Read genuine reviews, compare packages side-by-side, and save your favourites.",
                  color: "#e8a4c8",
                },
                {
                  num: "03",
                  icon: "📋",
                  title: "Book & Secure",
                  desc: "Select your package, confirm the date, and pay a refundable ₹2,000 advance in minutes.",
                  color: "#50e3c2",
                },
                {
                  num: "04",
                  icon: "🎊",
                  title: "Celebrate in Style",
                  desc: "Sit back and let India's finest wedding professionals create your unforgettable day.",
                  color: "#4ade80",
                },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  {/* Step number circle */}
                  <div className="relative mb-8">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center relative border transition-all duration-500 group-hover:scale-105"
                      style={{ backgroundColor: step.color + "12", borderColor: step.color + "40", boxShadow: `0 0 40px ${step.color}15` }}
                    >
                      <span className="text-3xl">{step.icon}</span>
                      <div
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center font-cinzel text-[10px] font-bold"
                        style={{ backgroundColor: step.color, color: "#000" }}
                      >
                        {step.num}
                      </div>
                    </div>
                  </div>
                  <h3 className="font-cinzel text-sm tracking-[0.1em] uppercase mb-3" style={{ color: step.color }}>{step.title}</h3>
                  <p className="font-manrope text-white/72 text-sm leading-relaxed font-light max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/vendors">
              <button className="px-10 py-4 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.25em] uppercase hover:bg-primary/90 transition-all duration-300 gold-glow rounded-sm">
                Start Your Search
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7C: STORIES BEHIND EVERY CELEBRATION */}
      <section className="py-16 md:py-32 px-6 md:px-12 bg-[#080604] border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(212,175,55,0.05) 0%, transparent 55%)" }} />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-20">
            <p className="font-cinzel text-[11px] sm:text-[13px] tracking-[0.3em] sm:tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Case Studies ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="font-playfair text-4xl sm:text-5xl md:text-7xl lg:text-[100px] text-white font-normal italic leading-[0.9] mb-5">
              Stories Behind Every<br />
              <span className="text-primary">Celebration</span>
            </h2>
            <p className="font-poppins text-white/40 text-base max-w-lg mx-auto leading-relaxed">
              Not just events. Chapters in love stories, milestones, and memories that outlast every season.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=85",
                tag: "Destination Wedding",
                title: "A Rajasthani Love Story",
                names: "Priya & Rahul",
                city: "Rambagh Palace, Jaipur",
                excerpt: "Two souls, 400 guests, one palace. We turned a royal dream into a night the world envied.",
                href: "/events/royal-rajasthani-wedding",
              },
              {
                img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85",
                tag: "Beach Wedding",
                title: "Where the Ocean Said I Do",
                names: "Aisha & Vikram",
                city: "Goa Coastline",
                excerpt: "Sunset vows, barefoot dances, and a ceremony written in sea-salt and starlight.",
                href: "/events/goa-beach-wedding",
              },
              {
                img: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=85",
                tag: "Corporate Gala",
                title: "A Night of Pure Elegance",
                names: "Fortune 500 Annual",
                city: "Taj Mahal Palace, Mumbai",
                excerpt: "600 leaders. One night. We orchestrated an awards gala that redefined corporate prestige.",
                href: "/events",
              },
            ].map((story, i) => (
              <Link key={i} href={story.href}>
                <TiltCard max={4} glare>
                  <div className="group cursor-pointer overflow-hidden border border-white/6 hover:border-primary/25 transition-colors duration-500">
                    <div className="relative h-64 overflow-hidden img-zoom">
                      <img src={story.img} alt={story.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080604]/90 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="font-cinzel text-[8px] tracking-[0.25em] uppercase text-primary bg-black/70 border border-primary/30 px-2.5 py-1 backdrop-blur-sm">{story.tag}</span>
                      </div>
                    </div>
                    <div className="p-7 bg-[#0a0806]">
                      <p className="font-cinzel text-[9px] tracking-[0.22em] text-primary/60 uppercase mb-2">{story.names} · {story.city}</p>
                      <h3 className="font-playfair text-2xl text-white italic mb-3 leading-tight group-hover:text-primary transition-colors">{story.title}</h3>
                      <p className="font-poppins text-sm text-white/40 leading-relaxed mb-5">{story.excerpt}</p>
                      <div className="flex items-center gap-2 font-cinzel text-[9px] tracking-[0.2em] uppercase text-primary font-semibold group-hover:gap-3 transition-all">
                        Read This Story <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link href="/events">
              <button className="px-12 py-4 bg-primary text-black font-cinzel font-bold text-[10px] tracking-[0.28em] uppercase hover:bg-primary/90 transition-all gold-glow inline-flex items-center gap-3">
                Explore All 9 Stories <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 8: WEDDING MAGAZINE */}
      <section className="py-16 md:py-28 px-6 md:px-12 bg-[#080604]">
        <div className="max-w-7xl mx-auto">
          <div ref={magazineHeadRef} className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-16">
            <div className="flex-1">
              <p className="font-cinzel text-[11px] sm:text-[13px] tracking-[0.3em] sm:tracking-[0.45em] text-primary/80 uppercase mb-4">✦ The Editorial ✦</p>
              <div className="gold-line w-16 mb-6" />
              <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-normal drop-shadow-[0_0_35px_rgba(212,175,55,0.45)]">
                Wedding <span className="text-primary italic font-semibold">Magazine</span>
              </h2>
            </div>
            <Link href="/blog" className="hidden md:inline-flex items-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-primary font-semibold hover:text-white transition-colors">
              All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div ref={magazineGridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Post — spans 2 columns */}
            <Link href="/blog" className="lg:col-span-2">
              <div className="group cursor-pointer h-full flex flex-col">
                <div className="overflow-hidden h-[420px] mb-6 relative border border-white/5 group-hover:border-primary/40 transition-all duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1000&q=85"
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
                  <span className="font-manrope font-light text-xs text-white/65">5 min read</span>
                  <span className="font-manrope font-light text-xs text-white/55">May 2026</span>
                </div>
                <h3 className="font-cormorant text-4xl text-white font-medium mb-3 group-hover:text-primary transition-colors leading-tight">
                  15 Stunning Lehenga Trends for 2026 Brides
                </h3>
                <p className="font-manrope text-white/72 text-sm font-light leading-relaxed mb-5 flex-grow">
                  From hand-embroidered Banarasi silk to contemporary mirror-work silhouettes — our fashion editors curate this season's most coveted bridal looks.
                </p>
                <div className="flex items-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">
                  Read Article <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Side articles */}
            <div className="flex flex-col gap-7">
              {[
                {
                  img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=85",
                  tag: "Planning",
                  title: "How to Plan Your Wedding Budget Without Stress",
                  time: "7 min read",
                },
                {
                  img: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=85",
                  tag: "Décor",
                  title: "Minimalist Décor Ideas That Look Expensive",
                  time: "4 min read",
                },
                {
                  img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=85",
                  tag: "Photography",
                  title: "Golden Hour Portraits: Tips From Top Wedding Photographers",
                  time: "6 min read",
                },
              ].map((post, i) => (
                <Link key={i} href="/blog">
                  <div className="group cursor-pointer flex gap-4">
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
                        <span className="font-manrope text-[10px] text-white/60">{post.time}</span>
                      </div>
                      <h3 className="font-cormorant text-lg text-white font-medium leading-snug group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </div>
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
      <section className="py-16 md:py-28 px-6 md:px-12 bg-[#050403] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div ref={testHeadRef} className="mb-10 md:mb-20 text-center">
            <p className="font-cinzel text-[11px] sm:text-[13px] tracking-[0.3em] sm:tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Client Words ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="font-playfair text-4xl sm:text-5xl md:text-7xl lg:text-[100px] text-white font-normal italic leading-[0.9] mb-6">
              Turning Dreams<br />
              <span className="text-primary">Into Experiences</span>
            </h2>
            <p className="font-poppins text-white/40 text-base max-w-xl mx-auto leading-relaxed">
              Don't take our word for it — hear from the couples who trusted us with the most important day of their lives.
            </p>
          </div>

          <div ref={testGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "The planning was flawless. Every detail was curated with such precision and elegance. Our guests are still talking about the magnificent decor and seamless experience.", name: "Rohan & Sneha", date: "Married in Jaipur" },
              { text: "Finding vendors through BMS was the best decision. The platform's luxury partners delivered beyond our wildest expectations. A truly 5-star experience from start to finish.", name: "Vikram & Aisha", date: "Married in Udaipur" },
              { text: "They understood our vision for a minimalist yet opulent celebration immediately. The venue recommendation was breathtaking and the execution was pure perfection.", name: "Karan & Meera", date: "Married in Goa" }
            ].map((review, i) => (
              <TiltCard key={i} max={5} scale={1.02} glare>
                <div className="luxury-card glass-card p-10 flex flex-col items-center text-center rounded-sm relative overflow-hidden h-full">
                  <div className="font-cormorant text-8xl text-primary/20 absolute top-4 left-6 leading-none">"</div>
                  <div className="flex gap-1 mb-8 mt-4">
                    {[1,2,3,4,5].map(star => <span key={star} className="text-primary text-sm">★</span>)}
                  </div>
                  <p className="font-cormorant italic text-xl text-white/80 leading-relaxed mb-10 flex-grow relative z-10">{review.text}</p>
                  <div className="w-16 h-px bg-primary/40 mb-6" />
                  <h4 className="font-cinzel text-sm text-primary uppercase tracking-[0.1em] mb-1">{review.name}</h4>
                  <p className="font-manrope text-xs text-white/65 font-light">{review.date}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: PARTNER BRANDS MARQUEE */}
      <section className="py-16 bg-[#0a0806] border-y border-white/5 overflow-hidden">
        <div className="text-center mb-10">
          <p className="font-cinzel text-sm tracking-[0.4em] text-primary/70 uppercase">✦ Trusted By India's Finest ✦</p>
        </div>
        {[
          ["Taj Hotels","The Oberoi","ITC Hotels","The Leela","JW Marriott","Hyatt India","Rambagh Palace","Umaid Bhawan","Samode Palace","RAAS Hotels","Aman Resorts","Suryagarh"],
          ["Wilderness Resorts","Joseph Radhik","Tasveer Studios","Wizcraft Events","Percept Live","Ambika Pillai Studio","Mickey Contractor","E-Factor Events","The Park Hotels","Conrad Hotels","Shaadi Squad","Sabyasachi"],
        ].map((row, rowIdx) => (
          <div key={rowIdx} className="relative mb-4 last:mb-0">
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg,#0a0806,transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg,#0a0806,transparent)" }} />
            <div className="marquee-outer">
              <div className={`marquee-track${rowIdx % 2 === 1 ? " marquee-reverse" : ""}`}>
                {[...row, ...row].map((brand, i) => (
                  <div key={i} className="marquee-item">
                    <span className="font-cinzel text-[11px] tracking-[0.28em] uppercase text-white/25 hover:text-primary/70 transition-colors duration-300 whitespace-nowrap cursor-default">
                      {brand}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* SECTION 11: VENDOR CTA */}
      <section className="bg-[#080604] border-y border-white/10">
        <div className="flex flex-col md:flex-row">
          <div ref={ctaTextRef} className="w-full md:w-1/2 p-8 sm:p-12 md:p-24 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            <p className="font-cinzel text-[11px] sm:text-[13px] tracking-[0.3em] sm:tracking-[0.45em] text-primary/80 uppercase mb-4">✦ Join The Network ✦</p>
            <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-normal leading-tight mb-6 md:mb-8 drop-shadow-[0_0_35px_rgba(212,175,55,0.45)]">
              Are you a <span className="text-primary italic font-semibold">Premium</span> Vendor?
            </h2>
            <ul className="space-y-3 md:space-y-4 mb-8 md:mb-12">
              {[
                "Showcase your portfolio to high-net-worth clients",
                "Receive verified, quality leads",
                "Join an exclusive network of luxury professionals"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 md:gap-4">
                  <div className="w-1 h-1 bg-primary rounded-full mt-2.5 shadow-[0_0_8px_rgba(212,175,55,0.8)] shrink-0" />
                  <span className="font-manrope text-white/70 font-light text-base md:text-lg">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/list-your-business">
              <button className="self-start px-8 py-4 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all duration-300 gold-glow rounded-sm">
                List Your Business
              </button>
            </Link>
          </div>

          <div ref={ctaImgRef} className="w-full md:w-1/2 min-h-[400px] md:min-h-full relative">
            <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80" alt="Luxury Event" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080604] to-transparent md:via-transparent md:to-transparent" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
