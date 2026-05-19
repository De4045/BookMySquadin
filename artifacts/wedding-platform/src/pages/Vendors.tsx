import { useState, useMemo, useEffect } from "react";
import { useMeta } from "@/hooks/useMeta";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, MapPin, ChevronDown, ArrowRight, ArrowUpDown, Phone, Building2, X, Heart, Star, Lock, BadgeCheck, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Vendor } from "@/data/vendors";
import { VendorDetailModal, type VendorLike } from "@/components/VendorDetailModal";
import { useShortlist } from "@/context/ShortlistContext";
import { useAuth } from "@/context/AuthContext";
import { isVendorVerified } from "@/data/subscriptions";
import { useComparison } from "@/context/ComparisonContext";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

const CATEGORY_PRICE: Record<string, number> = {
  "MAKEUP ARTIST":    15000,
  "MUSIC & DJ":       25000,
  "VENDOR":           25000,
  "CATERER":          50000,
  "DECOR":            75000,
  "PHOTOGRAPHER":     75000,
  "WEDDING PLANNERS": 150000,
};

const PRICE_RANGES = [
  { value: "",          label: "Any Budget"       },
  { value: "under50k",  label: "Under ₹50,000"    },
  { value: "50k-1.5L",  label: "₹50k – ₹1.5L"    },
  { value: "1.5L+",     label: "Above ₹1.5L"      },
];

function normalizeCategory(raw: string): string {
  const s = (raw || "").trim().toUpperCase();
  if (s === "DEOCR" || s === "DECOR") return "DECOR";
  if (s.includes("PLANNER"))          return "WEDDING PLANNERS";
  if (s.includes("MAKE"))             return "MAKEUP ARTIST";
  if (s.includes("PHOTO"))            return "PHOTOGRAPHER";
  if (s.includes("CATER"))            return "CATERER";
  if (s.includes("MUSIC") || s.includes("DJ") || s.includes("ENTERTAIN")) return "MUSIC & DJ";
  return s || "VENDOR";
}

const Q  = "w=800&h=520&fit=crop&q=85&auto=format";
const PQ = "auto=compress&cs=tinysrgb&w=800&h=520&fit=crop";
const P  = (id: string, path?: string) =>
  `https://images.pexels.com/photos/${id}/${path ?? `pexels-photo-${id}`}.jpeg?${PQ}`;

