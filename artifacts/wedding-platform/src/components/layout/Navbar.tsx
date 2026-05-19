import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, ChevronDown, User, LogOut, Heart, LayoutDashboard, ShieldCheck, Briefcase, Building2, Bell, MapPin, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import bmsLogo from "@assets/WhatsApp_Image_2026-05-06_at_4.23.32_PM-removebg-preview_1778229042227.png";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { ConsultationModal } from "@/components/ConsultationModal";

const navLinks = [
  { label: "Venues", href: "/venues" },
  { label: "Vendors", href: "/vendors" },
  { label: "Events", href: "/events" },
  { label: "Photos", href: "/photos" },
  { label: "Weddings", href: "/weddings" },
  { label: "Blog", href: "/blog" },
  { label: "Checklist", href: "/checklist" },
];

const PORTAL_META: Record<string, { label: string; href: string; icon: React.ElementType; color: string }> = {
  admin:  { label: "Admin Portal",  href: "/portal/admin",  icon: ShieldCheck, color: "text-red-400" },
  vendor: { label: "Vendor Portal", href: "/portal/vendor", icon: Briefcase,   color: "text-blue-400" },
  venue:  { label: "Venue Portal",  href: "/portal/venue",  icon: Building2,   color: "text-purple-400" },
};

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function getFirstName(name: string) {
  return name.split(" ")[0];
}

