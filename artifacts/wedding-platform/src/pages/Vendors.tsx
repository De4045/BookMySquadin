import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, MapPin, ChevronDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { VENDORS } from "@/data/vendors";

export default function Vendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    VENDORS.forEach(v => {
      if (v.city) cities.add(v.city);
    });
    return Array.from(cities).sort();
  }, []);

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    VENDORS.forEach(v => {
      if (v.category) categories.add(v.category);
    });
    return Array.from(categories).sort();
  }, []);

  const filteredVendors = useMemo(() => {
    return VENDORS.filter(vendor => {
      const matchSearch = searchQuery.toLowerCase();
      const matchesSearch = 
        vendor.name.toLowerCase().includes(matchSearch) || 
        (vendor.company || "").toLowerCase().includes(matchSearch) ||
        (vendor.city || "").toLowerCase().includes(matchSearch);
      
      const matchesCategory = filterCategory === "" ? true : vendor.category === filterCategory;
      const matchesCity = cityFilter === "" ? true : vendor.city === cityFilter;

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [searchQuery, filterCategory, cityFilter]);

  const getCategoryColor = (category: string) => {
    const cat = category.toUpperCase();
    if (cat.includes("PLANNER")) return "#c9a96e"; // Gold
    if (cat.includes("MAKE")) return "#e8a4a4"; // Rose Gold
    if (cat.includes("DECOR")) return "#8ab4e8"; // Blue
    if (cat.includes("PHOTO")) return "#50e3c2"; // Mint
    return "#c9a96e"; // Default gold
  };

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative py-24 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
          
          <div className="relative z-10">
            <div className="font-cinzel text-[10px] tracking-[0.4em] text-primary/60 uppercase mb-4">
              ✦ Vendor Network ✦
            </div>
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
                  filterCategory === "" 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-white/10 text-white/50 hover:border-primary/40 hover:text-primary"
                }`}
              >
                All Vendors
              </button>
              {uniqueCategories.slice(0, 4).map(category => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-5 py-2 rounded-sm border font-cinzel text-[10px] tracking-wider uppercase transition-all ${
                    filterCategory === category 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-white/10 text-white/50 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <div className="sticky top-16 z-40 bg-[#080604]/95 backdrop-blur-xl border-b border-white/10 py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-manrope text-sm text-white/50 font-light">
            Showing <span className="text-primary font-medium">{filteredVendors.length}</span> vendors
          </div>
          <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-3">
            <div className="relative w-full md:w-64 luxury-card rounded-sm overflow-hidden">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search vendors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-transparent border-none text-white text-sm font-manrope font-light focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/30"
              />
            </div>
            
            <div className="relative w-full md:w-48 luxury-card rounded-sm overflow-hidden">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-transparent border-none text-white text-sm font-manrope font-light appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="" className="bg-[#1a1510]">All Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city} className="bg-[#1a1510]">{city}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>

            <div className="relative w-full md:w-48 luxury-card rounded-sm overflow-hidden">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-transparent border-none text-white text-sm font-manrope font-light appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="" className="bg-[#1a1510]">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category} className="bg-[#1a1510]">{category}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Vendor Grid */}
        <section className="py-16 px-6 md:px-12 bg-[#080604]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor, idx) => {
              const accentColor = getCategoryColor(vendor.category);
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(idx * 0.05, 0.3), duration: 0.5 }}
                  key={idx} 
                  className="bg-[#1a1510] border border-white/5 rounded-sm overflow-hidden flex flex-col group hover:border-primary/40 transition-all duration-500 cursor-pointer"
                >
                  <div className="h-1 w-full opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: accentColor }} />
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="font-cinzel text-[9px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: accentColor }}>
                      {vendor.category}
                    </div>
                    <h3 className="text-2xl font-cormorant font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors duration-300">
                      {vendor.name}
                    </h3>
                    <p className="font-manrope text-white/60 font-light text-sm mb-6 pb-4 border-b border-white/5">
                      {vendor.company || "Independent Professional"}
                    </p>
                    
                    <div className="mt-auto space-y-3 font-manrope text-xs font-light text-white/70">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                        <span>{vendor.city ? `${vendor.city}${vendor.state ? `, ${vendor.state}` : ''}` : "Location not specified"}</span>
                      </div>
                      
                      {vendor.contact && (
                        <div className="flex items-center gap-3">
                          <Search className="w-3.5 h-3.5 text-primary/50 shrink-0 opacity-0" /> {/* Placeholder for alignment */}
                          <a href={`tel:${vendor.contact}`} className="font-mono hover:text-primary transition-colors relative -left-6.5">
                            📞 {vendor.contact}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/40 uppercase group-hover:text-primary transition-colors">
                        View Profile
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {filteredVendors.length === 0 && (
            <div className="text-center py-32 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-white/30" />
              </div>
              <h3 className="font-cormorant text-2xl text-white mb-2">No Vendors Found</h3>
              <p className="font-manrope text-white/50 text-sm max-w-md mx-auto font-light">
                We couldn't find any professionals matching your filters. Try adjusting your search criteria.
              </p>
              <button 
                onClick={() => { setSearchQuery(""); setFilterCategory(""); setCityFilter(""); }}
                className="mt-8 px-6 py-2 border border-primary/50 text-primary font-cinzel text-xs tracking-wider hover:bg-primary hover:text-black transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}