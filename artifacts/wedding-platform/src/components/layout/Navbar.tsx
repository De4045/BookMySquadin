import React from "react";
import { Link } from "wouter";
import { Search, MapPin, ChevronDown, Phone, MessageCircle, Star, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="w-full fixed top-0 left-0 z-50 flex flex-col">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#1a1a1a] text-white/90 text-xs py-2 px-4 md:px-8 flex justify-between items-center hidden md:flex font-sans">
        <div className="tracking-widest uppercase font-medium text-[10px]">
          India's Favourite Event Planning Platform
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Phone className="w-3 h-3" />
            +91 98765 43210
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
            <MessageCircle className="w-3 h-3" />
            WhatsApp
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Star className="w-3 h-3" />
            Write A Review
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Smartphone className="w-3 h-3" />
            Download App
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="w-full bg-white/95 backdrop-blur-md border-b border-border h-16 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-colors">
            <MapPin className="w-4 h-4 text-primary" />
            <span>All Cities</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-foreground flex items-center gap-1 cursor-pointer">
            <span className="text-primary italic">B</span>MS
          </Link>
        </div>

        <div className="flex items-center justify-end gap-6 flex-1 text-sm font-medium font-sans">
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/" className="hover:text-primary transition-colors cursor-pointer">Venues</Link>
            <Link href="/vendors" className="hover:text-primary transition-colors cursor-pointer">Vendors</Link>
            <Link href="/" className="hover:text-primary transition-colors cursor-pointer">Photos</Link>
            <Link href="/" className="hover:text-primary transition-colors cursor-pointer">Real Weddings</Link>
            <Link href="/" className="hover:text-primary transition-colors cursor-pointer">Blog</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-foreground hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/login" className="hover:text-primary transition-colors font-medium">Login</Link>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-none px-6 hidden sm:flex font-semibold tracking-wide text-xs h-9 uppercase">
              List Free
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
