import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useShortlist } from "@/context/ShortlistContext";
import { LogOut, ExternalLink, Heart, Building2, Briefcase, ShieldCheck, User, MapPin, ChevronRight } from "lucide-react";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const ROLE_META: Record<string, { label: string; color: string; icon: React.ElementType; portal: string; portalLabel: string }> = {
  admin:  { label: "Administrator",  color: "text-red-400 border-red-400/30 bg-red-400/10",    icon: ShieldCheck, portal: "/portal/admin",  portalLabel: "Admin Dashboard" },
  vendor: { label: "Vendor",         color: "text-blue-400 border-blue-400/30 bg-blue-400/10",  icon: Briefcase,   portal: "/portal/vendor", portalLabel: "Vendor Dashboard" },
  venue:  { label: "Venue Manager",  color: "text-purple-400 border-purple-400/30 bg-purple-400/10", icon: Building2, portal: "/portal/venue", portalLabel: "Venue Dashboard" },
  user:   { label: "Customer",       color: "text-green-400 border-green-400/30 bg-green-400/10", icon: User,       portal: "/",              portalLabel: "Back to Home" },
};

export default function Profile() {
  const { user, logout } = useAuth();
  const { items, remove } = useShortlist();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"account" | "shortlist">("account");

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080604] flex items-center justify-center">
        <div className="text-center">
          <p className="font-cormorant text-2xl text-white mb-4">Please log in to view your profile</p>
          <Link href="/login">
            <button className="px-6 py-3 bg-primary text-black font-cinzel text-xs tracking-widest uppercase hover:bg-primary/90 transition-all">Sign In</button>
          </Link>
        </div>
      </div>
    );
  }

  const meta = ROLE_META[user.role] ?? ROLE_META.user;
  const RoleIcon = meta.icon;
  const initials = user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const venueItems = items.filter(i => i.type === "venue");
  const vendorItems = items.filter(i => i.type === "vendor");

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080604]/98 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-cormorant text-xl font-semibold">
            <span className="text-primary italic">Book</span> My Squad
          </Link>
          <div className="w-px h-4 bg-white/15" />
          <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/40 uppercase">My Profile</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hidden md:flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.2em] text-white/35 hover:text-primary uppercase transition-colors">
            <ExternalLink className="w-3 h-3" /> Back to Site
          </Link>
          <div className="w-px h-4 bg-white/15 hidden md:block" />
          <button onClick={async () => { await logout(); navigate("/"); }}
            className="flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.15em] uppercase text-white/35 hover:text-red-400 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="pt-14">
        <div className="bg-[#0a0806] border-b border-white/8 px-6 flex gap-0">
          {[
            { key: "account", label: "Account" },
            { key: "shortlist", label: `Saved (${items.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className={`px-5 py-4 font-cinzel text-[9px] tracking-[0.2em] uppercase border-b-2 transition-all ${
                tab === t.key ? "border-primary text-primary" : "border-transparent text-white/35 hover:text-white/60"
              }`}>{t.label}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto px-6 py-10">

          {tab === "account" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5">
              {/* Profile card */}
              <div className="bg-[#1a1510] border border-white/8 p-8">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 rounded-sm bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                    <span className="font-cinzel text-3xl text-primary font-bold">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-cormorant text-3xl text-white font-semibold mb-1">{user.name}</h2>
                    <p className="font-manrope text-sm text-white/45 mb-2">{user.email}</p>
                    <span className={`font-cinzel text-[8px] uppercase tracking-[0.2em] px-2.5 py-1 border rounded-sm inline-flex items-center gap-1.5 ${meta.color}`}>
                      <RoleIcon className="w-3 h-3" /> {meta.label}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Full Name",      value: user.name },
                    { label: "Email Address",  value: user.email },
                    { label: "Account Type",   value: meta.label },
                    { label: "Member Since",   value: fmt(user.createdAt) },
                    { label: "Account Status", value: "Active" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/30 uppercase">{item.label}</span>
                      <span className="font-manrope text-sm text-white/65">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portal link */}
              {user.role !== "user" && (
                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/50 uppercase mb-3">Your Portal</p>
                  <p className="font-manrope text-sm text-white/45 mb-4">Access your dedicated management portal to manage listings and enquiries.</p>
                  <Link href={meta.portal}>
                    <button className="w-full flex items-center justify-between px-5 py-4 bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all group">
                      <div className="flex items-center gap-3">
                        <RoleIcon className="w-4 h-4 text-primary" />
                        <span className="font-cinzel text-[10px] tracking-[0.2em] text-primary uppercase">{meta.portalLabel}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>
                </div>
              )}

              {/* Danger zone */}
              <div className="bg-[#1a1510] border border-white/8 p-6">
                <p className="font-cinzel text-[10px] tracking-[0.3em] text-white/30 uppercase mb-3">Session</p>
                <button
                  onClick={async () => { await logout(); navigate("/"); }}
                  className="flex items-center gap-2.5 font-cinzel text-[10px] tracking-[0.2em] uppercase text-red-400/60 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out of Account
                </button>
              </div>
            </motion.div>
          )}

          {tab === "shortlist" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6">
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ Saved Favourites ✦</p>
                <h2 className="font-cormorant text-3xl font-light text-white">My <span className="text-primary italic font-semibold">Shortlist</span></h2>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-20 bg-[#1a1510] border border-white/8">
                  <Heart className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="font-cormorant text-2xl text-white/40 mb-2">No Saved Items</p>
                  <p className="font-manrope text-sm text-white/25 mb-6">Heart venues and vendors to save them here for easy comparison.</p>
                  <div className="flex justify-center gap-4">
                    <Link href="/venues"><button className="px-5 py-2.5 border border-primary/40 text-primary font-cinzel text-[9px] tracking-widest uppercase hover:bg-primary hover:text-black transition-all">Browse Venues</button></Link>
                    <Link href="/vendors"><button className="px-5 py-2.5 border border-white/15 text-white/50 font-cinzel text-[9px] tracking-widest uppercase hover:border-primary/40 hover:text-primary transition-all">Browse Vendors</button></Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {venueItems.length > 0 && (
                    <div>
                      <p className="font-cinzel text-[9px] tracking-[0.3em] text-white/30 uppercase mb-3">Saved Venues ({venueItems.length})</p>
                      <div className="space-y-2">
                        {venueItems.map(item => (
                          <div key={item.id} className="flex items-center justify-between bg-[#1a1510] border border-white/8 px-5 py-4 hover:border-primary/20 transition-colors">
                            <div className="flex items-center gap-3">
                              <Building2 className="w-4 h-4 text-primary/50 shrink-0" />
                              <div>
                                <p className="font-manrope text-sm text-white/80">{item.name}</p>
                                {item.city && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3 text-primary/30" />
                                    <span className="font-cinzel text-[8px] tracking-wider text-white/30 uppercase">{item.city}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Link href="/venues">
                                <button className="font-cinzel text-[9px] tracking-[0.15em] uppercase text-primary/60 hover:text-primary transition-colors">View</button>
                              </Link>
                              <button onClick={() => remove(item.id)} className="font-cinzel text-[9px] tracking-[0.15em] uppercase text-white/20 hover:text-red-400 transition-colors">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {vendorItems.length > 0 && (
                    <div>
                      <p className="font-cinzel text-[9px] tracking-[0.3em] text-white/30 uppercase mb-3">Saved Vendors ({vendorItems.length})</p>
                      <div className="space-y-2">
                        {vendorItems.map(item => (
                          <div key={item.id} className="flex items-center justify-between bg-[#1a1510] border border-white/8 px-5 py-4 hover:border-primary/20 transition-colors">
                            <div className="flex items-center gap-3">
                              <Briefcase className="w-4 h-4 text-primary/50 shrink-0" />
                              <div>
                                <p className="font-manrope text-sm text-white/80">{item.name}</p>
                                {item.category && (
                                  <span className="font-cinzel text-[8px] tracking-wider text-primary/40 uppercase">{item.category}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Link href="/vendors">
                                <button className="font-cinzel text-[9px] tracking-[0.15em] uppercase text-primary/60 hover:text-primary transition-colors">View</button>
                              </Link>
                              <button onClick={() => remove(item.id)} className="font-cinzel text-[9px] tracking-[0.15em] uppercase text-white/20 hover:text-red-400 transition-colors">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
