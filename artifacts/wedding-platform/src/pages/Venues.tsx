import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Users, Bed, Search, ChevronDown, X, ArrowUpDown, UtensilsCrossed, Heart, Lock, BadgeCheck, Map as MapIcon, LayoutGrid } from "lucide-react";
import { VenueMap, type MapVenue } from "@/components/VenueMap";
import { useMeta } from "@/hooks/useMeta";
import { VenueDetailModal } from "@/components/VenueDetailModal";
import { useShortlist } from "@/context/ShortlistContext";
import { type Venue } from "@/data/venues";
import { VENUES as STATIC_VENUES } from "@/data/venues";
import { useAuth } from "@/context/AuthContext";
import { isVenueVerified } from "@/data/subscriptions";
import { loadVenueDataFromExcel } from "@/lib/excel";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

const TYPE_COLOR: Record<string, string> = {
  HOTEL: "#4a90e2",
  RESORT: "#50e3c2",
  FARMHOUSE: "#f5a623",
  BANQUET: "#bd10e0",
};

const VENUE_IMG_POOLS: Record<string, string[]> = {
  HOTEL: [
    "1566073771259-6a8506099945","1542314831-068cd1dbfeeb","1529290130-4ca3753253ae",
    "1455587734955-081b22074882","1496417263034-38ec4f0b665a","1551882547-ff40c63fe5fa",
    "1520250497591-112f2f40a3f4","1561501878-aabd62634533","1568084680786-a84f91d1153c",
    "1471086569508-084aa489e9fb",
  ],
  RESORT: [
    "1582719508461-905c673771fd","1571003123894-1f0594d2b5d9","1507525428034-b723cf961d3e",
    "1540541338537-d5d77a6c8c0c","1476514525535-07fb3b4ae5f1","1519046904884-53103b34b206",
    "1545558014-8692077e9b5c","1614267119077-51bdcfba6f19","1510414842594-a61c69b5ae57",
    "1506197603052-3cc9c3a201bd",
  ],
  FARMHOUSE: [
    "1600585154526-990dced4db0d","1564013799919-ab600027ffc6","1580587771525-78b9dba3b914",
    "1568605114967-8130f3a36994","1512917774080-9991f1c4c750","1558618666-fcd25c85cd64",
    "1516455590571-18256e5bb9ff","1598300042247-d088f8ab3a91","1572120360610-d971b9d7767c",
    "1594938298603-c8148c4b4357",
  ],
  BANQUET: [
    "1519167758481-83f550bb49b3","1478146059778-26028b07395a","1464366400600-7168b8af9bc3",
    "1521339246620-34873ccf2999","1527529482837-4698179dc6ce","1530103862676-de8c9debad1d",
    "1511795409834-ef04bbd61622","1469371670807-013ccf25f16a","1519225421980-715cb0215aed",
    "1465495976277-f48b955d8070",
  ],
};

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function getVenueCardImg(name: string, type: string): string {
  const pool = VENUE_IMG_POOLS[type] ?? VENUE_IMG_POOLS["BANQUET"];
  const id = pool[hashStr(name) % pool.length];
  return `https://images.unsplash.com/photo-${id}?w=800&q=80`;
}

const SORT_OPTIONS = [
  { value: "default",    label: "Default Order" },
  { value: "name-az",    label: "Name A → Z" },
  { value: "name-za",    label: "Name Z → A" },
  { value: "cap-high",   label: "Capacity: High → Low" },
  { value: "cap-low",    label: "Capacity: Low → High" },
  { value: "rooms-high", label: "Rooms: High → Low" },
];

function normalizeType(t: string) {
  return (t || "").toUpperCase().trim();
}

function normalizeVenueCityFilter(value: string) {
  const raw = (value || "").trim().toLowerCase();
  if (!raw) return "";
  if (raw.includes("goa")) return "GOA";
  return raw.toUpperCase();
}