const CATEGORY_IMAGES: Record<string, string[]> = {
  /* ── Decorator / Decor ─────────────────────────────────────────── */
  "DECOR": [
    P("2788490"),
    P("2788492"),
    P("57980"),
    P("1128782"),
    P("16935899", "pexels-photo-16935899/free-photo-of-tables-decorated-with-flowers-in-luxury-restaurant"),
    P("12954013"),
    P("12876404"),
    P("2970287"),
  ],

  /* ── Wedding Planners ──────────────────────────────────────────── */
  "WEDDING PLANNERS": [
    P("3696878"),
    P("2970287"),
    P("12954013"),
    P("2788490"),
    P("1128782"),
    P("16935899", "pexels-photo-16935899/free-photo-of-tables-decorated-with-flowers-in-luxury-restaurant"),
    P("2788492"),
    P("12876404"),
  ],

  /* ── Makeup Artist ─────────────────────────────────────────────── */
  "MAKEUP ARTIST": [
    P("2498430"),
    P("17125530", "pexels-photo-17125530/free-photo-of-young-woman-in-a-glamour-makeup-look-and-traditional-jewelry"),
    P("11742214"),
    P("11742213"),
    P("1229414"),
    P("3992080"),
    P("6304019"),
    P("3787395"),
  ],

  /* ── Photography ───────────────────────────────────────────────── */
  "PHOTOGRAPHER": [
    P("35325793", "pexels-photo-35325793/free-photo-of-capturing-wedding-moments-with-a-professional-camera"),
    P("3992080"),
    P("6304019"),
    P("36098389", "pexels-photo-36098389/free-photo-of-traditional-indian-wedding-couple-in-vibrant-attire"),
    P("3787395"),
    `https://images.unsplash.com/photo-1554048612-b6a482bc67e5?${Q}`,
    `https://images.unsplash.com/photo-1606216794074-735e91aa2c92?${Q}`,
    `https://images.unsplash.com/photo-1537633552985-df8429e8048b?${Q}`,
  ],

  /* ── Catering ──────────────────────────────────────────────────── */
  "CATERER": [
    `https://images.unsplash.com/photo-1555244162-803834f70033?${Q}`,
    `https://images.unsplash.com/photo-1481833761820-0509d3217039?${Q}`,
    `https://images.unsplash.com/photo-1567521464027-f127ff144326?${Q}`,
    `https://images.unsplash.com/photo-1414235077428-338989a2e8c0?${Q}`,
    `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?${Q}`,
    `https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?${Q}`,
    `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?${Q}`,
    `https://images.unsplash.com/photo-1547592180-85f173990554?${Q}`,
  ],

  /* ── Music & DJ ────────────────────────────────────────────────── */
  "MUSIC & DJ": [
    P("14925306"),
    P("13872120"),
    P("9005465"),
    P("7715596"),
    P("7270006"),
    P("9806458"),
    P("1494665"),
    P("11144787"),
  ],

  /* ── Camera Team ───────────────────────────────────────────────── */
  "CAMERA TEAM": [
    P("35325793", "pexels-photo-35325793/free-photo-of-capturing-wedding-moments-with-a-professional-camera"),
    P("3992080"),
    `https://images.unsplash.com/photo-1554048612-b6a482bc67e5?${Q}`,
    `https://images.unsplash.com/photo-1606216794074-735e91aa2c92?${Q}`,
    `https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?${Q}`,
    `https://images.unsplash.com/photo-1529543544282-ea669407fca3?${Q}`,
    `https://images.unsplash.com/photo-1537633552985-df8429e8048b?${Q}`,
    `https://images.unsplash.com/photo-1426604966848-d7adac402bff?${Q}`,
  ],

  /* ── Anchor / Host ─────────────────────────────────────────────── */
  "ANCHOR": [
    P("29708269", "pexels-photo-29708269/free-photo-of-male-speaker-at-indoor-conference-event"),
    P("7807298"),
    P("17722680", "pexels-photo-17722680/free-photo-of-a-microphone-is-shown-in-front-of-a-stage"),
    P("16963920", "pexels-photo-16963920/free-photo-of-microphone-in-close-up"),
    P("1494665"),
    P("8942888"),
    `https://images.unsplash.com/photo-1459749411175-04bf5292ceea?${Q}`,
    `https://images.unsplash.com/photo-1540575467063-178a50c2df87?${Q}`,
  ],

  /* ── Choreographer / Dance ─────────────────────────────────────── */
  "CHOREOGRAPHER": [
    P("32285696", "pexels-photo-32285696/free-photo-of-traditional-indian-dance-performance-with-elegant-attire"),
    P("34717652", "pexels-photo-34717652/free-photo-of-traditional-bharatanatyam-dancer-performing-in-india"),
    P("18869864", "pexels-photo-18869864/free-photo-of-indian-dancer-in-a-costume-on-stage"),
    P("18086358", "pexels-photo-18086358/free-photo-of-woman-in-a-colorful-traditional-costume-dancing-on-stage"),
    P("34717625", "pexels-photo-34717625/free-photo-of-bharatanatyam-dancer-performing-on-stage"),
    P("8673523"),
    `https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?${Q}`,
    `https://images.unsplash.com/photo-1518611012118-696072aa579a?${Q}`,
  ],

  /* ── Sound & Light ─────────────────────────────────────────────── */
  "SOUND & LIGHT": [
    P("7709689"),
    P("8942888"),
    P("8937014"),
    P("1494665"),
    P("13230506"),
    P("14925306"),
    P("11144787"),
    `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?${Q}`,
  ],

  /* ── Production ────────────────────────────────────────────────── */
  "PRODUCTION": [
    P("11144787"),
    P("8673523"),
    P("3563172"),
    P("4218027"),
    P("11350410"),
    P("7709689"),
    P("8942888"),
    P("1494665"),
  ],

  /* ── Fashion Designer / Bridal Wear ────────────────────────────── */
  "FASHION DESIGNER": [
    P("12062663"),
    P("12796883"),
    P("12959396"),
    P("33343615", "pexels-photo-33343615/free-photo-of-elegant-indian-bride-in-pink-lehenga-portrait"),
    P("33343579", "pexels-photo-33343579/free-photo-of-elegant-indian-bridal-portrait-outdoors"),
    P("2498430"),
    P("3992080"),
    P("6304019"),
  ],

  /* ── Hospitality ───────────────────────────────────────────────── */
  "HOSPITALITY": [
    P("2373201"),
    P("3757640"),
    P("1028379"),
    P("17568098", "pexels-photo-17568098/free-photo-of-swimming-pool-at-a-luxury-hotel"),
    P("31234753", "pexels-photo-31234753/free-photo-of-relaxing-spa-experience-at-luxury-hotel"),
    P("6875529"),
    `https://images.unsplash.com/photo-1566073771259-6a8506099945?${Q}`,
    `https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?${Q}`,
  ],

  /* ── Transport / Luxury Vehicles ───────────────────────────────── */
  "TRANSPORT": [
    P("30196262", "pexels-photo-30196262/free-photo-of-vintage-rolls-royce-in-arched-hallway"),
    P("2318049"),
    P("3342697"),
    P("1486101"),
    `https://images.unsplash.com/photo-1503376780353-7e6692767b70?${Q}`,
    `https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?${Q}`,
    `https://images.unsplash.com/photo-1568605114967-8130f3a36994?${Q}`,
    `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?${Q}`,
  ],

  /* ── Travel ────────────────────────────────────────────────────── */
  "TRAVEL": [
    P("6875529"),
    P("6126935"),
    P("16116486", "pexels-photo-16116486/free-photo-of-top-view-of-a-tourist-resort"),
    P("6875522"),
    P("4784507"),
    P("2373201"),
    `https://images.unsplash.com/photo-1469474968028-56623f02e42e?${Q}`,
    `https://images.unsplash.com/photo-1476514525405-368ec0b6df7c?${Q}`,
  ],

  /* ── Mehendi / Henna Art ───────────────────────────────────────── */
  "MEHENDI": [
    P("4105332"),
    P("1444441"),
    P("12872537"),
    P("12872535"),
    P("7176343"),
    P("2498430"),
    `https://images.unsplash.com/photo-1583391265042-f606bd38d3c6?${Q}`,
    `https://images.unsplash.com/photo-1617369120004-4806cc963f47?${Q}`,
  ],

  /* ── Venue Styling ─────────────────────────────────────────────── */
  "VENUE STYLING": [
    P("2788490"),
    P("2788492"),
    P("1128782"),
    P("2970287"),
    P("3696878"),
    P("12954013"),
    `https://images.unsplash.com/photo-1519167758481-83f550bb49b3?${Q}`,
    `https://images.unsplash.com/photo-1519225421980-715cb0215aed?${Q}`,
  ],

  /* ── Printing / Stationery ─────────────────────────────────────── */
  "PRINTING": [
    P("13106764"),
    `https://images.unsplash.com/photo-1512936040-7b76e51f1c10?${Q}`,
    `https://images.unsplash.com/photo-1586281380349-632531db7ed4?${Q}`,
    P("2788490"),
    P("1128782"),
    `https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?${Q}`,
    `https://images.unsplash.com/photo-1511795409834-ef04bbd61622?${Q}`,
    `https://images.unsplash.com/photo-1518998053901-5348d3961a04?${Q}`,
  ],
};

