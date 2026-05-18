import React from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Home, MapPin, Briefcase, Heart, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useShortlist } from "@/context/ShortlistContext";

const NAV_ITEMS = [
  { href: "/",        icon: Home,     label: "Home" },
  { href: "/venues",  icon: MapPin,   label: "Venues" },
  { href: "/vendors", icon: Briefcase,label: "Vendors" },
  { href: "/portal/saved", icon: Heart, label: "Saved" },
  { href: "/portal/profile", icon: User, label: "Profile" },
] as const;

export function MobileBottomNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { items: shortlist } = useShortlist();

  const isPortal = location.startsWith("/portal/admin") ||
                   location.startsWith("/portal/vendor") ||
                   location.startsWith("/portal/venue");
  if (isPortal) return null;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]"
      style={{
        background: "linear-gradient(180deg, rgba(8,6,4,0.0) 0%, rgba(8,6,4,0.92) 12%, rgba(8,6,4,0.98) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(212,175,55,0.12)",
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = href === "/" ? location === "/" : location.startsWith(href);
          const isSaved = href === "/portal/saved";
          const savedCount = isSaved ? shortlist.length : 0;

          const loginHref = !user && (href === "/portal/saved" || href === "/portal/profile")
            ? "/login"
            : href;

          return (
            <Link key={href} href={loginHref}>
              <motion.button
                whileTap={{ scale: 0.88 }}
                className="relative flex flex-col items-center gap-1 min-w-[52px] py-1.5 px-2"
              >
                <div className="relative">
                  <Icon
                    className="w-5 h-5 transition-colors duration-200"
                    style={{ color: isActive ? "#d4af37" : "rgba(255,255,255,0.45)" }}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  {savedCount > 0 && isSaved && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center font-cinzel text-[8px] font-bold text-black"
                      style={{ backgroundColor: "#d4af37" }}
                    >
                      {savedCount > 9 ? "9+" : savedCount}
                    </span>
                  )}
                </div>

                <span
                  className="font-cinzel text-[8px] tracking-[0.1em] uppercase transition-colors duration-200"
                  style={{ color: isActive ? "#d4af37" : "rgba(255,255,255,0.35)" }}
                >
                  {label}
                </span>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full"
                      style={{ backgroundColor: "#d4af37" }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