export default function Venues() {
  const { has, toggle } = useShortlist();
  const { user } = useAuth();
  const [venues, setVenues]         = useState<Venue[]>([]);
  const [search, setSearch]         = useState("");
  const [cityFilter, setCityFilter]  = useState("");
  const [typeFilter, setTypeFilter]  = useState("");
  const [sortBy, setSortBy]          = useState("default");
  const [selected, setSelected]      = useState<Venue | null>(null);
  const [viewMode, setViewMode]      = useState<"grid" | "map">("grid");

  useMeta({ title: "Venues", description: "Discover India's most exquisite wedding venues. Browse hotels, banquet halls, resorts and more across all major cities.", keywords: "wedding venues india, banquet halls, wedding venues" });

  // Load venue data from Excel or fallback to API/static data
  useEffect(() => {
    let active = true;
    const loadVenues = async () => {
      try {
        const excelVenues = await loadVenueDataFromExcel(`${BASE}/excel/venue2.xlsx`);
        if (active && excelVenues.length > 0) {
          setVenues(excelVenues);
          return;
        }
      } catch {
        // fallback to API/static data
      }

      try {
        const response = await fetch(`${BASE}/api/venues`, { credentials: "include" });
        const data = await response.json();
        if (active && Array.isArray(data?.venues) && data.venues.length > 0) {
          setVenues(data.venues);
          return;
        }
      } catch {
        // ignore
      }

      if (active) setVenues(STATIC_VENUES);
    };
    loadVenues();
    return () => { active = false; };
  }, []);

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const city = params.get("city");
    const type = params.get("type");
    if (city) setCityFilter(normalizeVenueCityFilter(city));
    if (type) setTypeFilter(type.toUpperCase());
  }, []);

  const uniqueCities = useMemo(() =>
    [...new Set(venues.map(v => v.city_sheet).filter(Boolean))].sort()
  , [venues]);

  const uniqueTypes = useMemo(() =>
    [...new Set(venues.map(v => normalizeType(v.type)).filter(Boolean))].sort()
  , [venues]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list = venues.filter(v => {
      const matchSearch = !q ||
        (v.property_name || "").toLowerCase().includes(q) ||
        (v.location      || "").toLowerCase().includes(q) ||
        (v.city_sheet    || "").toLowerCase().includes(q);
      const normalizedCityFilter = normalizeVenueCityFilter(cityFilter);
      const matchCity = !normalizedCityFilter || normalizeVenueCityFilter(v.city_sheet) === normalizedCityFilter;
      const matchType = !typeFilter || normalizeType(v.type) === typeFilter;
      return matchSearch && matchCity && matchType;
    });

    switch (sortBy) {
      case "name-az":    list = [...list].sort((a, b) => (a.property_name || "").localeCompare(b.property_name || "")); break;
      case "name-za":    list = [...list].sort((a, b) => (b.property_name || "").localeCompare(a.property_name || "")); break;
      case "cap-high":   list = [...list].sort((a, b) => Number(b.max_banquet_capacity || 0) - Number(a.max_banquet_capacity || 0)); break;
      case "cap-low":    list = [...list].sort((a, b) => Number(a.max_banquet_capacity || 0) - Number(b.max_banquet_capacity || 0)); break;
      case "rooms-high": list = [...list].sort((a, b) => Number(b.max_rooms || 0) - Number(a.max_rooms || 0)); break;
    }
    return list;
  }, [venues, search, cityFilter, typeFilter, sortBy]);

  const activeFilters: { label: string; clear: () => void }[] = [];
  if (search)     activeFilters.push({ label: `"${search}"`, clear: () => setSearch("") });
  if (cityFilter) activeFilters.push({ label: cityFilter,    clear: () => setCityFilter("") });
  if (typeFilter) activeFilters.push({ label: typeFilter,    clear: () => setTypeFilter("") });
  if (sortBy !== "default") {
    const s = SORT_OPTIONS.find(o => o.value === sortBy);
    if (s) activeFilters.push({ label: `Sort: ${s.label}`, clear: () => setSortBy("default") });
  }

  const clearAll = () => { setSearch(""); setCityFilter(""); setTypeFilter(""); setSortBy("default"); };

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero */}
        <section className="relative py-24 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
          <div className="relative z-10">
            <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/60 uppercase mb-4">✦ Curated Properties ✦</p>
            <h1 className="font-cormorant text-5xl md:text-7xl font-light mb-6">
              Venue <span className="text-primary italic font-semibold">Directory</span>
            </h1>
            <p className="font-manrope text-white/60 max-w-2xl mx-auto text-base font-light mb-10">
              Discover India's most exquisite venues for your perfect celebration.
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                [venues.length, "Venues"],
                [uniqueCities.length, "Cities"],
                [uniqueTypes.length, "Types"],
              ].map(([n, l], i, arr) => (
                <div key={String(l)} className="flex items-center gap-8 md:gap-16">
                  <div className="flex flex-col items-center">
                    <span className="font-cormorant text-3xl text-primary font-semibold">{n}</span>
                    <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/40 uppercase mt-1">{l}</span>
                  </div>
                  {i < arr.length - 1 && <div className="w-px h-10 bg-white/10" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sticky Toolbar */}
        <div className="sticky top-16 z-40 bg-[#080604]/95 backdrop-blur-xl border-b border-white/10">
          <div className="py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-manrope text-sm text-white/50 font-light shrink-0">
              Showing <span className="text-primary font-semibold">{filtered.length}</span>
              <span className="text-white/30"> / {venues.length}</span> venues
            </div>
            <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
              <div className="relative w-full md:w-56 bg-white/[0.04] border border-white/10 rounded-sm overflow-hidden">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="text" placeholder="Search venues..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-transparent text-white text-sm font-manrope font-light focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/30"
                />
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
              <div className="relative w-full md:w-44 bg-white/[0.04] border border-white/10 rounded-sm overflow-hidden">
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 bg-transparent text-white text-sm font-manrope font-light appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50">
                  <option value="" className="bg-[#1a1510]">All Types</option>
                  {uniqueTypes.map(t => <option key={t} value={t} className="bg-[#1a1510]">{t}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>
              <div className="relative w-full md:w-52 bg-white/[0.04] border border-white/10 rounded-sm overflow-hidden">
                <ArrowUpDown className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-transparent text-white text-sm font-manrope font-light appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-[#1a1510]">{o.label}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                <button onClick={() => setViewMode("grid")} title="Grid view"
                  className={`p-2.5 border transition-all ${viewMode === "grid" ? "border-primary/50 bg-primary/10 text-primary" : "border-white/10 text-white/40 hover:text-white/70"}`}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode("map")} title="Map view"
                  className={`p-2.5 border transition-all ${viewMode === "map" ? "border-primary/50 bg-primary/10 text-primary" : "border-white/10 text-white/40 hover:text-white/70"}`}>
                  <MapIcon className="w-4 h-4" />
                </button>
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
                    <button onClick={clearAll} className="flex items-center gap-1 px-3 py-1 text-white/40 font-manrope text-xs hover:text-white/70 transition-colors underline underline-offset-2">
                      Clear all
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {viewMode === "map" && (
          <section className="py-8 px-6 md:px-12 bg-[#080604]">
            <div className="max-w-7xl mx-auto">
              <VenueMap
                venues={filtered as unknown as MapVenue[]}
                onVenueClick={name => { const v = filtered.find(f => f.property_name === name); if (v) setSelected(v); }}
              />
            </div>
          </section>
        )}
        {viewMode === "grid" && (
        <section className="py-16 px-6 md:px-12 bg-[#080604]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((venue, idx) => {
                const typeKey    = normalizeType(venue.type);
                const typeColor  = TYPE_COLOR[typeKey] ?? "#c9a96e";
                const hasRooms   = !!venue.max_rooms && venue.max_rooms !== "0";
                const hasCap     = !!venue.max_banquet_capacity && venue.max_banquet_capacity !== "0";
                const hasPhone   = !!venue.contact_number;
                const hasCatering = !!venue.catering_type;
                const hasPerson  = !!venue.concerned_person_name;
                const slId       = `venue-${venue.property_name}-${venue.city_sheet}`;
                const isSlisted  = has(slId);

                const cardImg = getVenueCardImg(venue.property_name, typeKey);

                return (
                  <motion.div
                    layout
                    key={venue.property_name + venue.city_sheet + idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.25), duration: 0.4 }}
                    onClick={() => setSelected(venue)}
                    className="bg-[#1a1510] border border-white/5 rounded-sm overflow-hidden flex flex-col group hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={cardImg}
                        alt={venue.property_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510] via-[#1a1510]/30 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span
                          className="font-cinzel text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-1 rounded-sm bg-black/60 border border-white/10 backdrop-blur-sm"
                          style={{ color: typeColor }}
                        >
                          {typeKey || "VENUE"}
                        </span>
                      </div>
                      {isVenueVerified(venue.property_name) && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-sm border border-primary/20">
                          <BadgeCheck className="w-3 h-3 text-primary" />
                          <span className="font-cinzel text-[6.5px] tracking-[0.15em] text-primary uppercase">Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {venue.city_sheet && (
                            <span className="flex items-center gap-1 font-manrope text-[10px] text-white/35">
                              <MapPin className="w-3 h-3 text-primary/40" /> {venue.city_sheet}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); toggle({ id: slId, type: "venue", name: venue.property_name, city: venue.city_sheet }); }}
                          className={`w-7 h-7 flex items-center justify-center rounded-sm transition-all ${isSlisted ? "text-primary" : "text-white/20 hover:text-primary/70"}`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSlisted ? "fill-primary" : ""}`} />
                        </button>
                      </div>

                      <h3 className="text-xl font-cormorant font-bold text-white mb-1 leading-tight group-hover:text-primary transition-colors duration-300">
                        {venue.property_name}
                      </h3>
                      {venue.location && venue.location !== venue.city_sheet && (
                        <p className="font-manrope text-white/40 text-xs mb-4">{venue.location}</p>
                      )}

                      <div className="mt-auto pt-4 space-y-2.5 font-manrope text-xs text-white/60">
                        {hasPhone && (
                          user ? (
                            <div className="flex items-center gap-2.5">
                              <Phone className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                              <span className="font-mono truncate">{venue.contact_number}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Lock className="w-3.5 h-3.5 text-white/25 shrink-0" />
                              <span className="font-manrope text-[11px] text-white/30 italic">Members only</span>
                            </div>
                          )
                        )}
                        {hasPerson && user && (
                          <div className="flex items-center gap-2.5">
                            <span className="w-3.5 h-3.5 flex items-center justify-center text-primary/50 shrink-0 text-[10px]">👤</span>
                            <span className="truncate">{venue.concerned_person_name}</span>
                          </div>
                        )}
                        {hasRooms && (
                          <div className="flex items-center gap-2.5">
                            <Bed className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                            <span><span className="text-white font-medium">{venue.max_rooms}</span> Rooms</span>
                          </div>
                        )}
                        {hasCap && (
                          <div className="flex items-center gap-2.5">
                            <Users className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                            <span>Up to <span className="text-white font-medium">{venue.max_banquet_capacity}</span> guests</span>
                          </div>
                        )}
                        {hasCatering && (
                          <div className="flex items-center gap-2.5">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                            <span className="capitalize">{venue.catering_type.toLowerCase()}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-5 pt-4 border-t border-white/8">
                        <button className="w-full py-2.5 font-cinzel text-[10px] tracking-[0.2em] font-semibold text-primary border border-primary/30 rounded-sm group-hover:bg-primary group-hover:text-black transition-all duration-300 uppercase">
                          View Details
                        </button>
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
              <h3 className="font-cormorant text-2xl text-white mb-2">No Venues Found</h3>
              <p className="font-manrope text-white/50 text-sm max-w-md mx-auto font-light">No venues match your current filters.</p>
              <button onClick={clearAll} className="mt-8 px-6 py-2.5 border border-primary/50 text-primary font-cinzel text-[10px] tracking-widest hover:bg-primary hover:text-black transition-all uppercase">
                Clear All Filters
              </button>
            </motion.div>
          )}
        </section>
        )}
      </main>

      <Footer />

      {/* Detail modal */}
      {selected && <VenueDetailModal venue={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
