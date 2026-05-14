import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, AlertCircle } from "lucide-react";
import bmsLogo from "@assets/WhatsApp_Image_2026-05-06_at_4.23.32_PM-removebg-preview_1778229042227.png";

const DISCOVER_LINKS: Record<string, string> = {
  "Venues": "/venues",
  "Vendors": "/vendors",
  "Weddings": "/weddings",
  "Blog": "/blog",
  "Photos": "/photos",
};

const SERVICE_LINKS: Record<string, string> = {
  "Photography": "/vendors",
  "Makeup": "/vendors",
  "Catering": "/vendors",
  "Decorator": "/vendors",
  "Entertainment": "/vendors",
};

const COMPANY_LINKS: Record<string, string> = {
  "About Us": "/about",
  "Careers": "/careers",
  "Press": "/press",
  "Contact Us": "/contact",
  "Privacy Policy": "/privacy",
};

const CITY_LINKS: Record<string, string> = {
  "Mumbai": "/venues",
  "Delhi": "/venues",
  "Jaipur": "/venues",
  "Goa": "/venues",
  "Udaipur": "/venues",
  "Bangalore": "/venues",
  "Hyderabad": "/venues",
  "Kolkata": "/venues",
};

const SOCIAL = [
  { icon: <Facebook className="w-4 h-4" />, label: "Facebook", href: "https://facebook.com" },
  { icon: <Instagram className="w-4 h-4" />, label: "Instagram", href: "https://instagram.com" },
  { icon: <Twitter className="w-4 h-4" />, label: "Twitter", href: "https://twitter.com" },
  { icon: <Youtube className="w-4 h-4" />, label: "YouTube", href: "https://youtube.com" },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="font-manrope text-sm text-white/55 hover:text-primary/90 transition-colors duration-300">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="font-manrope text-sm text-white/55 hover:text-primary/90 transition-colors duration-300">
      {children}
    </Link>
  );
}

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
          <Link href="/" className="flex flex-col items-center gap-3 mb-4 cursor-pointer">
            <img
              src={bmsLogo}
              alt="Book My Squad"
              className="h-24 w-24 object-contain"
              style={{ mixBlendMode: "screen", filter: "brightness(1.3) saturate(1.2) contrast(1.1)" }}
            />
            <h2 className="font-cormorant text-4xl md:text-6xl text-white font-light">
              <span className="text-primary italic">Book</span> My Squad
            </h2>
          </Link>
          <p className="font-manrope text-white/45 text-sm tracking-widest uppercase">Premium Event Planning</p>
          <div className="gold-line w-24 mx-auto mt-8" />
        </div>

        {/* Main links + offices grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10 mb-14 md:mb-20">

          {/* Discover */}
          <div>
            <h4 className="font-cinzel text-[10px] tracking-[0.4em] text-primary/80 uppercase mb-5">Discover</h4>
            <ul className="space-y-3">
              {Object.entries(DISCOVER_LINKS).map(([label, href]) => (
                <li key={label}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-cinzel text-[10px] tracking-[0.4em] text-primary/80 uppercase mb-5">Services</h4>
            <ul className="space-y-3">
              {Object.entries(SERVICE_LINKS).map(([label, href]) => (
                <li key={label}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-cinzel text-[10px] tracking-[0.4em] text-primary/80 uppercase mb-5">Company</h4>
            <ul className="space-y-3">
              {Object.entries(COMPANY_LINKS).map(([label, href]) => (
                <li key={label}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-cinzel text-[10px] tracking-[0.4em] text-primary/80 uppercase mb-5">Cities</h4>
            <ul className="space-y-3">
              {Object.entries(CITY_LINKS).map(([label, href]) => (
                <li key={label}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Offices */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h4 className="font-cinzel text-[10px] tracking-[0.4em] text-primary/80 uppercase mb-5">Contact Us</h4>

            <div className="space-y-5">
              <a href="tel:+91XXXXXXXXXX" className="flex items-center gap-2 font-manrope text-sm text-white/65 hover:text-primary transition-colors group">
                <Phone className="w-3.5 h-3.5 text-primary/60 group-hover:text-primary shrink-0" />
                +91 XXXXXXXXXX
              </a>

              <Link
                href="/list-your-business"
                className="inline-block mt-2 font-cinzel text-[9px] tracking-[0.25em] uppercase border border-primary/40 text-primary px-4 py-2.5 hover:bg-primary hover:text-black transition-all duration-300"
              >
                List Your Business
              </Link>
            </div>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex justify-center gap-4 mb-12">
          {SOCIAL.map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-10 h-10 border border-white/15 hover:border-primary/50 flex items-center justify-center text-white/45 hover:text-primary transition-all duration-300"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Disclaimer — highlighted */}
        <div className="mb-8 relative overflow-hidden rounded-sm"
          style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 50%, rgba(212,175,55,0.06) 100%)" }}>
          {/* Gold top stripe */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <div className="border border-primary/25 rounded-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary uppercase mb-3 font-semibold">⚠ Important Disclaimer</p>
                <p className="font-manrope text-xs text-white/60 leading-relaxed">
                  Book My Squad is a marketplace platform connecting event planners, couples, and vendors. All vendor and venue listings are independently operated third parties. Book My Squad does not guarantee the quality, safety, or legality of any listed services. Pricing, availability, and service details are subject to change and must be confirmed directly with the vendor or venue. Book My Squad is not liable for any disputes, damages, or losses arising from bookings or transactions made through this platform. Images used are for illustrative purposes only. By using this platform you agree to our{" "}
                  <Link href="/terms-of-service" className="text-primary/80 hover:text-primary underline underline-offset-2 transition-colors">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy-policy" className="text-primary/80 hover:text-primary underline underline-offset-2 transition-colors">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </div>
          {/* Gold bottom stripe */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>

        {/* Bottom bar */}
        <div className="gold-line mb-7" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
          <p className="font-manrope text-[11px] text-white/45 tracking-wider">
            © 2025 Book My Squad. All rights reserved. | Copyright{" "}
            <span className="text-primary/70">Namrata Muralidharan</span>
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            {(["Privacy Policy", "Terms of Service", "Cookie Policy"] as const).map(link => (
              <Link key={link} href={`/${link.toLowerCase().replace(/ /g, "-")}`} className="font-manrope text-[11px] text-white/40 hover:text-white/70 transition-colors">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
