import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone } from "lucide-react";
import bmsLogo from "@assets/WhatsApp_Image_2026-05-06_at_4.23.32_PM-removebg-preview_1778229042227.png";

export function Footer() {
  return (
    <footer className="relative bg-[#050403] text-white overflow-hidden">
      {/* Background watermark logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-cinzel text-[18vw] font-black tracking-wider text-white/[0.02]">BMS</span>
      </div>

      {/* Top glow line */}
      <div className="gold-line" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-20 blur-3xl bg-primary/10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-20 pb-10">

        {/* Logo + Tagline */}
        <div className="text-center mb-14 md:mb-20">
          <div className="font-cinzel text-[10px] tracking-[0.5em] text-primary/60 uppercase mb-4">✦ Est. 2024 ✦</div>
          <div className="flex flex-col items-center gap-3 mb-4">
            <img
              src={bmsLogo}
              alt="Book My Squad"
              className="h-20 w-20 object-contain"
              style={{ mixBlendMode: "screen", filter: "brightness(1.2) saturate(1.1)" }}
            />
            <h2 className="font-cormorant text-4xl md:text-6xl text-white font-light">
              <span className="text-primary italic">Book</span> My Squad
            </h2>
          </div>
          <p className="font-manrope text-white/45 text-sm tracking-widest uppercase">Premium Event Planning</p>
          <div className="gold-line w-24 mx-auto mt-8" />
        </div>

        {/* Main links + offices grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10 mb-14 md:mb-20">

          {/* Discover */}
          <div>
            <h4 className="font-cinzel text-[10px] tracking-[0.4em] text-primary/80 uppercase mb-5">Discover</h4>
            <ul className="space-y-3">
              {["Venues", "Vendors", "Real Weddings", "Blog", "Photos"].map(link => (
                <li key={link}>
                  <a href="#" className="font-manrope text-sm text-white/55 hover:text-primary/90 transition-colors duration-300">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-cinzel text-[10px] tracking-[0.4em] text-primary/80 uppercase mb-5">Services</h4>
            <ul className="space-y-3">
              {["Photography", "Makeup", "Catering", "Decorator", "Entertainment"].map(link => (
                <li key={link}>
                  <a href="#" className="font-manrope text-sm text-white/55 hover:text-primary/90 transition-colors duration-300">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-cinzel text-[10px] tracking-[0.4em] text-primary/80 uppercase mb-5">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Careers", "Press", "Contact Us", "Privacy Policy"].map(link => (
                <li key={link}>
                  <a href="#" className="font-manrope text-sm text-white/55 hover:text-primary/90 transition-colors duration-300">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-cinzel text-[10px] tracking-[0.4em] text-primary/80 uppercase mb-5">Cities</h4>
            <ul className="space-y-3">
              {["Mumbai", "Delhi", "Jaipur", "Goa", "Udaipur", "Bangalore", "Hyderabad", "Kolkata"].map(link => (
                <li key={link}>
                  <a href="#" className="font-manrope text-sm text-white/55 hover:text-primary/90 transition-colors duration-300">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Offices */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h4 className="font-cinzel text-[10px] tracking-[0.4em] text-primary/80 uppercase mb-5">Contact Us</h4>

            <div className="space-y-5">
              {/* Phone */}
              <a href="tel:+918796318282" className="flex items-center gap-2 font-manrope text-sm text-white/65 hover:text-primary transition-colors group">
                <Phone className="w-3.5 h-3.5 text-primary/60 group-hover:text-primary shrink-0" />
                +91 8796318282
              </a>

              {/* Corporate Office */}
              <div>
                <p className="font-cinzel text-[9px] tracking-[0.3em] text-primary/55 uppercase mb-1.5">Corporate Office</p>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary/50 shrink-0 mt-0.5" />
                  <p className="font-manrope text-xs text-white/50 leading-relaxed">
                    Unitech Cyber Park,<br />
                    Sector 39, Gurugram,<br />
                    122003
                  </p>
                </div>
              </div>

              {/* Registered Office */}
              <div>
                <p className="font-cinzel text-[9px] tracking-[0.3em] text-primary/55 uppercase mb-1.5">Registered Office</p>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary/50 shrink-0 mt-0.5" />
                  <p className="font-manrope text-xs text-white/50 leading-relaxed">
                    Shastri Nagar,<br />
                    Meerut, 250004
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex justify-center gap-4 mb-12">
          {[
            { icon: <Facebook className="w-4 h-4" />, label: "Facebook" },
            { icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
            { icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
            { icon: <Youtube className="w-4 h-4" />, label: "YouTube" },
          ].map(s => (
            <a
              key={s.label}
              href="#"
              aria-label={s.label}
              className="w-10 h-10 border border-white/15 hover:border-primary/50 flex items-center justify-center text-white/45 hover:text-primary transition-all duration-300"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="gold-line mb-7" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
          <p className="font-manrope text-[11px] text-white/45 tracking-wider">
            © 2025 Book My Squad. All rights reserved. | Copyright{" "}
            <span className="text-primary/70">Namrata Muralidharan</span>
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(link => (
              <a key={link} href="#" className="font-manrope text-[11px] text-white/40 hover:text-white/70 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