/* ── Per-vendor image overrides (keyed by uppercased name or company) ── */
const VENDOR_IMAGE_OVERRIDES: Record<string, string> = {
  "DEEPAK RAGHAV":     "https://images.pexels.com/photos/3992080/pexels-photo-3992080.jpeg?auto=compress&cs=tinysrgb&w=800&h=520&fit=crop",
  "WIDE ANGLE EVENTS": "https://images.pexels.com/photos/3992080/pexels-photo-3992080.jpeg?auto=compress&cs=tinysrgb&w=800&h=520&fit=crop",
  "ELINA":             "https://images.pexels.com/photos/14925306/pexels-photo-14925306.jpeg?auto=compress&cs=tinysrgb&w=800&h=520&fit=crop",
};

const DEFAULT_IMAGES = [
  `https://images.unsplash.com/photo-1519225421980-715cb0215aed?${Q}`,
  `https://images.unsplash.com/photo-1606800052052-a08af7148866?${Q}`,
  `https://images.unsplash.com/photo-1511795409834-ef04bbd61622?${Q}`,
  `https://images.unsplash.com/photo-1554048612-b6a482bc67e5?${Q}`,
  `https://images.unsplash.com/photo-1519167758481-83f550bb49b3?${Q}`,
  `https://images.unsplash.com/photo-1563697873-fc42501a3e53?${Q}`,
  `https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?${Q}`,
  `https://images.unsplash.com/photo-1583939003579-730e3918a45a?${Q}`,
];

