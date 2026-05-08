import React from "react";
import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-20 pb-8 px-6 md:px-12 font-sans border-t-4 border-primary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="font-serif text-3xl font-bold text-white mb-4 block">
              <span className="text-primary italic">B</span>ook My Squad
            </Link>
            <p className="text-white/60 text-sm mb-6 max-w-sm">
              India's Finest Wedding Planning Platform. We help couples discover and book verified wedding vendors across India.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">For Couples</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href="#" className="hover:text-primary transition-colors">Venues</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Vendors</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Real Weddings</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Photos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">For Vendors</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href="#" className="hover:text-primary transition-colors">List Business</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Vendor Login</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Advertise</a></li>
            </ul>
            <h4 className="font-serif text-lg font-semibold mb-4 mt-8 text-white">Company</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">Cities</h4>
            <ul className="space-y-3 text-sm text-white/70 grid grid-cols-2 gap-x-4 gap-y-3">
              <li><a href="#" className="hover:text-primary transition-colors">Mumbai</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Delhi</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Bangalore</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Jaipur</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Chennai</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Hyderabad</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kolkata</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pune</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Goa</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Udaipur</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>© 2025 Book My Squad. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
