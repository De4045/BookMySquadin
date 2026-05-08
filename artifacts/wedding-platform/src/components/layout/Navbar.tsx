import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, Menu, X } from "lucide-react";
import bmsLogo from "@assets/WhatsApp_Image_2026-05-06_at_4.23.32_PM-removebg-preview_1778229042227.png";

const navLinks = [
  { label: "Venues", href: "/venues" },
  { label: "Vendors", href: "/vendors" },
  { label: "Photos", href: "/" },
  { label: "Real Weddings", href: "/" },
  { label: "Blog", href: "/" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header className="w-full fixed top-0 left-0 z-50 flex flex-col">
        {/* Top Announcement Bar */}
        <div className="w-full bg-[#050403] py-2 flex justify-center items-center px-4">
          <div className="font-cinzel text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase text-primary/80 text-center">
            ✦ India's Finest Event Planning Platform ✦
          </div>
        </div>

        {/* Main Navigation */}
        <div
          className={`w-full ${
            scrolled
              ? "bg-black/95 backdrop-blur-xl border-b border-white/8"
              : "bg-black/20 backdrop-blur-sm"
          } h-16 px-4 md:px-8 flex items-center justify-between transition-all duration-500`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <img
              src={bmsLogo}
              alt="Book My Squad"
              className="h-10 w-10 object-contain"
              style={{ mixBlendMode: "screen", filter: "brightness(1.15) saturate(1.1)" }}
            />
            <span className="font-cormorant text-xl md:text-2xl font-semibold tracking-wide text-white hidden sm:block">
              <span className="text-primary italic">Book</span> My Squad
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-white/75 hover:text-primary transition-colors duration-300 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <button className="hidden md:flex text-white/70 hover:text-primary transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <Link
              href="/login"
              className="hidden md:block font-cinzel text-[10px] tracking-[0.2em] uppercase text-white/75 hover:text-primary transition-colors"
            >
              Login
            </Link>
            {/* Mobile hamburger */}
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

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <div
        className={`fixed top-0 right-0 z-[101] h-full w-[80vw] max-w-sm bg-[#0a0806] border-l border-white/8 flex flex-col transition-transform duration-400 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <img
            src={bmsLogo}
            alt="BMS"
            className="h-10 w-10 object-contain"
            style={{ mixBlendMode: "screen" }}
          />
          <button
            className="text-white/60 hover:text-primary transition-colors"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex flex-col px-6 py-8 gap-6 flex-1">
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
          <Link
            href="/login"
            className="font-cinzel text-sm tracking-[0.25em] uppercase text-white/75 hover:text-primary transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Login
          </Link>
        </nav>

        {/* Drawer footer */}
        <div className="px-6 py-6 border-t border-white/8">
          <p className="font-manrope text-[11px] text-white/35 leading-relaxed">
            ✦ India's Finest Event Planning Platform ✦
          </p>
          <p className="font-manrope text-[10px] text-white/25 mt-2">
            📞 +91 8796318282
          </p>
        </div>
      </div>
    </>
  );
}