function getVendorImage(vendor: { image?: string; name?: string; company?: string }, cat: string, idx: number): string {
  if (vendor.image) return vendor.image;
  const nameKey    = (vendor.name    ?? "").trim().toUpperCase();
  const companyKey = (vendor.company ?? "").trim().toUpperCase();
  if (VENDOR_IMAGE_OVERRIDES[nameKey])    return VENDOR_IMAGE_OVERRIDES[nameKey];
  if (VENDOR_IMAGE_OVERRIDES[companyKey]) return VENDOR_IMAGE_OVERRIDES[companyKey];
  const pool = CATEGORY_IMAGES[cat] ?? DEFAULT_IMAGES;
  return pool[idx % pool.length];
}

const CAT_COLOR: Record<string, string> = {
  "DECOR":            "#8ab4e8",
  "WEDDING PLANNERS": "#c9a96e",
  "MAKEUP ARTIST":    "#e8a4c8",
  "PHOTOGRAPHER":     "#50e3c2",
  "CATERER":          "#f5a623",
  "MUSIC & DJ":       "#bd10e0",
  "CAMERA TEAM":      "#50e3c2",
  "ANCHOR":           "#a78bfa",
  "CHOREOGRAPHER":    "#f472b6",
  "SOUND & LIGHT":    "#38bdf8",
  "PRODUCTION":       "#34d399",
  "FASHION DESIGNER": "#fb923c",
  "HOSPITALITY":      "#facc15",
  "TRANSPORT":        "#94a3b8",
  "TRAVEL":           "#6ee7b7",
  "MEHENDI":          "#f9a8d4",
  "VENUE STYLING":    "#c084fc",
  "PRINTING":         "#d4af37",
};

const SORT_OPTIONS = [
  { value: "default", label: "Default Order" },
  { value: "rating",  label: "Rating: Best First" },
  { value: "name-az", label: "Name A → Z" },
  { value: "name-za", label: "Name Z → A" },
  { value: "company", label: "Company A → Z" },
  { value: "city",    label: "City A → Z" },
];

