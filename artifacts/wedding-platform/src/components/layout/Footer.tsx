import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="relative bg-[#050403] text-white overflow-hidden">
      {/* Background watermark logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
        <span className="font-cinzel text-[20vw] font-black tracking-wider select-none">BMS</span>
      </div>
      
      {/* Gold top divider line */}
      <div className="gold-line" />
      
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-primary/40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 blur-3xl bg-primary/10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-10">
        {/* Logo and tagline */}
        <div className="text-center mb-20">
          <div className="font-cinzel text-[10px] tracking-[0.5em] text-primary/50 uppercase mb-4">✦ Est. 2024 ✦</div>
          <h2 className="font-cormorant text-5xl md:text-7xl text-white font-light mb-4">
            <span className="text-primary italic">Book</span> My Squad
          </h2>
          <p className="font-manrope text-white/30 text-sm tracking-widest uppercase">India's Finest Event Planning Platform</p>
          <div className="gold-line w-24 mx-auto mt-8" />
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          {[
            { title: "Discover", links: ["Venues", "Vendors", "Real Weddings", "Blog", "Photos"] },
            { title: "Services", links: ["Photography", "Makeup", "Catering", "Decorator", "Entertainment"] },
            { title: "Company", links: ["About Us", "Careers", "Press", "Contact Us", "Privacy Policy"] },
            { title: "Cities", links: ["Mumbai", "Delhi", "Jaipur", "Goa", "Udaipur", "Bangalore", "Hyderabad", "Kolkata"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-cinzel text-[10px] tracking-[0.4em] text-primary/60 uppercase mb-6">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="font-manrope text-sm text-white/30 hover:text-primary/80 transition-colors duration-300">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social icons */}
        <div className="flex justify-center gap-6 mb-16">
          {["Facebook", "Instagram", "Twitter", "YouTube"].map(social => (
            <a key={social} href="#" className="w-10 h-10 border border-white/10 hover:border-primary/40 flex items-center justify-center text-white/30 hover:text-primary transition-all duration-300 text-xs font-cinzel">
              {social[0]}
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="gold-line mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-manrope text-[11px] text-white/20 tracking-wider">© 2025 Book My Squad. All rights reserved.</p>
          <div className="flex gap-8">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(link => (
              <a key={link} href="#" className="font-manrope text-[11px] text-white/20 hover:text-white/50 transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}