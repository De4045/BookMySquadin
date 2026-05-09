import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, MapPin, ChevronDown, ArrowRight, ArrowUpDown, Phone, Building2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VENDORS } from "@/data/vendors";

/* Normalise known category typos/variations so they display cleanly */
function normalizeCategory(raw: string): string {
  const s = (raw || "").trim().toUpperCase();
  if (s === "DEOCR" || s === "DECOR")     return "DECOR";
  if (s.includes("PLANNER"))              return "WEDDING PLANNERS";
  if (s.includes("MAKE"))                 return "MAKEUP ARTIST";
  if (s.includes("PHOTO"))               return "PHOTOGRAPHER";
  if (s.includes("CATER"))               return "CATERER";
  if (s.includes("MUSIC") || s.includes("DJ")) return "MUSIC & DJ";
  return s || "VENDOR";
}

const CAT_COLOR: Record<string, string> = {
  "DECOR":            "#8ab4e8",
  "WEDDING PLANNERS": "#c9a96e",
  "MAKEUP ARTIST":    "#e8a4c8",
  "PHOTOGRAPHER":     "#50e3c2",
  "CATERER":          "#f5a623",
  "MUSIC & DJ":       "#bd10e0",
};

const SORT_OPTIONS = [
  { value: "default",  label: "Default Order" },
  { value: "name-az",  label: "Name A → Z" },
  { value: "name-za",  label: "Name Z → A" },
  { value: "company",  label: "Company A → Z" },
  { value: "city",     label: "City A → Z" },
];