export default function Vendors() {
  useMeta({ title: "Vendors", description: "Browse India's top wedding vendors — photographers, decorators, makeup artists, caterers and more.", keywords: "wedding vendors india, wedding photographers, wedding decorators, makeup artists" });
  const { has, toggle } = useShortlist();
  const { user } = useAuth();
  const comparison = useComparison();
  const [vendors, setVendors]           = useState<Vendor[]>([]);
  const [search, setSearch]             = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [cityFilter, setCityFilter]     = useState("");
  const [sortBy, setSortBy]             = useState("default");
  const [priceFilter, setPriceFilter]   = useState("");
  const [showCompare, setShowCompare]   = useState(false);
  const [selected, setSelected]         = useState<VendorLike | null>(null);

  // Fetch vendors from API on mount
  useEffect(() => {
    fetch(`${BASE}/api/vendors`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setVendors(d.vendors ?? []))
      .catch(() => {});
  }, []);

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat  = params.get("category");
    const city = params.get("city");
    if (cat) setFilterCategory(normalizeCategory(cat));
    if (city) setCityFilter(city);
  }, []);

  const uniqueCategories = useMemo(() =>
    [...new Set(vendors.map(v => normalizeCategory(v.category)))].sort()
  , [vendors]);

  const uniqueCities = useMemo(() =>
    [...new Set(vendors.map(v => v.city).filter(Boolean))].sort()
  , [vendors]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list = vendors.filter(v => {
      const cat = normalizeCategory(v.category);
      const matchSearch = !q ||
        v.name.toLowerCase().includes(q) ||
        (v.company || "").toLowerCase().includes(q) ||
        (v.city    || "").toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q);
      const matchCat   = !filterCategory || cat === filterCategory;
      const matchCity  = !cityFilter     || v.city === cityFilter;
      const startPrice = CATEGORY_PRICE[cat] ?? 25000;
      const matchPrice = !priceFilter || (
        priceFilter === "under50k" ? startPrice < 50000 :
        priceFilter === "50k-1.5L" ? startPrice >= 50000 && startPrice < 150000 :
        priceFilter === "1.5L+"    ? startPrice >= 150000 :
        true
      );
      return matchSearch && matchCat && matchCity && matchPrice;
    });
    switch (sortBy) {
      case "name-az":  list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-za":  list = [...list].sort((a, b) => b.name.localeCompare(a.name)); break;
      case "company":  list = [...list].sort((a, b) => (a.company || "").localeCompare(b.company || "")); break;
      case "city":     list = [...list].sort((a, b) => (a.city || "").localeCompare(b.city || "")); break;
      case "rating":   list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
    }
    return list;
  }, [vendors, search, filterCategory, cityFilter, sortBy, priceFilter]);

  const activeFilters: { label: string; clear: () => void }[] = [];
  if (search)         activeFilters.push({ label: `"${search}"`, clear: () => setSearch("") });
  if (filterCategory) activeFilters.push({ label: filterCategory, clear: () => setFilterCategory("") });
  if (cityFilter)     activeFilters.push({ label: cityFilter, clear: () => setCityFilter("") });
  if (priceFilter) {
    const p = PRICE_RANGES.find(r => r.value === priceFilter);
    if (p) activeFilters.push({ label: p.label, clear: () => setPriceFilter("") });
  }
  if (sortBy !== "default") {
    const s = SORT_OPTIONS.find(o => o.value === sortBy);
    if (s) activeFilters.push({ label: `Sort: ${s.label}`, clear: () => setSortBy("default") });
  }
  const clearAll = () => { setSearch(""); setFilterCategory(""); setCityFilter(""); setSortBy("default"); setPriceFilter(""); };
  const topCategories = useMemo(() => uniqueCategories.slice(0, 5), [uniqueCategories]);

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero */}
        <section className="relative py-24 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
          <div className="relative z-10">
            <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/60 uppercase mb-4">✦ Vendor Network ✦</p>
            <h1 className="font-cormorant text-5xl md:text-7xl font-light mb-6">
              Our <span className="text-primary italic font-semibold">Partners</span>
            </h1>
            <p className="font-manrope text-white/60 max-w-2xl mx-auto text-base font-light mb-10">
              A curated network of luxury professionals across wedding planning, décor, and beauty services.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setFilterCategory("")}
                className={`px-5 py-2 rounded-sm border font-cinzel text-[10px] tracking-wider uppercase transition-all ${
                  filterCategory === "" ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-white/50 hover:border-primary/40 hover:text-primary"
                }`}
              >All Vendors</button>
              {topCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat === filterCategory ? "" : cat)}
                  className={`px-5 py-2 rounded-sm border font-cinzel text-[10px] tracking-wider uppercase transition-all ${
                    filterCategory === cat ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-white/50 hover:border-primary/40 hover:text-primary"
                  }`}
                >{cat}</button>
              ))}
            </div>
          </div>
        </section>

        {/* Sticky Toolbar */}
        <div className="sticky top-16 z-40 bg-[#080604]/95 backdrop-blur-xl border-b border-white/10">
          <div className="py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-manrope text-sm text-white/50 font-light shrink-0">
              Showing <span className="text-primary font-semibold">{filtered.length}</span>
              <span className="text-white/30"> / {vendors.length}</span> vendors
            </div>
            <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
              <div className="relative w-full md:w-56 bg-white/[0.04] border border-white/10 rounded-sm overflow-hidden">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="text" placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-transparent text-white text-sm font-manrope font-light focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/30" />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="relative w-full md:w-44 bg-white/[0.04] border border-white/10 rounded-sm overflow-hidden">
                <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 bg-transparent text-white text-sm font-manrope font-light appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50">
                  <option value="" className="bg-[#1a1510]">All Cities</option>
                  {uniqueCities.map(c => <option key={c} value={c} className="bg-[#1a1510]">{c}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>
              <div className="relative w-full md:w-48 bg-white/[0.04] border border-white/10 rounded-sm overflow-hidden">
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 bg-transparent text-white text-sm font-manrope font-light appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50">
                  <option value="" className="bg-[#1a1510]">All Categories</option>
                  {uniqueCategories.map(cat => <option key={cat} value={cat} className="bg-[#1a1510]">{cat}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>
              <div className="relative w-full md:w-48 bg-white/[0.04] border border-white/10 rounded-sm overflow-hidden">
                <ArrowUpDown className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-transparent text-white text-sm font-manrope font-light appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-[#1a1510]">{o.label}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>
              <div className="relative w-full md:w-44 bg-white/[0.04] border border-white/10 rounded-sm overflow-hidden">
                <Scale className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}
                  className="w-full pl-8 pr-8 py-2.5 bg-transparent text-white text-sm font-manrope font-light appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50">
                  {PRICE_RANGES.map(r => <option key={r.value} value={r.value} className="bg-[#1a1510]">{r.label}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>
            </div>
          </div>
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                <div className="px-6 md:px-12 pb-3 flex flex-wrap items-center gap-2">
                  <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/30 uppercase mr-1">Active:</span>
                  {activeFilters.map(f => (
                    <button key={f.label} onClick={f.clear} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 text-primary font-manrope text-xs rounded-sm hover:bg-primary/20 transition-colors">
                      {f.label} <X className="w-3 h-3" />
                    </button>
                  ))}
                  {activeFilters.length > 1 && (
                    <button onClick={clearAll} className="px-3 py-1 text-white/40 font-manrope text-xs hover:text-white/70 transition-colors underline underline-offset-2">Clear all</button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vendor Grid */}
        <section className="py-16 px-6 md:px-12 bg-[#080604]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((vendor, idx) => {
                const cat         = normalizeCategory(vendor.category);
                const accentColor = CAT_COLOR[cat] ?? "#c9a96e";
                const hasCompany  = !!vendor.company;
                const hasCity     = !!vendor.city;
                const hasPhone    = !!vendor.contact;
                const hasState    = !!vendor.state;
                const slId        = `vendor-${vendor.name}-${vendor.city || ""}`;
                const isSlisted   = has(slId);

                const coverImg = getVendorImage(vendor, cat, idx);
                const isInfinity = vendor.name === "Infinity Eventz";

                return (
                  <motion.div
                    layout
                    key={vendor.name + (vendor.company || "") + idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.25), duration: 0.4 }}
                    onClick={() => setSelected(vendor)}
                    className="bg-[#1a1510] border border-white/5 rounded-sm overflow-hidden flex flex-col group hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer"
                    style={isInfinity ? { borderColor: "rgba(212,175,55,0.3)", boxShadow: "0 4px 24px rgba(212,175,55,0.08)" } : {}}
                  >
                    {/* Cover photo */}
                    <div className="relative h-52 overflow-hidden shrink-0">
                      <img
                        src={coverImg}
                        alt={vendor.company || vendor.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510] via-[#1a1510]/20 to-transparent" />
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <div className="font-cinzel text-[8px] uppercase tracking-[0.2em] font-bold px-2 py-1 bg-[#0d0a07]/80 backdrop-blur-sm"
                          style={{ color: accentColor, border: `1px solid ${accentColor}40` }}>{cat}</div>
                      </div>
                      {/* Heart + featured badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        {isInfinity && (
                          <div className="font-cinzel text-[7px] tracking-[0.2em] uppercase px-2 py-1 bg-primary text-black font-bold">Featured</div>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); toggle({ id: slId, type: "vendor", name: vendor.name, city: vendor.city, category: cat }); }}
                          className={`w-7 h-7 flex items-center justify-center bg-[#0d0a07]/70 backdrop-blur-sm rounded-sm transition-all ${isSlisted ? "text-primary" : "text-white/50 hover:text-primary/70"}`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSlisted ? "fill-primary" : ""}`} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); comparison.has(vendor.name) ? comparison.remove(vendor.name) : comparison.add({ name: vendor.name, category: cat, city: vendor.city, state: vendor.state, contact: vendor.contact }); }}
                          className={`w-7 h-7 flex items-center justify-center bg-[#0d0a07]/70 backdrop-blur-sm rounded-sm transition-all ${comparison.has(vendor.name) ? "text-primary border border-primary/40" : "text-white/50 hover:text-primary/70"}`}
                          title={comparison.has(vendor.name) ? "Remove from comparison" : "Add to compare"}
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-xl font-cormorant font-bold text-white leading-tight group-hover:text-primary transition-colors duration-300 mb-0.5">{vendor.name}</h3>
                      {hasCompany && vendor.company !== vendor.name && (
                        <p className="font-manrope text-white/50 text-sm mb-3">{vendor.company}</p>
                      )}

                      {/* Star rating + Verified badge */}
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        {vendor.rating !== undefined && (
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className="w-3 h-3" fill={s <= vendor.rating! ? "#d4af37" : "none"} stroke={s <= vendor.rating! ? "#d4af37" : "#d4af3740"} />
                            ))}
                            <span className="font-manrope text-[10px] text-primary/70 ml-1">{vendor.rating}.0</span>
                          </div>
                        )}
                        {isVendorVerified(vendor.name) && (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 border border-primary/35 rounded-sm">
                            <BadgeCheck className="w-2.5 h-2.5 text-primary" />
                            <span className="font-cinzel text-[6.5px] tracking-[0.15em] text-primary uppercase">Verified</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto pt-4 border-t border-white/5 space-y-2 font-manrope text-xs text-white/60">
                        {(hasCity || hasState) && (
                          <div className="flex items-center gap-2.5">
                            <MapPin className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                            <span>{hasCity ? vendor.city : ""}{hasCity && hasState ? ", " : ""}{hasState ? vendor.state : ""}</span>
                          </div>
                        )}
                        {hasPhone && (
                          user ? (
                            <div className="flex items-center gap-2.5">
                              <Phone className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                              <span className="font-mono">{vendor.contact}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Lock className="w-3.5 h-3.5 text-white/25 shrink-0" />
                              <span className="font-manrope text-[11px] text-white/30 italic">Members only</span>
                            </div>
                          )
                        )}
                        {!hasCity && !hasState && !hasPhone && (
                          <p className="text-white/25 italic text-xs">Contact info not available</p>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
                        <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/40 uppercase group-hover:text-primary transition-colors">View Profile</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-32 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-white/30" />
              </div>
              <h3 className="font-cormorant text-2xl text-white mb-2">No Vendors Found</h3>
              <p className="font-manrope text-white/50 text-sm max-w-md mx-auto font-light">No professionals match your current filters.</p>
              <button onClick={clearAll} className="mt-8 px-6 py-2.5 border border-primary/50 text-primary font-cinzel text-[10px] tracking-widest hover:bg-primary hover:text-black transition-all uppercase">
                Clear All Filters
              </button>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />

      {/* Comparison Tray */}
      <AnimatePresence>
        {comparison.items.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-[#0d0a07]/98 backdrop-blur-xl border-t border-primary/30 px-5 py-3"
          >
            <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 flex-1 flex-wrap min-w-0">
                {comparison.items.map(v => (
                  <div key={v.name} className="flex items-center gap-2 bg-primary/10 border border-primary/25 px-3 py-1.5 shrink-0">
                    <span className="font-cinzel text-[8.5px] tracking-[0.12em] text-primary uppercase max-w-[110px] truncate">{v.name}</span>
                    <button onClick={() => comparison.remove(v.name)} className="text-white/35 hover:text-red-400 transition-colors shrink-0"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 3 - comparison.items.length) }).map((_, i) => (
                  <div key={i} className="hidden md:flex items-center justify-center px-4 py-1.5 border border-dashed border-white/12">
                    <span className="font-cinzel text-[8px] text-white/20 uppercase tracking-wider">+ Add</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={comparison.clear} className="font-cinzel text-[8.5px] tracking-[0.15em] text-white/35 uppercase hover:text-white/60 transition-colors">Clear</button>
                <button
                  disabled={comparison.items.length < 2}
                  onClick={() => setShowCompare(true)}
                  aria-label="Open comparison modal"
                  data-testid="open-comparison"
                  className="flex items-center gap-2 px-5 py-2 bg-primary text-black font-cinzel text-[9px] tracking-[0.18em] uppercase font-bold hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Scale className="w-3.5 h-3.5" /> Compare ({comparison.items.length})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showCompare && comparison.items.length >= 2 && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCompare(false)} className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[60]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-4 md:inset-10 lg:inset-16 bg-[#0d0a07] border border-primary/25 z-[61] overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#0d0a07]/98 backdrop-blur-xl border-b border-white/8 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-cinzel text-[9px] tracking-[0.3em] text-primary/75 uppercase mb-0.5">Vendor Comparison</p>
                  <p className="font-manrope text-xs text-white/35">Side-by-side overview</p>
                </div>
                <button onClick={() => setShowCompare(false)} className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className={`p-6 grid gap-5 ${comparison.items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
                {comparison.items.map((vendor) => {
                  const cat = vendor.category;
                  const accentColor = CAT_COLOR[cat] ?? "#c9a96e";
                  const catImgs = CATEGORY_IMAGES[cat] ?? CATEGORY_IMAGES["DECOR"];
                  return (
                    <div key={vendor.name} className="bg-[#1a1510] border border-white/8 overflow-hidden">
                      <div className="h-44 overflow-hidden relative">
                        <img src={catImgs[0]} alt={vendor.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510] to-transparent" />
                        <div className="absolute top-3 left-3 font-cinzel text-[8px] uppercase tracking-[0.2em] px-2 py-1 bg-[#0d0a07]/80" style={{ color: accentColor, border: `1px solid ${accentColor}40` }}>{cat}</div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-cormorant text-xl font-semibold text-white mb-1">{vendor.name}</h3>
                        {vendor.city && (
                          <div className="flex items-center gap-1.5 mb-3">
                            <MapPin className="w-3 h-3 text-primary/40" />
                            <span className="font-cinzel text-[8.5px] tracking-wider text-white/40 uppercase">{vendor.city}</span>
                          </div>
                        )}
                        <div className="space-y-2.5 border-t border-white/8 pt-4 mt-4">
                          {[
                            { label: "Rating",   value: (() => { const r = vendors.find(v => v.name === vendor.name)?.rating; return r ? `${r} ★` : "N/A"; })() },
                            { label: "Verified", value: isVendorVerified(vendor.name) ? "✓ Yes" : "No", style: isVendorVerified(vendor.name) ? "text-primary" : "text-white/35" },
                            { label: "Starting", value: `₹${((CATEGORY_PRICE[cat] ?? 25000) / 1000).toFixed(0)}k+`, style: "text-primary" },
                          ].map(row => (
                            <div key={row.label} className="flex items-center justify-between">
                              <span className="font-cinzel text-[8.5px] tracking-[0.15em] text-white/35 uppercase">{row.label}</span>
                              <span className={`font-manrope text-sm ${row.style ?? "text-white/70"}`}>{row.value}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => { setShowCompare(false); const v = vendors.find(vv => vv.name === vendor.name); if (v) setSelected(v); }}
                          className="mt-4 w-full py-2 bg-primary text-black font-cinzel text-[9px] tracking-[0.18em] uppercase font-bold hover:bg-primary/90 transition-all"
                        >View Profile →</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Detail modal */}
      {selected && (
        <VendorDetailModal
          vendor={selected}
          onClose={() => setSelected(null)}
          similarVendors={vendors
            .filter(v => normalizeCategory(v.category) === normalizeCategory(selected.category) && v.name !== selected.name)
            .slice(0, 3)}
          onSelect={setSelected}
        />
      )}
    </div>
  );
}
