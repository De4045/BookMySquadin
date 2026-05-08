import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 z-50 flex flex-col">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#050403] py-2 flex justify-center items-center">
        <div className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-primary/80">
          ✦ India's Finest Event Planning Platform ✦
        </div>
      </div>

      {/* Main Navigation */}
      <div className={`w-full ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'} h-16 px-4 md:px-8 flex items-center justify-between transition-all duration-500`}>
        <div className="flex-1 flex justify-start">
          <Link href="/" className="font-cormorant text-2xl font-semibold tracking-wide text-white cursor-pointer">
            <span className="text-primary italic">Book</span>{' '}My Squad
          </Link>
        </div>

        <div className="flex items-center justify-center gap-8 flex-1">
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/venues" className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-white/60 hover:text-primary transition-colors cursor-pointer">Venues</Link>
            <Link href="/vendors" className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-white/60 hover:text-primary transition-colors cursor-pointer">Vendors</Link>
            <Link href="/" className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-white/60 hover:text-primary transition-colors cursor-pointer">Photos</Link>
            <Link href="/" className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-white/60 hover:text-primary transition-colors cursor-pointer">Real Weddings</Link>
            <Link href="/" className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-white/60 hover:text-primary transition-colors cursor-pointer">Blog</Link>
          </div>
        </div>

        <div className="flex items-center justify-end gap-6 flex-1">
          <button className="text-white/60 hover:text-primary transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <Link href="/login" className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-white/60 hover:text-primary transition-colors cursor-pointer">Login</Link>
        </div>
      </div>
    </header>
  );
}