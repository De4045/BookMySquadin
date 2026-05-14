import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useShortlist } from "@/context/ShortlistContext";
import {
  Heart, Trash2, MapPin, ExternalLink, Camera, Building2,
  ArrowRight, ShieldCheck, Briefcase, LogOut,
} from "lucide-react";

const PORTAL_META: Record<string, { label: string; href: string; color: string }> = {
  admin:  { label: "Admin Portal",  href: "/portal/admin",  color: "text-red-400" },
  vendor: { label: "Vendor Portal", href: "/portal/vendor", color: "text-blue-400" },
  venue:  { label: "Venue Portal",  href: "/portal/venue",  color: "text-purple-400" },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  venue: Building2,
  vendor: Briefcase,
};

function EmptyState({ filter }: { filter: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-28 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-primary/8 border border-primary/20 flex items-center justify-center mb-6">
        <Heart className="w-8 h-8 text-primary/40" />
      </div>
      <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-3">✦ Nothing Saved Yet ✦</p>
      <h3 className="font-cormorant text-3xl text-white font-light mb-3">
        No saved {filter === "vendor" ? "vendors" : filter === "venue" ? "venues" : "favourites"}
      </h3>
      <p className="font-manrope text-sm text-white/40 max-w-sm leading-relaxed mb-8">
        Browse our curated directory and tap the heart icon on any vendor or venue to save them here for easy comparison.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/vendors">
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-cinzel text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-primary/90 transition-all gold-glow">
            Browse Vendors <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
        <Link href="/venues">
          <button className="flex items-center gap-2 px-6 py-3 border border-primary/35 text-primary font-cinzel text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-primary/8 transition-all">
            Explore Venues <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function SavedFavorites() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { items, remove } = useShortlist();
  const [filter, setFilter] = useState<"all" | "vendor" | "venue">("all");
  const [removingId, setRemovingId] = useState<string | null>(null);

  if (!user) {
    navigate("/login");
    return null;
  }

  const portalMeta = PORTAL_META[user.role];
  const filtered = filter === "all" ? items : items.filter(i => i.type === filter);
  const vendorCount = items.filter(i => i.type === "vendor").length;
  const venueCount = items.filter(i => i.type === "venue").length;

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      remove(id);
      setRemovingId(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080604]/98 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-cormorant text-xl font-semibold">
            <span className="text-primary italic">Book</span> My Squad
          </Link>
          <div className="w-px h-4 bg-white/15" />
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-primary" />
            <span className="font-cinzel text-[9px] tracking-[0.2em] text-primary/80 uppercase">Saved Favourites</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {portalMeta && (
            <>
              <Link href={portalMeta.href} className={`hidden md:flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.2em] uppercase transition-colors hover:opacity-80 ${portalMeta.color}`}>
                <ShieldCheck className="w-3 h-3" /> {portalMeta.label}
              </Link>
              <div className="w-px h-4 bg-white/15 hidden md:block" />
            </>
          )}
          <Link href="/" className="hidden md:flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.2em] text-white/35 hover:text-primary uppercase transition-colors">
            <ExternalLink className="w-3 h-3" /> Back to Site
          </Link>
          <div className="w-px h-4 bg-white/15 hidden md:block" />
          <span className="font-cinzel text-[10px] text-white/60 hidden md:block">{user.name}</span>
          <button
            onClick={async () => { await logout(); navigate("/"); }}
            className="flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.15em] uppercase text-white/35 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="pt-14">
        {/* Page header */}
        <div className="border-b border-white/8 bg-[#0a0806] px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-2">✦ Your Collection ✦</p>
                <h1 className="font-cormorant text-4xl font-light text-white">
                  Saved{" "}
                  <span className="text-primary italic font-semibold">Favourites</span>
                </h1>
                <p className="font-manrope text-sm text-white/40 mt-2">
                  {items.length === 0
                    ? "Start browsing to build your curated shortlist."
                    : `${items.length} saved item${items.length !== 1 ? "s" : ""} — ${vendorCount} vendor${vendorCount !== 1 ? "s" : ""}, ${venueCount} venue${venueCount !== 1 ? "s" : ""}`}
                </p>
              </div>
              {/* Quick nav back */}
              {portalMeta && (
                <Link href={portalMeta.href}>
                  <button className="flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-primary/30 font-cinzel text-[9px] tracking-[0.2em] uppercase text-white/50 hover:text-primary transition-all">
                    ← Back to Dashboard
                  </button>
                </Link>
              )}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 mt-6">
              {([
                { key: "all" as const, label: `All (${items.length})` },
                { key: "vendor" as const, label: `Vendors (${vendorCount})` },
                { key: "venue" as const, label: `Venues (${venueCount})` },
              ]).map(t => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  className={`px-4 py-2 font-cinzel text-[9px] tracking-[0.2em] uppercase border rounded-sm transition-all duration-200 ${
                    filter === t.key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 text-white/40 hover:border-primary/25 hover:text-white/60"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10">
          {filtered.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence>
                {filtered.map(item => {
                  const Icon = CATEGORY_ICONS[item.type] ?? Camera;
                  const isRemoving = removingId === item.id;
                  const listingHref = item.type === "venue" ? "/venues" : "/vendors";
                  const accentColor = item.type === "venue" ? "#9b8ae0" : "#d4af37";

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: isRemoving ? 0 : 1, scale: isRemoving ? 0.92 : 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.3 }}
                      className="group relative overflow-hidden rounded-sm border border-white/8 hover:border-primary/25 transition-all duration-300"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                      }}
                    >
                      {/* Top accent */}
                      <div className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }} />

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-sm flex items-center justify-center shrink-0"
                            style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}25` }}>
                            <Icon className="w-5 h-5" style={{ color: accentColor }} />
                          </div>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h3 className="font-cormorant text-xl text-white font-semibold leading-snug mb-1 group-hover:text-primary/90 transition-colors duration-300">
                          {item.name}
                        </h3>

                        <div className="flex items-center gap-3 mb-4">
                          <span
                            className="font-cinzel text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 border rounded-sm"
                            style={{ color: accentColor, borderColor: `${accentColor}35`, background: `${accentColor}10` }}
                          >
                            {item.type}
                          </span>
                          {item.category && (
                            <span className="font-manrope text-[11px] text-white/40">{item.category}</span>
                          )}
                        </div>

                        {item.city && (
                          <div className="flex items-center gap-1.5 mb-5">
                            <MapPin className="w-3.5 h-3.5 text-primary/40 shrink-0" />
                            <span className="font-manrope text-sm text-white/45">{item.city}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Link href={listingHref} className="flex-1">
                            <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-white/10 hover:border-primary/35 hover:bg-primary/5 font-cinzel text-[9px] tracking-[0.15em] uppercase text-white/50 hover:text-primary transition-all duration-200">
                              View Directory
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-2.5 border border-white/8 hover:border-red-400/30 hover:bg-red-400/5 hover:text-red-400 text-white/25 transition-all duration-200 rounded-sm"
                            title="Remove"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Browse more */}
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12 text-center"
            >
              <p className="font-cinzel text-[9px] tracking-[0.3em] text-white/25 uppercase mb-5">✦ Discover More ✦</p>
              <div className="flex gap-3 flex-wrap justify-center">
                <Link href="/vendors">
                  <button className="flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-primary/35 hover:bg-primary/5 font-cinzel text-[9px] tracking-[0.2em] uppercase text-white/45 hover:text-primary transition-all">
                    Browse Vendors <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
                <Link href="/venues">
                  <button className="flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-primary/35 hover:bg-primary/5 font-cinzel text-[9px] tracking-[0.2em] uppercase text-white/45 hover:text-primary transition-all">
                    Browse Venues <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