export default function Vendors() {
  const [search, setSearch]             = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [cityFilter, setCityFilter]     = useState("");
  const [sortBy, setSortBy]             = useState("default");

  /* All unique normalised categories */
  const uniqueCategories = useMemo(() =>
    [...new Set(VENDORS.map(v => normalizeCategory(v.category)))].sort()
  , []);

  /* All unique cities (non-empty) */
  const uniqueCities = useMemo(() =>
    [...new Set(VENDORS.map(v => v.city).filter(Boolean))].sort()
  , []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    let list = VENDORS.filter(v => {
      const cat = normalizeCategory(v.category);

      const matchSearch = !q ||
        v.name.toLowerCase().includes(q) ||
        (v.company || "").toLowerCase().includes(q) ||
        (v.city    || "").toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q);

      const matchCat  = !filterCategory || cat === filterCategory;
      const matchCity = !cityFilter     || v.city === cityFilter;

      return matchSearch && matchCat && matchCity;
    });

    switch (sortBy) {
      case "name-az":  list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-za":  list = [...list].sort((a, b) => b.name.localeCompare(a.name)); break;
      case "company":  list = [...list].sort((a, b) => (a.company || "").localeCompare(b.company || "")); break;
      case "city":     list = [...list].sort((a, b) => (a.city || "").localeCompare(b.city || "")); break;
    }

    return list;
  }, [search, filterCategory, cityFilter, sortBy]);

  const activeFilters: { label: string; clear: () => void }[] = [];
  if (search)         activeFilters.push({ label: `"${search}"`,           clear: () => setSearch("") });
  if (filterCategory) activeFilters.push({ label: filterCategory,          clear: () => setFilterCategory("") });
  if (cityFilter)     activeFilters.push({ label: cityFilter,               clear: () => setCityFilter("") });
  if (sortBy !== "default") {
    const s = SORT_OPTIONS.find(o => o.value === sortBy);
    if (s) activeFilters.push({ label: `Sort: ${s.label}`, clear: () => setSortBy("default") });
  }

  const clearAll = () => { setSearch(""); setFilterCategory(""); setCityFilter(""); setSortBy("default"); };

  /* Top category pills — unique normalised, max 5 */
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

            {/* Category quick-filter pills */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setFilterCategory("")}
                className={`px-5 py-2 rounded-sm border font-cinzel text-[10px] tracking-wider uppercase transition-all ${
                  filterCategory === ""
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-white/10 text-white/50 hover:border-primary/40 hover:text-primary"
                }`}
              >
                All Vendors
              </button>
              {topCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat === filterCategory ? "" : cat)}
                  className={`px-5 py-2 rounded-sm border font-cinzel text-[10px] tracking-wider uppercase transition-all ${
                    filterCategory === cat
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 text-white/50 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Sticky Toolbar */}
        <div className="sticky top-16 z-40 bg-[#080604]/95 backdrop-blur-xl border-b border-white/10">
          <div className="py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-manrope text-sm text-white/50 font-light shrink-0">
              Showing <span className="text-primary font-semibold">{filtered.length}</span>
              <span className="text-white/30"> / {VENDORS.length}</span> vendors
            </div>

            <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
              {/* Search */}
              <div className="relative w-full md:w-56 bg-white/[0.04] border border-white/10 rounded-sm overflow-hidden">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-transparent text-white text-sm font-manrope font-light focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/30"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* City */}
              <div className="relative w-full md:w-44 bg-white/[0.04] border border-white/10 rounded-sm overflow-hidden">
                <select
                  value={cityFilter}
                  onChange={e => setCityFilter(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 bg-transparent text-white text-sm font-manrope font-light appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  <option value="" className="bg-[#1a1510]">All Cities</option>
                  {uniqueCities.map(c => <option key={c} value={c} className="bg-[#1a1510]">{c}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>

              {/* Category */}
              <div className="relative w-full md:w-48 bg-white/[0.04] border border-white/10 rounded-sm overflow-hidden">
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 bg-transparent text-white text-sm font-manrope font-light appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  <option value="" className="bg-[#1a1510]">All Categories</option>
                  {uniqueCategories.map(cat => <option key={cat} value={cat} className="bg-[#1a1510]">{cat}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative w-full md:w-48 bg-white/[0.04] border border-white/10 rounded-sm overflow-hidden">
                <ArrowUpDown className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-transparent text-white text-sm font-manrope font-light appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-[#1a1510]">{o.label}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-6 md:px-12 pb-3 flex flex-wrap items-center gap-2">
                  <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/30 uppercase mr-1">Active:</span>
                  {activeFilters.map(f => (
                    <button
                      key={f.label}
                      onClick={f.clear}
                      className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 text-primary font-manrope text-xs rounded-sm hover:bg-primary/20 transition-colors"
                    >
                      {f.label}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                  {activeFilters.length > 1 && (
                    <button
                      onClick={clearAll}
                      className="px-3 py-1 text-white/40 font-manrope text-xs hover:text-white/70 transition-colors underline underline-offset-2"
                    >
                      Clear all
                    </button>
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
                const cat        = normalizeCategory(vendor.category);
                const accentColor = CAT_COLOR[cat] ?? "#c9a96e";

                const hasCompany = !!vendor.company;
                const hasCity    = !!vendor.city;
                const hasPhone   = !!vendor.contact;
                const hasState   = !!vendor.state;

                return (
                  <motion.div
                    layout
                    key={vendor.name + (vendor.company || "") + idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.25), duration: 0.4 }}
                    className="bg-[#1a1510] border border-white/5 rounded-sm overflow-hidden flex flex-col group hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer"
                  >
                    {/* Color top strip */}
                    <div className="h-0.5 w-full transition-opacity opacity-60 group-hover:opacity-100" style={{ backgroundColor: accentColor }} />

                    <div className="p-6 flex flex-col flex-grow">
                      {/* Category badge */}
                      <div className="font-cinzel text-[9px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: accentColor }}>
                        {cat}
                      </div>

                      {/* Name */}
                      <h3 className="text-xl font-cormorant font-bold text-white leading-tight group-hover:text-primary transition-colors duration-300 mb-1">
                        {vendor.name}
                      </h3>

                      {/* Company */}
                      {hasCompany && (
                        <p className="font-manrope text-white/50 text-sm mb-4">
                          {vendor.company}
                        </p>
                      )}

                      {/* Data rows — only when data exists */}
                      <div className="mt-auto pt-4 border-t border-white/5 space-y-2.5 font-manrope text-xs text-white/60">
                        {(hasCity || hasState) && (
                          <div className="flex items-center gap-2.5">
                            <MapPin className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                            <span>
                              {hasCity ? vendor.city : ""}
                              {hasCity && hasState ? ", " : ""}
                              {hasState ? vendor.state : ""}
                            </span>
                          </div>
                        )}
                        {hasPhone && (
                          <div className="flex items-center gap-2.5">
                            <Phone className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                            <a href={`tel:${vendor.contact}`} className="font-mono hover:text-primary transition-colors">
                              {vendor.contact}
                            </a>
                          </div>
                        )}
                        {!hasCity && !hasState && !hasPhone && (
                          <p className="text-white/25 italic text-xs">Contact info not available</p>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between">
                        <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/40 uppercase group-hover:text-primary transition-colors">
                          View Profile
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-white/30" />
              </div>
              <h3 className="font-cormorant text-2xl text-white mb-2">No Vendors Found</h3>
              <p className="font-manrope text-white/50 text-sm max-w-md mx-auto font-light">
                No professionals match your current filters. Try adjusting your search.
              </p>
              <button
                onClick={clearAll}
                className="mt-8 px-6 py-2.5 border border-primary/50 text-primary font-cinzel text-[10px] tracking-widest hover:bg-primary hover:text-black transition-all uppercase"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
