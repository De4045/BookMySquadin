import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Users, Star, ArrowRight, Filter, Search, ChevronRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VendorDetailModal, type VendorLike } from "@/components/VendorDetailModal";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

interface CityMeta {
  displayName: string;
  state: string;
  tagline: string;
  description: string;
  hero: string;
  highlights: string[];
  categories: string[];
  accentColor: string;
}

const CITY_META: Record<string, CityMeta> = {
  mumbai: {
    displayName: "Mumbai",
    state: "Maharashtra",
    tagline: "Where Dreams Become Grand Celebrations",
    description: "Mumbai — India's city of dreams — offers an unparalleled wedding scene. From sea-facing banquet halls in Juhu to intimate rooftop soirées in Bandra, Mumbai's vendors bring cinematic flair to every celebration. Bollywood-style photography, world-class catering, and avant-garde decor await you.",
    hero: "https://images.pexels.com/photos/3889767/pexels-photo-3889767.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop",
    highlights: ["50+ Premium Venues", "Bollywood Photographers", "5-Star Catering"],
    categories: ["PHOTOGRAPHER", "CATERER", "DECOR", "MAKEUP ARTIST", "MUSIC & DJ", "WEDDING PLANNERS"],
    accentColor: "#d4af37",
  },
  delhi: {
    displayName: "Delhi",
    state: "NCR",
    tagline: "Timeless Elegance Meets Royal Grandeur",
    description: "Delhi and the NCR region host India's most opulent weddings. From sprawling farmhouse celebrations in Chattarpur to heritage hotel ceremonies in Connaught Place, Delhi's vendors specialise in large-scale royal affairs that blend tradition with contemporary luxury.",
    hero: "https://images.pexels.com/photos/2438220/pexels-photo-2438220.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop",
    highlights: ["Heritage Venues", "Royal Catering", "Grand Scale Productions"],
    categories: ["WEDDING PLANNERS", "DECOR", "CATERER", "PHOTOGRAPHER", "SOUND & LIGHT", "TRANSPORT"],
    accentColor: "#c9a96e",
  },
  jaipur: {
    displayName: "Jaipur",
    state: "Rajasthan",
    tagline: "Palace Weddings in the Pink City",
    description: "Jaipur is India's most coveted destination wedding city. Haveli courtyards, palace banquet halls, and marigold-draped mandaps make every ceremony feel like royalty. Jaipur's artisans, musicians, and culinary masters bring authentic Rajasthani grandeur to your day.",
    hero: "https://images.pexels.com/photos/3734782/pexels-photo-3734782.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop",
    highlights: ["Palace Venues", "Folk Entertainment", "Traditional Rajasthani Cuisine"],
    categories: ["WEDDING PLANNERS", "PHOTOGRAPHER", "DECOR", "MUSIC & DJ", "CATERER", "ANCHOR"],
    accentColor: "#e8a4c8",
  },
  bangalore: {
    displayName: "Bangalore",
    state: "Karnataka",
    tagline: "Modern Love in the Garden City",
    description: "Bangalore blends South Indian tradition with cosmopolitan sophistication. Tech-savvy couples choose Bangalore for its stunning garden venues, innovative photographers who blend South Indian rituals with contemporary aesthetics, and a thriving event management scene that knows how to execute perfection.",
    hero: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop",
    highlights: ["Garden Venues", "Tech-Forward Planning", "South Indian Specialists"],
    categories: ["PHOTOGRAPHER", "CATERER", "DECOR", "MAKEUP ARTIST", "WEDDING PLANNERS", "MUSIC & DJ"],
    accentColor: "#50e3c2",
  },
  hyderabad: {
    displayName: "Hyderabad",
    state: "Telangana",
    tagline: "Nawabi Splendour for Your Special Day",
    description: "Hyderabad — the City of Pearls — brings Nawabi elegance to every wedding. With its legendary biryani catering, intricate floral decor inspired by Charminar architecture, and venues that echo the grandeur of the Nizams, a Hyderabad wedding is an experience guests never forget.",
    hero: "https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop",
    highlights: ["Nawabi Cuisine", "Heritage Venues", "Grand Decor"],
    categories: ["CATERER", "DECOR", "PHOTOGRAPHER", "WEDDING PLANNERS", "MUSIC & DJ", "MAKEUP ARTIST"],
    accentColor: "#f5a623",
  },
  chennai: {
    displayName: "Chennai",
    state: "Tamil Nadu",
    tagline: "Classical Traditions, Contemporary Celebrations",
    description: "Chennai is the heart of classical South Indian weddings. From elaborate Kanchipuram silk ceremonies to modern fusion receptions, Chennai's vendors blend rich Dravidian tradition with contemporary sensibility. Renowned for meticulous planning and exquisite floral arrangements.",
    hero: "https://images.pexels.com/photos/3755916/pexels-photo-3755916.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop",
    highlights: ["Classical Ceremonies", "Floral Specialists", "Cultural Authenticity"],
    categories: ["WEDDING PLANNERS", "PHOTOGRAPHER", "CATERER", "DECOR", "MEHENDI", "MAKEUP ARTIST"],
    accentColor: "#bd10e0",
  },
  kolkata: {
    displayName: "Kolkata",
    state: "West Bengal",
    tagline: "Bengali Elegance with Timeless Warmth",
    description: "Kolkata weddings are legendary for their warmth, music, and artistic flair. The city's cultural richness shines through in its unique decor traditions, live orchestras, and culinary heritage featuring the finest Bengali sweets. A Kolkata wedding is a celebration of art and culture.",
    hero: "https://images.pexels.com/photos/8819817/pexels-photo-8819817.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop",
    highlights: ["Artistic Decor", "Live Orchestras", "Bengali Cuisine"],
    categories: ["CATERER", "DECOR", "PHOTOGRAPHER", "MUSIC & DJ", "ANCHOR", "WEDDING PLANNERS"],
    accentColor: "#60a5fa",
  },
  goa: {
    displayName: "Goa",
    state: "Goa",
    tagline: "Beach & Bliss — India's Destination Wedding Paradise",
    description: "Goa is India's most glamorous destination wedding location. Beachfront ceremonies, Portuguese colonial venues, sundowner receptions, and a vibrant party culture make Goa the first choice for couples seeking a relaxed yet spectacular celebration.",
    hero: "https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop",
    highlights: ["Beachfront Venues", "Destination Weddings", "Sundowner Parties"],
    categories: ["PHOTOGRAPHER", "DECOR", "CATERER", "MUSIC & DJ", "WEDDING PLANNERS", "HOSPITALITY"],
    accentColor: "#4ade80",
  },
  pune: {
    displayName: "Pune",
    state: "Maharashtra",
    tagline: "Cultured Celebrations in the Oxford of the East",
    description: "Pune offers a perfect blend of Maratha tradition and modern sophistication. Hill-station venues, vineyard weddings, and a thriving young vendor community make Pune an increasingly popular wedding destination for couples seeking something beyond the ordinary.",
    hero: "https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop",
    highlights: ["Vineyard Venues", "Modern Planners", "Marathi Traditions"],
    categories: ["PHOTOGRAPHER", "CATERER", "DECOR", "WEDDING PLANNERS", "MUSIC & DJ", "MAKEUP ARTIST"],
    accentColor: "#a78bfa",
  },
  udaipur: {
    displayName: "Udaipur",
    state: "Rajasthan",
    tagline: "The Venice of the East — Lakeside Palace Weddings",
    description: "Udaipur is arguably the most romantic wedding destination in all of India. Lake Palace ceremonies, City Palace receptions, and the spectacular Aravalli backdrop create an unmatched fairytale setting. Udaipur vendors specialise exclusively in destination weddings of the highest calibre.",
    hero: "https://images.pexels.com/photos/3998368/pexels-photo-3998368.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop",
    highlights: ["Lake Palace Venues", "Destination Specialists", "Luxury Experiences"],
    categories: ["WEDDING PLANNERS", "PHOTOGRAPHER", "DECOR", "CATERER", "MUSIC & DJ", "TRANSPORT"],
    accentColor: "#fb923c",
  },
  chandigarh: {
    displayName: "Chandigarh",
    state: "Punjab",
    tagline: "Punjabi Shaadi Magic in the City Beautiful",
    description: "Chandigarh brings the legendary warmth and grandeur of Punjabi weddings in a beautifully planned city. Bhangra performances, lavish multi-day celebrations, exquisite Phulkari decor, and some of India's most joyful wedding vendors await you in the City Beautiful.",
    hero: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop",
    highlights: ["Punjabi Shaadi", "Multi-Day Celebrations", "Bhangra Entertainment"],
    categories: ["CATERER", "DECOR", "MUSIC & DJ", "PHOTOGRAPHER", "CHOREOGRAPHER", "MAKEUP ARTIST"],
    accentColor: "#f87171",
  },
  ahmedabad: {
    displayName: "Ahmedabad",
    state: "Gujarat",
    tagline: "Vibrant Gujarati Weddings with Heritage Charm",
    description: "Ahmedabad celebrates weddings with unmatched vibrancy and community spirit. From traditional Garba nights to elaborate Saptapadi ceremonies, the city's vendors are masters of Gujarati wedding traditions. Heritage pol house venues and modern banquet halls offer every style.",
    hero: "https://images.pexels.com/photos/8819771/pexels-photo-8819771.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop",
    highlights: ["Garba Nights", "Heritage Venues", "Gujarati Traditions"],
    categories: ["CATERER", "DECOR", "MUSIC & DJ", "PHOTOGRAPHER", "WEDDING PLANNERS", "MEHENDI"],
    accentColor: "#facc15",
  },
};