export function Navbar() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [consultOpen, setConsultOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    cities: string[];
    vendors: { name: string; category: string; city: string }[];
    venues: { name: string; city: string; type: string }[];
  } | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef    = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLInputElement>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  const BASE_API = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) { setSuggestions(null); return; }
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`${BASE_API}/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) setSuggestions(await res.json() as typeof suggestions);
      } catch { setSuggestions(null); }
    }, 180);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`/vendors?search=${encodeURIComponent(q)}`);
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 80);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate("/");
  };

  const portalMeta = user ? PORTAL_META[user.role] : null;

  return (
    <>
      <header className="w-full fixed top-0 left-0 z-50 flex flex-col">
        {/* Announcement Bar */}
        <div className="w-full bg-[#050403] py-2 flex justify-center items-center px-4">
          <div className="font-cinzel text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase text-primary/80 text-center">
            ✦ India's Finest Event Planning Platform ✦
          </div>
        </div>

        {/* Main Nav */}
        <div
          className={`w-full ${
            scrolled
              ? "bg-black/95 backdrop-blur-xl border-b border-white/8"
              : "bg-black/30 backdrop-blur-sm"
          } px-4 md:px-8 flex items-center justify-between transition-all duration-500`}
          style={{ height: "88px" }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer flex-shrink-0">
            <img
              src={bmsLogo}
              alt="Book My Squad"
              className="h-24 w-24 object-contain flex-shrink-0"
              style={{ filter: "drop-shadow(0 0 10px rgba(212,175,55,0.75)) drop-shadow(0 0 22px rgba(212,175,55,0.35)) brightness(1.15) saturate(1.25)" }}
            />
            <span className="font-cormorant text-3xl md:text-4xl font-semibold tracking-wide text-white hidden sm:block">
              <span className="text-primary italic">Book</span> My Squad
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative font-cinzel text-[12px] tracking-[0.2em] uppercase text-white/90 hover:text-primary transition-colors duration-300 whitespace-nowrap pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Plan Your Dream Event — sticky CTA */}
            <motion.button
              onClick={() => setConsultOpen(true)}
              className="hidden xl:flex items-center gap-2 px-5 py-2 bg-primary text-black font-cinzel font-bold text-[9px] tracking-[0.22em] uppercase hover:bg-primary/90 transition-all duration-300 gold-glow whitespace-nowrap"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Sparkles className="w-3 h-3" />
              Plan Your Dream Event
            </motion.button>

            <button
              onClick={openSearch}
              className="hidden md:flex text-white/70 hover:text-primary transition-colors p-1"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            {user && (
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setNotifOpen(o => !o)}
                  className="relative text-white/70 hover:text-primary transition-colors p-1"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-black font-bold rounded-full flex items-center justify-center" style={{ fontSize: "7px" }}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-80 bg-[#0d0a07] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
                        <p className="font-cinzel text-[9px] tracking-[0.22em] text-white/60 uppercase">Notifications</p>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="font-cinzel text-[8px] tracking-[0.12em] text-primary/75 uppercase hover:text-primary transition-colors">Mark all read</button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="font-manrope text-sm text-white/35 text-center py-8">No notifications yet</p>
                        ) : (
                          notifications.map(n => (
                            <button key={n.id} onClick={() => { markRead(n.id); setNotifOpen(false); }}
                              className={`w-full flex items-start gap-3 px-4 py-3 border-b border-white/5 text-left hover:bg-white/4 transition-colors ${!n.read ? "bg-primary/4" : ""}`}>
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-primary" : "bg-white/15"}`} />
                              <div className="flex-1 min-w-0">
                                <p className="font-cinzel text-[8.5px] tracking-[0.12em] uppercase text-white/75 mb-0.5">{n.title}</p>
                                <p className="font-manrope text-xs text-white/45 leading-snug">{n.message}</p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {user ? (
              /* Logged-in user avatar + dropdown */
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2.5 group"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center group-hover:border-primary transition-colors">
                    <span className="font-cinzel text-[11px] text-primary font-bold">{getInitials(user.name)}</span>
                  </div>
                  <div className="hidden md:flex items-center gap-1.5">
                    <span className="font-cinzel text-[10px] tracking-[0.1em] text-white/80 max-w-[100px] truncate">
                      {getFirstName(user.name)}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-white/50 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-64 bg-[#0d0a07] border border-white/10 shadow-2xl z-50"
                    >
                      {/* User info */}
                      <div className="px-4 py-4 border-b border-white/8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center">
                            <span className="font-cinzel text-sm text-primary font-bold">{getInitials(user.name)}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-cinzel text-[11px] text-white font-semibold truncate">{user.name}</p>
                            <p className="font-manrope text-[10px] text-white/40 truncate">{user.email}</p>
                            <span className="font-cinzel text-[8px] text-primary/70 uppercase tracking-wider">{user.role}</span>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-1.5">
                        {/* Role-specific portal link */}
                        {portalMeta && (
                          <Link href={portalMeta.href}>
                            <button
                              onClick={() => setUserMenuOpen(false)}
                              className={`w-full flex items-center gap-3 px-4 py-3 font-manrope text-sm hover:bg-white/5 transition-colors text-left border-b border-white/5 ${portalMeta.color}`}
                            >
                              <portalMeta.icon className="w-3.5 h-3.5 opacity-70" />
                              {portalMeta.label}
                            </button>
                          </Link>
                        )}

                        <Link href="/portal/profile">
                          <button
                            onClick={() => setUserMenuOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-3 font-manrope text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
                          >
                            <User className="w-3.5 h-3.5 text-primary/60" />
                            My Profile
                          </button>
                        </Link>

                        <Link href="/portal/saved">
                          <button
                            onClick={() => setUserMenuOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-3 font-manrope text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
                          >
                            <Heart className="w-3.5 h-3.5 text-primary/60" />
                            Saved Favourites
                          </button>
                        </Link>

                        {portalMeta && (
                          <Link href={portalMeta.href}>
                            <button
                              onClick={() => setUserMenuOpen(false)}
                              className={`w-full flex items-center gap-3 px-4 py-3 font-manrope text-sm hover:bg-white/5 transition-colors text-left ${portalMeta.color}`}
                            >
                              <LayoutDashboard className="w-3.5 h-3.5 opacity-60" />
                              Dashboard
                            </button>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-white/8 py-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 font-manrope text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Not logged in */
              <Link
                href="/login"
                className="relative hidden md:block font-cinzel text-[12px] tracking-[0.2em] uppercase text-white/90 hover:text-primary transition-colors pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300"
              >
                Login
              </Link>
            )}

            <Link
              href="/list-your-business"
              className="hidden lg:block font-cinzel text-[11px] tracking-[0.15em] uppercase bg-primary text-black px-5 py-2.5 hover:bg-primary/85 transition-colors font-bold"
            >
              List Business
            </Link>

            <button
              className="lg:hidden text-white/80 hover:text-primary transition-colors p-1"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="fixed top-[90px] left-1/2 -translate-x-1/2 z-[91] w-full max-w-2xl px-4"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="bg-[#0d0a07] border border-primary/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.1)] flex items-center gap-4 px-5 py-4">
                  <Search className="w-5 h-5 text-primary/60 shrink-0" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search vendors, services, cities…"
                    className="flex-1 bg-transparent border-none outline-none font-manrope text-base text-white placeholder:text-white/25"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")} className="text-white/30 hover:text-white/60 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="font-cinzel text-[9px] tracking-[0.2em] uppercase bg-primary text-black px-4 py-2 hover:bg-primary/85 transition-colors font-bold shrink-0"
                  >
                    Search
                  </button>
                </div>
                {suggestions && (suggestions.cities.length > 0 || suggestions.vendors.length > 0 || suggestions.venues.length > 0) && (
                  <div className="absolute top-full left-0 right-0 z-[100] bg-[#0d0a07] border border-primary/20 border-t-0 shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-72 overflow-y-auto">
                    {suggestions.cities.length > 0 && (
                      <div className="p-2">
                        <p className="font-cinzel text-[8px] tracking-[0.25em] text-primary/40 uppercase px-3 py-1">Cities</p>
                        {suggestions.cities.map(city => (
                          <button key={city} type="button" onClick={() => { navigate(`/venues?city=${encodeURIComponent(city)}`); setSearchOpen(false); setSuggestions(null); setSearchQuery(""); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors text-left">
                            <MapPin className="w-3 h-3 text-primary/40 shrink-0" />
                            <span className="font-manrope text-sm text-white/70">{city}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {suggestions.vendors.length > 0 && (
                      <div className={suggestions.cities.length > 0 ? "border-t border-white/5 p-2" : "p-2"}>
                        <p className="font-cinzel text-[8px] tracking-[0.25em] text-primary/40 uppercase px-3 py-1">Vendors</p>
                        {suggestions.vendors.map(v => (
                          <button key={v.name} type="button" onClick={() => { navigate(`/vendors?search=${encodeURIComponent(v.name)}`); setSearchOpen(false); setSuggestions(null); setSearchQuery(""); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors text-left">
                            <Briefcase className="w-3 h-3 text-primary/40 shrink-0" />
                            <div className="min-w-0">
                              <span className="font-manrope text-sm text-white/70 block truncate">{v.name}</span>
                              <span className="font-cinzel text-[8px] tracking-[0.1em] text-primary/35 uppercase">{v.category} · {v.city}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {suggestions.venues.length > 0 && (
                      <div className={(suggestions.cities.length > 0 || suggestions.vendors.length > 0) ? "border-t border-white/5 p-2" : "p-2"}>
                        <p className="font-cinzel text-[8px] tracking-[0.25em] text-primary/40 uppercase px-3 py-1">Venues</p>
                        {suggestions.venues.map(v => (
                          <button key={v.name} type="button" onClick={() => { navigate(`/venues?search=${encodeURIComponent(v.name)}`); setSearchOpen(false); setSuggestions(null); setSearchQuery(""); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors text-left">
                            <Building2 className="w-3 h-3 text-primary/40 shrink-0" />
                            <div className="min-w-0">
                              <span className="font-manrope text-sm text-white/70 block truncate">{v.name}</span>
                              <span className="font-cinzel text-[8px] tracking-[0.1em] text-primary/35 uppercase">{v.type} · {v.city}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-2 flex gap-2 flex-wrap">
                  {["Wedding Venues", "Photography", "Bridal Makeup", "Catering", "DJ & Music"].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => { setSearchQuery(tag); searchRef.current?.focus(); }}
                      className="font-manrope text-[11px] text-white/40 hover:text-primary/80 border border-white/10 hover:border-primary/30 px-3 py-1 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-[101] h-full w-[80vw] max-w-sm bg-[#0a0806] border-l border-white/8 flex flex-col transition-transform duration-400 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <img
              src={bmsLogo}
              alt="BMS"
              className="h-14 w-14 object-contain flex-shrink-0"
              style={{ filter: "drop-shadow(0 0 8px rgba(212,175,55,0.7)) brightness(1.15) saturate(1.25)" }}
            />
            <span className="font-cormorant text-xl text-white font-semibold">
              <span className="text-primary italic">Book</span> My Squad
            </span>
          </div>
          <button
            className="text-white/60 hover:text-primary transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info in mobile drawer */}
        {user && (
          <div className="px-6 py-4 border-b border-white/8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center">
              <span className="font-cinzel text-sm text-primary font-bold">{getInitials(user.name)}</span>
            </div>
            <div>
              <p className="font-cinzel text-xs text-white font-semibold">{user.name}</p>
              <p className="font-manrope text-[10px] text-white/40">{user.email}</p>
              <span className="font-cinzel text-[8px] text-primary/60 uppercase tracking-wider">{user.role}</span>
            </div>
          </div>
        )}

        <nav className="flex flex-col px-6 py-6 gap-5 flex-1 overflow-y-auto">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-cinzel text-sm tracking-[0.25em] uppercase text-white/75 hover:text-primary transition-colors border-b border-white/5 pb-5"
              onClick={() => setMobileOpen(false)}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              {/* Portal link for non-customer roles */}
              {portalMeta && (
                <Link href={portalMeta.href} onClick={() => setMobileOpen(false)}
                  className={`font-cinzel text-sm tracking-[0.25em] uppercase border-b border-white/5 pb-5 flex items-center gap-2 ${portalMeta.color}`}>
                  <portalMeta.icon className="w-4 h-4 opacity-70" />
                  {portalMeta.label}
                </Link>
              )}
              <Link href="/portal/profile" onClick={() => setMobileOpen(false)}
                className="font-cinzel text-sm tracking-[0.25em] uppercase text-white/75 hover:text-primary transition-colors border-b border-white/5 pb-5">
                My Profile
              </Link>
              <button
                onClick={async () => { setMobileOpen(false); await handleLogout(); }}
                className="font-cinzel text-sm tracking-[0.25em] uppercase text-red-400/70 hover:text-red-400 transition-colors text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="font-cinzel text-sm tracking-[0.25em] uppercase text-white/75 hover:text-primary transition-colors border-b border-white/5 pb-5"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          )}

          <Link
            href="/list-your-business"
            className="font-cinzel text-sm tracking-[0.25em] uppercase text-primary hover:text-white transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            ✦ List Your Business
          </Link>
        </nav>

        {/* Mobile CTA */}
        <div className="px-6 pb-4">
          <button
            onClick={() => { setMobileOpen(false); setConsultOpen(true); }}
            className="w-full py-3.5 bg-primary text-black font-cinzel font-bold text-[9px] tracking-[0.25em] uppercase flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3 h-3" />
            Plan Your Dream Event
          </button>
        </div>

        <div className="px-6 py-6 border-t border-white/8">
          <p className="font-manrope text-[11px] text-white/35">✦ India's Finest Event Planning Platform ✦</p>
          <p className="font-manrope text-[10px] text-white/25 mt-2">📞 +91 8796318282</p>
        </div>
      </div>

      <ConsultationModal isOpen={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  );
}
