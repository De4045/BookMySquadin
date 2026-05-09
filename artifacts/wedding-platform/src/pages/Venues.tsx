import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VENUES } from "@/data/venues";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Users, Bed, Search, ChevronDown, X, ArrowUpDown, UtensilsCrossed, Heart } from "lucide-react";
import { VenueDetailModal } from "@/components/VenueDetailModal";
import { useShortlist } from "@/context/ShortlistContext";
import { type Venue } from "@/data/venues";

const TYPE_COLOR: Record<string, string> = {
  HOTEL: "#4a90e2",
  RESORT: "#50e3c2",
  FARMHOUSE: "#f5a623",
  BANQUET: "#bd10e0",
};

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

export default function Venues() {
  const { has, toggle } = useShortlist();
  const [search, setSearch]         = useState("");
  const [cityFilter, setCityFilter]  = useState("");
  const [typeFilter, setTypeFilter]  = useState("");
  const [sortBy, setSortBy]          = useState("default");
  const [selected, setSelected]      = useState<Venue | null>(null);

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const city = params.get("city");
    const type = params.get("type");
    if (city) setCityFilter(city.toUpperCase());
    if (type) setTypeFilter(type.toUpperCase());
  }, []);

  const uniqueCities = useMemo(() =>
    [...new Set(VENUES.map(v => v.city_sheet).filter(Boolean))].sort()
  , []);

  const uniqueTypes = useMemo(() =>
    [...new Set(VENUES.map(v => normalizeType(v.type)).filter(Boolean))].sort()
  , []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list = VENUES.filter(v => {
      const matchSearch = !q ||
        (v.property_name || "").toLowerCase().includes(q) ||
        (v.location      || "").toLowerCase().includes(q) ||
        (v.city_sheet    || "").toLowerCase().includes(q);
      const matchCity = !cityFilter || v.city_sheet === cityFilter;
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
  }, [search, cityFilter, typeFilter, sortBy]);

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
                [VENUES.length, "Venues"],
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
              <span className="text-white/30"> / {VENUES.length}</span> venues
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

        {/* Grid */}
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
                    <div className="h-0.5 w-full transition-opacity opacity-60 group-hover:opacity-100" style={{ backgroundColor: typeColor }} />
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-cinzel text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-1 rounded-sm bg-black/40 border border-white/10" style={{ color: typeColor }}>
                          {typeKey || "VENUE"}
                        </span>
                        <div className="flex items-center gap-2">
                          {venue.city_sheet && (
                            <span className="flex items-center gap-1 font-manrope text-[10px] text-white/35">
                              <MapPin className="w-3 h-3 text-primary/40" /> {venue.city_sheet}
                            </span>
                          )}
                          <button
                            onClick={e => { e.stopPropagation(); toggle({ id: slId, type: "venue", name: venue.property_name, city: venue.city_sheet }); }}
                            className={`w-7 h-7 flex items-center justify-center rounded-sm transition-all ${isSlisted ? "text-primary" : "text-white/20 hover:text-primary/70"}`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isSlisted ? "fill-primary" : ""}`} />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-xl font-cormorant font-bold text-white mb-1.5 leading-tight group-hover:text-primary transition-colors duration-300">
                        {venue.property_name}
                      </h3>
                      {venue.location && venue.location !== venue.city_sheet && (
                        <p className="font-manrope text-white/40 text-xs mb-4">{venue.location}</p>
                      )}

                      <div className="mt-auto pt-4 space-y-2.5 font-manrope text-xs text-white/60">
                        {hasPhone && (
                          <div className="flex items-center gap-2.5">
                            <Phone className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                            <span className="font-mono truncate">{venue.contact_number}</span>
                          </div>
                        )}
                        {hasPerson && (
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
      </main>

      <Footer />

      {/* Detail modal */}
      {selected && <VenueDetailModal venue={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
