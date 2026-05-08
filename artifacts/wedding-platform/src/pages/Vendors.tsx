import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { VENDORS } from "@/data/vendors";

export default function Vendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPill, setFilterPill] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    VENDORS.forEach(v => {
      if (v.city) cities.add(v.city);
    });
    return Array.from(cities).sort();
  }, []);

  const filteredVendors = useMemo(() => {
    return VENDORS.filter(vendor => {
      const matchSearch = searchQuery.toLowerCase();
      const matchesSearch = 
        vendor.name.toLowerCase().includes(matchSearch) || 
        vendor.company.toLowerCase().includes(matchSearch) ||
        vendor.city.toLowerCase().includes(matchSearch) ||
        vendor.state.toLowerCase().includes(matchSearch);
      
      const matchesPill = filterPill === "" || filterPill === "All Vendors" ? true : vendor.category === filterPill;
      const matchesCity = cityFilter === "" ? true : vendor.city === cityFilter;

      return matchesSearch && matchesPill && matchesCity;
    });
  }, [searchQuery, filterPill, cityFilter]);

  const getCategoryColor = (category: string) => {
    if (category === "Wedding planners") return "#c87a8a"; // rose/pink
    if (category === "MAKE UP ARTIST") return "#8ab4e8"; // blue
    if (category === "DEOCR") return "#8ae8b4"; // green
    return "#c87a8a";
  };

  const pills = ["All Vendors", "Wedding planners", "MAKE UP ARTIST", "DEOCR"];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative py-24 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden border-b border-[#2a2a2a]">
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{
              backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-[#c87a8a]" />
              <span className="text-[#c87a8a] tracking-[0.2em] text-xs font-semibold uppercase">Vendor Network</span>
              <div className="w-12 h-px bg-[#c87a8a]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif mb-6">
              Our <span className="text-[#c87a8a] italic">Partners</span> & Vendors
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              A curated network of professionals across wedding planning, décor, and beauty services.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {pills.map(pill => (
                <button
                  key={pill}
                  onClick={() => setFilterPill(pill)}
                  className={`px-6 py-2 rounded-full border text-sm font-medium transition-all ${
                    (filterPill === pill || (pill === "All Vendors" && filterPill === "")) 
                      ? "border-[#c87a8a] bg-[#c87a8a]/20 text-white" 
                      : "border-white/10 hover:border-white/30 text-white/60 hover:text-white"
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <div className="sticky top-16 z-40 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#2a2a2a] py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/50">
            Showing <span className="text-white font-medium">{filteredVendors.length}</span> vendors
          </div>
          <div className="flex w-full md:w-auto items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <Input 
                type="text" 
                placeholder="Search vendors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-white/40 rounded-sm focus-visible:ring-[#c87a8a]"
              />
            </div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-sm h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#c87a8a]"
            >
              <option value="">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Vendor Grid */}
        <section className="py-12 px-6 md:px-12 bg-[#0d0d0d]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor, idx) => {
              const accentColor = getCategoryColor(vendor.category);
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  key={idx} 
                  className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-sm overflow-hidden flex flex-col hover:border-[#4a4a4a] transition-colors"
                >
                  <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-[10px] uppercase tracking-wider font-bold mb-3" style={{ color: accentColor }}>
                      {vendor.category}
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {vendor.name}
                    </h3>
                    <p className="text-[#d4af37] text-sm mb-4">
                      {vendor.company || "Independent"}
                    </p>
                    
                    <div className="mt-auto space-y-2 text-sm text-white/50 mb-6">
                      <p>
                        <span className="font-medium text-white/70">Location:</span> {vendor.city ? `${vendor.city}${vendor.state ? `, ${vendor.state}` : ''}` : "—"}
                      </p>
                      <p>
                        <span className="font-medium text-white/70">Phone:</span> {vendor.contact ? (
                          <a href={`tel:${vendor.contact}`} className="hover:text-white transition-colors font-mono">{vendor.contact}</a>
                        ) : "—"}
                      </p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent hover:bg-white/5 transition-colors border-white/20 text-white"
                      style={{ borderColor: `${accentColor}40`, color: accentColor }}
                    >
                      Contact
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {filteredVendors.length === 0 && (
            <div className="text-center py-20 text-white/50">
              No vendors found matching your filters.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}