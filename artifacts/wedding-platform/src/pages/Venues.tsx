import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { VENUES } from "@/data/venues";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Users, Bed, Search, ChevronDown } from "lucide-react";

export default function Venues() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    VENUES.forEach(v => {
      if (v.city_sheet) cities.add(v.city_sheet);
    });
    return Array.from(cities).sort();
  }, []);

  const uniqueTypes = ["HOTEL", "RESORT", "FARMHOUSE", "BANQUET"];

  const filteredVenues = useMemo(() => {
    return VENUES.filter(venue => {
      const matchSearch = searchQuery.toLowerCase();
      const matchesSearch = 
        (venue.property_name || "").toLowerCase().includes(matchSearch) || 
        (venue.location || "").toLowerCase().includes(matchSearch) ||
        (venue.city_sheet || "").toLowerCase().includes(matchSearch);
      
      const matchesCity = cityFilter === "" ? true : venue.city_sheet === cityFilter;
      const matchesType = typeFilter === "" ? true : venue.type === typeFilter;

      return matchesSearch && matchesCity && matchesType;
    });
  }, [searchQuery, cityFilter, typeFilter]);

  const getTypeColor = (type: string) => {
    if (type === "HOTEL") return "#4a90e2";
    if (type === "RESORT") return "#50e3c2";
    if (type === "FARMHOUSE") return "#f5a623";
    if (type === "BANQUET") return "#bd10e0";
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
              ✦ Curated Properties ✦
            </div>
            <h1 className="font-cormorant text-5xl md:text-7xl font-light mb-6">
              Venue <span className="text-primary italic font-semibold">Directory</span>
            </h1>
            <p className="font-manrope text-white/60 max-w-2xl mx-auto text-base font-light mb-10">
              Discover India's most exquisite venues for your perfect celebration.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="flex flex-col items-center">
                <span className="font-cormorant text-3xl text-primary font-semibold">{VENUES.length}</span>
                <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/40 uppercase mt-1">Venues</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="font-cormorant text-3xl text-primary font-semibold">{uniqueCities.length}</span>
                <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/40 uppercase mt-1">Cities</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="font-cormorant text-3xl text-primary font-semibold">4</span>
                <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/40 uppercase mt-1">Types</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Toolbar */}
        <div className="sticky top-16 z-40 bg-[#080604]/95 backdrop-blur-xl border-b border-white/10 py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-manrope text-sm text-white/50 font-light">
            Showing <span className="text-primary font-medium">{filteredVenues.length}</span> venues
          </div>
          <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-3">
            <div className="relative w-full md:w-64 luxury-card rounded-sm overflow-hidden">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search venues..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-transparent border-none text-white text-sm font-manrope font-light focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/30"
                data-testid="input-search-venues"
              />
            </div>
            
            <div className="relative w-full md:w-48 luxury-card rounded-sm overflow-hidden">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-transparent border-none text-white text-sm font-manrope font-light appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
                data-testid="select-city-filter"
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-transparent border-none text-white text-sm font-manrope font-light appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
                data-testid="select-type-filter"
              >
                <option value="" className="bg-[#1a1510]">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type} className="bg-[#1a1510]">{type}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Venues Grid */}
        <section className="py-16 px-6 md:px-12 bg-[#080604]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue, idx) => {
              const typeColor = getTypeColor(venue.type || "");
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(idx * 0.05, 0.3), duration: 0.5 }}
                  key={idx} 
                  className="bg-[#1a1510] border border-white/5 rounded-sm overflow-hidden flex flex-col group hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer"
                  data-testid={`card-venue-${idx}`}
                >
                  <div className="p-6 flex flex-col flex-grow relative">
                    <div 
                      className="absolute top-0 left-0 w-full h-1 opacity-60 group-hover:opacity-100 transition-opacity" 
                      style={{ backgroundColor: typeColor }} 
                    />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-cinzel text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-1 rounded-sm bg-black/40 border border-white/10" style={{ color: typeColor }}>
                        {venue.type || "VENUE"}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-cormorant font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors duration-300">
                      {venue.property_name}
                    </h3>
                    
                    <div className="flex items-start gap-2 text-white/50 text-xs font-manrope mb-6">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/70" />
                      <span>{venue.location || venue.city_sheet}, {venue.city_sheet}</span>
                    </div>
                    
                    <div className="mt-auto space-y-3 font-manrope text-xs font-light text-white/70">
                      {venue.contact_number && (
                        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                          <Phone className="w-3.5 h-3.5 text-primary/50" />
                          <a href={`tel:${venue.contact_number}`} className="font-mono hover:text-primary transition-colors">
                            {venue.contact_number}
                          </a>
                        </div>
                      )}
                      
                      {venue.max_rooms && (
                        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                          <Bed className="w-3.5 h-3.5 text-primary/50" />
                          <span>{venue.max_rooms} Rooms</span>
                        </div>
                      )}
                      
                      {venue.max_banquet_capacity && (
                        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                          <Users className="w-3.5 h-3.5 text-primary/50" />
                          <span>Up to {venue.max_banquet_capacity} Pax</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <button className="w-full py-2.5 font-cinzel text-[10px] tracking-[0.2em] font-semibold text-primary border border-primary/30 rounded-sm group-hover:bg-primary group-hover:text-black transition-all duration-300 uppercase">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {filteredVenues.length === 0 && (
            <div className="text-center py-32 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-white/30" />
              </div>
              <h3 className="font-cormorant text-2xl text-white mb-2">No Venues Found</h3>
              <p className="font-manrope text-white/50 text-sm max-w-md mx-auto font-light">
                We couldn't find any venues matching your current filters. Try adjusting your search criteria.
              </p>
              <button 
                onClick={() => { setSearchQuery(""); setCityFilter(""); setTypeFilter(""); }}
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