const CAT_ICONS: Record<string, string> = {
  "PHOTOGRAPHER": "📸",
  "CATERER": "🍽",
  "DECOR": "🌸",
  "MAKEUP ARTIST": "💄",
  "MUSIC & DJ": "🎵",
  "WEDDING PLANNERS": "📋",
  "MEHENDI": "🪷",
  "CHOREOGRAPHER": "💃",
  "ANCHOR": "🎤",
  "SOUND & LIGHT": "💡",
  "TRANSPORT": "🚗",
  "HOSPITALITY": "🏨",
  "FASHION DESIGNER": "👗",
  "TRAVEL": "✈",
  "PRODUCTION": "🎬",
};

interface Vendor {
  name: string;
  company?: string;
  category: string;
  city?: string;
  state?: string;
  contact?: string;
}

const CITIES_LIST = Object.keys(CITY_META);

export default function CityLanding() {
  const params = useParams<{ city: string }>();
  const citySlug = params.city?.toLowerCase() ?? "";
  const meta = CITY_META[citySlug];

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<VendorLike | null>(null);
  const [similarVendors, setSimilarVendors] = useState<VendorLike[]>([]);

  useEffect(() => {
    if (!meta) { setLoading(false); return; }
    setLoading(true);
    fetch(`${BASE}/api/vendors?city=${encodeURIComponent(meta.displayName)}`)
      .then(r => r.json())
      .then((d: { vendors: Vendor[]; cities: string[] }) => {
        setVendors(d.vendors ?? []);
        setAllCities(d.cities ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [citySlug]);

  useEffect(() => {
    if (!selected) return;
    const same = vendors.filter(v =>
      v.category.toUpperCase() === selected.category.toUpperCase() && v.name !== selected.name
    ).slice(0, 3);
    setSimilarVendors(same);
  }, [selected, vendors]);

  const categories = ["ALL", ...Array.from(new Set(vendors.map(v => v.category.toUpperCase()))).sort()];
  const filtered = vendors.filter(v => {
    const catMatch = selectedCategory === "ALL" || v.category.toUpperCase() === selectedCategory;
    const searchMatch = !search || [v.name, v.company, v.category].join(" ").toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const otherCities = CITIES_LIST.filter(c => c !== citySlug);

  if (!meta) {
    return (
      <div className="min-h-screen bg-[#080604] text-white">
        <Navbar />
        <div className="pt-40 text-center px-6">
          <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-4">City Not Found</p>
          <h1 className="font-cormorant text-4xl text-white mb-6">We don't have a dedicated page for <span className="text-primary italic">{params.city}</span> yet</h1>
          <p className="font-manrope text-white/50 mb-8">Browse vendors in all cities from our directory.</p>
          <Link href={`/vendors?city=${params.city}`}>
            <button className="px-8 py-3 bg-primary text-black font-cinzel font-bold text-sm tracking-[0.2em] uppercase hover:bg-primary/90 transition-all">
              Browse {params.city} Vendors →
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080604] text-white">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={meta.hero} alt={meta.displayName} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080604] via-[#080604]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080604]/70 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col items-start justify-end pb-16 px-6 md:px-16 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-cinzel text-[10px] tracking-[0.4em] text-primary uppercase">{meta.state}, India</span>
            </div>
            <h1 className="font-cormorant text-5xl md:text-7xl font-light text-white leading-none mb-3">
              {meta.displayName.split("").map((char, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, duration: 0.4 }}>
                  {char}
                </motion.span>
              ))}
            </h1>
            <p className="font-cormorant text-2xl md:text-3xl italic text-primary/80 mb-6">{meta.tagline}</p>
            <div className="flex items-center gap-6 flex-wrap">
              {meta.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  <span className="font-manrope text-sm text-white/60">{h}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {loading ? null : (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="absolute bottom-6 right-6 md:right-16 flex items-center gap-3 px-5 py-3 bg-black/60 border border-primary/25 backdrop-blur-sm"
          >
            <Users className="w-4 h-4 text-primary" />
            <span className="font-cormorant text-2xl text-primary font-semibold">{vendors.length}</span>
            <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/50 uppercase">Vendors Listed</span>
          </motion.div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">

        {/* City description */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          <div className="lg:col-span-2">
            <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-3">About {meta.displayName} Weddings</p>
            <p className="font-cormorant text-xl text-white/75 leading-relaxed">{meta.description}</p>
            <div className="mt-6 flex gap-3">
              <Link href={`/vendors?city=${meta.displayName}`}>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-cinzel font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-primary/90 transition-all">
                  All {meta.displayName} Vendors <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
              <Link href="/venues">
                <button className="flex items-center gap-2 px-5 py-2.5 border border-primary/30 text-primary font-cinzel text-[10px] tracking-[0.2em] uppercase hover:bg-primary/8 transition-all">
                  Venues →
                </button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {meta.categories.slice(0, 4).map(cat => {
              const count = vendors.filter(v => v.category.toUpperCase() === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="p-4 bg-[#1a1510] border border-white/8 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="text-xl mb-2">{CAT_ICONS[cat] ?? "✦"}</div>
                  <p className="font-cinzel text-[9px] tracking-[0.15em] text-white/60 uppercase group-hover:text-primary transition-colors">{cat}</p>
                  <p className="font-cormorant text-2xl text-primary font-semibold mt-1">{count > 0 ? count : "—"}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* AI Assistant prompt */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mb-10 p-5 bg-primary/5 border border-primary/20 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/15 border border-primary/30 rounded-sm flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-cinzel text-[9px] tracking-[0.2em] text-primary uppercase mb-1">AI Wedding Assistant</p>
            <p className="font-manrope text-sm text-white/60">
              Ask our AI: <span className="text-primary/80 italic">"What vendors do I need for a 300-person wedding in {meta.displayName}?"</span>
            </p>
          </div>
          <button
            onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="Open BMS Assistant"]')?.click()}
            className="ml-auto shrink-0 flex items-center gap-2 px-4 py-2 bg-primary text-black font-cinzel text-[9px] tracking-[0.15em] uppercase font-bold hover:bg-primary/90 transition-all"
          >
            Ask Now <ChevronRight className="w-3 h-3" />
          </button>
        </motion.div>

        {/* Category filter + Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search vendors in ${meta.displayName}…`}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1a1510] border border-white/10 text-white text-sm font-manrope focus:outline-none focus:border-primary/50 placeholder:text-white/25"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-3.5 h-3.5 text-white/30 shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 font-cinzel text-[8px] tracking-[0.15em] uppercase whitespace-nowrap border transition-all shrink-0 ${
                  selectedCategory === cat
                    ? "bg-primary text-black border-primary"
                    : "border-white/12 text-white/40 hover:border-primary/30 hover:text-white/70"
                }`}
              >
                {cat === "ALL" ? "All" : CAT_ICONS[cat] ? `${CAT_ICONS[cat]} ${cat}` : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Vendor grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-32 bg-[#1a1510] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#1a1510] border border-white/8">
            <p className="font-cormorant text-2xl text-white/40 mb-2">No vendors found</p>
            <p className="font-manrope text-sm text-white/25">Try a different category or search term.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="font-cinzel text-[9px] tracking-[0.2em] text-white/30 uppercase">{filtered.length} vendors</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((vendor, i) => {
                const cat = vendor.category.toUpperCase();
                return (
                  <motion.div
                    key={`${vendor.name}-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.4) }}
                    onClick={() => setSelected(vendor)}
                    className="group relative bg-[#1a1510] border border-white/8 p-5 cursor-pointer hover:border-primary/30 hover:bg-[#1e1812] transition-all"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-lg shrink-0">
                        {CAT_ICONS[cat] ?? "✦"}
                      </div>
                      <span className="font-cinzel text-[7.5px] tracking-[0.15em] text-primary/60 uppercase border border-primary/20 px-2 py-0.5">{cat}</span>
                    </div>
                    <h3 className="font-cormorant text-lg text-white font-semibold leading-tight mb-1 group-hover:text-primary transition-colors">
                      {vendor.name}
                    </h3>
                    {vendor.company && vendor.company !== vendor.name && (
                      <p className="font-manrope text-xs text-white/40 mb-2">{vendor.company}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-primary/40" />
                      <span className="font-manrope text-xs text-white/35">{vendor.city || meta.displayName}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className="w-2.5 h-2.5" fill={s <= 4 ? "#d4af37" : "none"} stroke="#d4af37" />
                        ))}
                      </div>
                      <span className="font-cinzel text-[8px] tracking-[0.1em] text-primary/50 uppercase opacity-0 group-hover:opacity-100 transition-opacity">View Profile →</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* Other Cities */}
        <div className="mt-20 pt-12 border-t border-white/8">
          <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-2">✦ Explore Other Cities ✦</p>
          <h2 className="font-cormorant text-3xl text-white font-light mb-8">Weddings Across <span className="text-primary italic">India</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {otherCities.map(slug => {
              const c = CITY_META[slug];
              return (
                <Link key={slug} href={`/vendors/${slug}`}>
                  <div className="group relative h-32 overflow-hidden cursor-pointer border border-white/8 hover:border-primary/35 transition-all">
                    <img src={c.hero} alt={c.displayName} className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <p className="font-cormorant text-lg text-white font-semibold leading-tight">{c.displayName}</p>
                      <p className="font-cinzel text-[7.5px] tracking-[0.15em] text-white/40 uppercase">{c.state}</p>
                    </div>
                    <ChevronRight className="absolute right-3 bottom-3 w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center py-16 border border-white/8 bg-[#1a1510]">
          <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-3">✦ Ready to Begin? ✦</p>
          <h2 className="font-cormorant text-4xl text-white font-light mb-4">
            Plan Your <span className="text-primary italic">{meta.displayName}</span> Wedding
          </h2>
          <p className="font-manrope text-white/45 text-sm mb-8 max-w-md mx-auto">
            Browse {vendors.length}+ verified vendors in {meta.displayName} or list your own business to reach thousands of couples.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href={`/vendors?city=${meta.displayName}`}>
              <button className="px-8 py-3 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.25em] uppercase hover:bg-primary/90 transition-all gold-glow">
                Browse All Vendors
              </button>
            </Link>
            <Link href="/list-your-business">
              <button className="px-8 py-3 border border-primary/30 text-primary font-cinzel text-xs tracking-[0.25em] uppercase hover:bg-primary/8 transition-all">
                List Your Business
              </button>
            </Link>
          </div>
        </div>
      </div>

      <VendorDetailModal
        vendor={selected}
        onClose={() => setSelected(null)}
        similarVendors={similarVendors}
        onSelect={setSelected}
      />

      <Footer />
    </div>
  );
}
