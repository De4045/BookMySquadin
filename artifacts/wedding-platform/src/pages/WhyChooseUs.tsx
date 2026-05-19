import { useRef } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useMeta } from "@/hooks/useMeta";
import { useScrollAnimation, useStaggerAnimation } from "@/hooks/useScrollAnimation";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { TiltCard } from "@/components/TiltCard";
import {
  ShieldCheck, Star, Globe, BadgeCheck, Headphones, Lock,
  Search, Heart, MessageSquare, CheckCircle2, ArrowRight,
  Users, MapPin, Trophy, Award, Sparkles, Instagram, Linkedin,
  ExternalLink,
} from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────────── */

const WHY_CARDS = [
  { icon: ShieldCheck, title: "Verified Vendors Only",       desc: "Every vendor is GST-verified and manually reviewed before listing — connect only with authentic, trusted professionals.", accent: "#d4af37" },
  { icon: Star,        title: "Curated Premium Listings",    desc: "No spam, no unverified listings. Every venue and vendor is curated for quality so your shortlist is always worth your time.", accent: "#f5a623" },
  { icon: Globe,       title: "Pan-India Coverage",          desc: "76+ cities across India including Goa, Udaipur, Jaipur, Rishikesh, Maldives, and Maldives — plus international destinations.", accent: "#50e3c2" },
  { icon: BadgeCheck,  title: "Transparent Reviews",         desc: "Real reviews from real couples. Our verified, moderated system ensures confident decisions for your big day.", accent: "#d4af37" },
  { icon: Headphones,  title: "Dedicated Planning Support",  desc: "Our expert team is available to help navigate the platform, shortlist vendors, and secure the best deals.", accent: "#e8a4c8" },
  { icon: Lock,        title: "Safe & Secure Platform",      desc: "Your data is protected. We never sell your details. All enquiries go directly to the vendor with your consent.", accent: "#9b8ae0" },
];

const EVENT_STATS = [
  { num: "500+",    label: "Events Organised",       icon: "✦" },
  { num: "20+",     label: "Premium Cities",          icon: "◇" },
  { num: "63,000+", label: "Happy Couples",           icon: "♡" },
  { num: "98%",     label: "Satisfaction Rate",       icon: "◈" },
  { num: "255+",    label: "Verified Vendors",        icon: "✿" },
  { num: "436+",    label: "Curated Venues",          icon: "◉" },
];

const PARTNER_BRANDS = [
  "Taj Hotels", "The Oberoi", "ITC Hotels", "The Leela", "JW Marriott", "Hyatt India",
  "Rambagh Palace", "Umaid Bhawan", "Samode Palace", "RAAS Hotels", "Aman Resorts",
  "Suryagarh", "Wilderness Resorts", "Conrad Hotels", "The Park Hotels",
  "Joseph Radhik", "Tasveer Studios", "Wizcraft Events", "Percept Live",
  "Ambika Pillai Studio", "Mickey Contractor", "E-Factor Events", "Shaadi Squad",
];

const GOOGLE_REVIEWS = [
  {
    name: "Ananya Sharma",
    location: "Delhi",
    rating: 5,
    date: "2 weeks ago",
    initials: "AS",
    color: "#4285F4",
    text: "Book My Squad completely transformed our wedding planning. Found our photographer, caterer, and decorator within days. Every vendor was professional and the platform feels incredibly premium.",
  },
  {
    name: "Rahul & Priya Gupta",
    location: "Mumbai",
    rating: 5,
    date: "1 month ago",
    initials: "RG",
    color: "#d4af37",
    text: "Used BMS for our Udaipur destination wedding. The vendor quality is exceptional — every contact was verified, professional, and delivered beyond expectations. Absolutely stunning results.",
  },
  {
    name: "Meera Krishnamurthy",
    location: "Bangalore",
    rating: 5,
    date: "3 weeks ago",
    initials: "MK",
    color: "#34A853",
    text: "The GST-verified badge gave us complete confidence. The shortlisting tool is a game-changer — we compared 8 photographers in one evening and booked the perfect one the next morning.",
  },
  {
    name: "Aditya & Kavya Singhania",
    location: "Hyderabad",
    rating: 5,
    date: "5 weeks ago",
    initials: "AK",
    color: "#EA4335",
    text: "We planned our entire destination wedding through Book My Squad — venue, makeup, photography, catering, décor. The coordination was seamless. Our guests still say it was the best wedding they'd attended.",
  },
  {
    name: "Shriya Nair",
    location: "Chennai",
    rating: 5,
    date: "2 months ago",
    initials: "SN",
    color: "#9b8ae0",
    text: "Responsive, professional, and beautifully designed platform. BMS helped us find a corporate event management team for our annual gala in under 48 hours. Highly recommend to every event organizer.",
  },
  {
    name: "Rohan & Neha Mehta",
    location: "Jaipur",
    rating: 5,
    date: "6 weeks ago",
    initials: "RM",
    color: "#f5a623",
    text: "We were sceptical about planning online but BMS changed everything. The vendor profiles are detailed, the reviews are genuine, and the booking process is smooth. Our palace wedding was perfection.",
  },
];

const TEAM = [
  {
    name: "Arjun Malhotra",
    role: "Founder & CEO",
    bio: "Former luxury hospitality director with 14 years at Taj Group. Passionate about making premium events accessible.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=85",
    instagram: "#",
    linkedin: "#",
  },
  {
    name: "Priya Sharma",
    role: "Head of Vendor Partnerships",
    bio: "Curated and onboarded 255+ premium vendors across India. Former wedding planner with 200+ celebrations in her portfolio.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=85",
    instagram: "#",
    linkedin: "#",
  },
  {
    name: "Rahul Nair",
    role: "CTO & Co-Founder",
    bio: "Full-stack architect who previously built platforms at Flipkart and Zomato. Obsessed with performance and elegant UX.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=85",
    instagram: "#",
    linkedin: "#",
  },
  {
    name: "Ananya Kapoor",
    role: "Head of Curation & Events",
    bio: "Personally reviews every vendor application. Has attended 80+ events across India to maintain quality standards.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=85",
    instagram: "#",
    linkedin: "#",
  },
  {
    name: "Vikram Sinha",
    role: "Lead Wedding Consultant",
    bio: "Your go-to planning expert. Helps couples navigate vendors, negotiate packages, and build their dream team.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=85",
    instagram: "#",
    linkedin: "#",
  },
  {
    name: "Sneha Reddy",
    role: "Head of Marketing",
    bio: "Brand storyteller behind Book My Squad's luxury identity. Previously led campaigns at Condé Nast India.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=85",
    instagram: "#",
    linkedin: "#",
  },
];

const AWARDS = [
  { year: "2026", title: "Best Wedding Platform",       org: "India Wedding Awards",         icon: Trophy,  color: "#d4af37" },
  { year: "2025", title: "Startup of the Year",         org: "Entrepreneur India",           icon: Award,   color: "#50e3c2" },
  { year: "2025", title: "Top 10 Luxury Event Platforms", org: "WedMeGood Awards",          icon: Star,    color: "#f5a623" },
  { year: "2025", title: "Best Customer Experience",    org: "India Digital Summit",         icon: BadgeCheck, color: "#e8a4c8" },
  { year: "2024", title: "Premium Vendor Network Award",org: "Event Planning Association",   icon: Sparkles, color: "#9b8ae0" },
  { year: "2024", title: "Most Trusted Marketplace",    org: "Couples' Choice Awards",       icon: ShieldCheck, color: "#d4af37" },
];

const TESTIMONIALS = [
  { name: "Priya & Rohan Sharma",       city: "Delhi → Udaipur",  rating: 5, text: "Book My Squad made finding a destination wedding photographer so effortless. We shortlisted 8 photographers in one evening and booked the perfect one within a week!" },
  { name: "Ananya Krishnamurthy",       city: "Bangalore",        rating: 5, text: "The GST-verified badge gave us so much confidence. We knew every vendor we contacted was a real, registered business. No stress at all." },
  { name: "Meera & Vikram Patel",       city: "Mumbai → Goa",    rating: 5, text: "We planned our entire beach wedding through Book My Squad — venue, makeup, photographer, caterer. The platform is absolutely stunning to use." },
  { name: "Karan & Shriya Mehta",       city: "Delhi",            rating: 5, text: "The comparison tool is a game-changer. We compared three decorators side-by-side with full portfolios, pricing, and reviews. Made our decision in 20 minutes." },
  { name: "Aisha & Ishaan Johari",      city: "Mumbai → Maldives", rating: 5, text: "Planning a destination wedding in the Maldives felt daunting. BMS made it feel like planning locally — every vendor was responsive and professional." },
  { name: "Kavya & Aditya Singhania",   city: "Bangalore → Jaipur", rating: 5, text: "Samode Palace was our dream venue. We found it on BMS, booked it in 3 days, and then used the same platform for every single vendor. Seamless from start to finish." },
];

const STEPS = [
  { n: "01", icon: Search,        title: "Search & Discover",   desc: "Browse verified vendors and venues by city, category, and budget — all in one beautiful interface." },
  { n: "02", icon: Heart,         title: "Save & Shortlist",    desc: "Shortlist your favourites as you browse. Compare options side by side before reaching out." },
  { n: "03", icon: MessageSquare, title: "Connect Directly",    desc: "Send enquiries straight to the vendor or venue. No middlemen, no hidden commissions." },
  { n: "04", icon: CheckCircle2,  title: "Book with Confidence",desc: "Finalise your booking knowing every listing is verified and reviewed by couples like you." },
];

/* ─── Component ─────────────────────────────────────────────────────── */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function WhyChooseUs() {
  useMeta({ title: "Why Choose Us — Book My Squad" });

  const heroRef      = useScrollAnimation<HTMLDivElement>({ type: "fadeUp", duration: 1 });
  const statsRef     = useStaggerAnimation<HTMLDivElement>({ type: "scaleIn", stagger: 0.08, start: "top 88%" });
  const whyRef       = useStaggerAnimation<HTMLDivElement>({ type: "fadeUp", stagger: 0.09, start: "top 88%" });
  const teamRef      = useStaggerAnimation<HTMLDivElement>({ type: "rotateIn", stagger: 0.1, start: "top 88%" });
  const revHeadRef   = useScrollAnimation<HTMLDivElement>({ type: "blurIn", duration: 1 });
  const revRef       = useStaggerAnimation<HTMLDivElement>({ type: "scaleIn", stagger: 0.1, start: "top 88%" });
  const awardsRef    = useStaggerAnimation<HTMLDivElement>({ type: "slideRight", stagger: 0.1, start: "top 88%" });
  const testRef      = useStaggerAnimation<HTMLDivElement>({ type: "fadeUp", stagger: 0.1, start: "top 88%" });

  return (
    <div className="min-h-screen bg-[#080604] text-white flex flex-col font-sans pb-mobile-nav lg:pb-0">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 px-6 md:px-12 overflow-hidden text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 65%)" }} />
        </div>
        <div ref={heroRef} className="max-w-4xl mx-auto relative z-10">
          <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Our Story ✦</p>
          <div className="gold-line w-16 mx-auto mb-6" />
          <h1 className="font-cormorant text-5xl md:text-7xl text-white font-light leading-[0.95] mb-6">
            Why couples trust<br />
            <span className="text-primary italic font-semibold">Book My Squad</span>
          </h1>
          <p className="font-manrope text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            We're India's most trusted premium event planning marketplace — built on verified vendors, genuine reviews, and an obsessive commitment to excellence.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/vendors">
              <button className="px-8 py-3.5 bg-primary text-black font-cinzel font-bold text-[10px] tracking-[0.25em] uppercase hover:bg-primary/90 transition-all gold-glow">
                Find Vendors
              </button>
            </Link>
            <Link href="/events">
              <button className="px-8 py-3.5 border border-white/20 text-white font-cinzel text-[10px] tracking-[0.25em] uppercase hover:border-primary/50 hover:text-primary transition-all">
                View Portfolio
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── EVENT STATISTICS ── */}
      <section className="py-20 px-6 md:px-12 bg-black border-y border-primary/15 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 65%)" }} />
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-golden-confetti-falling-1-large.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-3">✦ Our Impact ✦</p>
            <div className="gold-line w-16 mx-auto mb-5" />
            <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">
              Numbers that <span className="text-primary italic font-semibold">speak for us</span>
            </h2>
          </div>
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {EVENT_STATS.map((s, i) => (
              <TiltCard key={i} max={5} glare>
                <div className="glass-gold p-6 text-center flex flex-col items-center gap-2 h-full">
                  <span className="font-cinzel text-primary/50 text-base">{s.icon}</span>
                  <AnimatedCounter value={s.num} className="font-cinzel text-3xl text-shimmer counter-pulse leading-none" duration={2.2} />
                  <span className="font-manrope text-white/50 text-[9px] uppercase tracking-[0.25em]">{s.label}</span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US CARDS ── */}
      <section className="py-24 px-6 md:px-12 bg-[#080604]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Our Promise ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">
              What sets us <span className="text-primary italic font-semibold">apart</span>
            </h2>
          </div>
          <div ref={whyRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_CARDS.map((card, i) => (
              <TiltCard key={i} max={4} glare>
                <div className="glass-card p-8 h-full group">
                  <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-6 transition-all duration-300"
                    style={{ background: card.accent + "15", border: `1px solid ${card.accent}30` }}>
                    <card.icon className="w-5 h-5" style={{ color: card.accent }} />
                  </div>
                  <h3 className="font-cinzel text-sm tracking-[0.08em] text-white mb-3 group-hover:text-primary transition-colors">{card.title}</h3>
                  <p className="font-manrope text-white/50 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER BRANDS MARQUEE ── */}
      <section className="py-16 bg-[#0a0806] border-y border-white/5 overflow-hidden">
        <div className="text-center mb-10">
          <p className="font-cinzel text-[9px] tracking-[0.5em] text-primary/50 uppercase">✦ Trusted By India's Finest ✦</p>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, #0a0806, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg, #0a0806, transparent)" }} />
          <div className="marquee-outer">
            <div className="marquee-track">
              {[...PARTNER_BRANDS, ...PARTNER_BRANDS].map((brand, i) => (
                <div key={i} className="marquee-item">
                  <span className="font-cinzel text-[11px] tracking-[0.25em] uppercase text-white/30 hover:text-primary/70 transition-colors duration-300 whitespace-nowrap cursor-default">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative mt-6">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, #0a0806, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg, #0a0806, transparent)" }} />
          <div className="marquee-outer">
            <div className="marquee-track marquee-reverse">
              {[...PARTNER_BRANDS.slice(10), ...PARTNER_BRANDS, ...PARTNER_BRANDS.slice(0, 10)].map((brand, i) => (
                <div key={i} className="marquee-item">
                  <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-white/20 hover:text-primary/60 transition-colors duration-300 whitespace-nowrap cursor-default">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-24 px-6 md:px-12 bg-[#080604]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ The Minds Behind BMS ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">
              Meet our <span className="text-primary italic font-semibold">team</span>
            </h2>
            <p className="font-manrope text-white/45 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
              Passionate event veterans, tech architects, and luxury brand experts — united by a single mission.
            </p>
          </div>
          <div ref={teamRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <TiltCard key={i} max={5} glare>
                <div className="glass-card overflow-hidden group">
                  <div className="relative h-64 overflow-hidden img-zoom">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080604]/90 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                    {/* Social links */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a href={member.instagram} className="w-8 h-8 bg-black/60 backdrop-blur-sm border border-white/20 rounded-sm flex items-center justify-center hover:border-primary/50 transition-colors">
                        <Instagram className="w-3.5 h-3.5 text-white/70" />
                      </a>
                      <a href={member.linkedin} className="w-8 h-8 bg-black/60 backdrop-blur-sm border border-white/20 rounded-sm flex items-center justify-center hover:border-primary/50 transition-colors">
                        <Linkedin className="w-3.5 h-3.5 text-white/70" />
                      </a>
                    </div>
                    {/* Gold line reveal on hover */}
                    <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                      style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }} />
                  </div>
                  <div className="p-6">
                    <h3 className="font-cinzel text-sm tracking-[0.08em] text-white group-hover:text-primary transition-colors">{member.name}</h3>
                    <p className="font-manrope text-[11px] text-primary/70 tracking-wide mt-1 mb-3">{member.role}</p>
                    <p className="font-manrope text-xs text-white/45 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOOGLE REVIEWS ── */}
      <section className="py-24 px-6 md:px-12 bg-[#0a0806] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div ref={revHeadRef} className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Real Voices ✦</p>
              <div className="gold-line w-16 mb-6" />
              <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">
                Google <span className="text-primary italic font-semibold">Reviews</span>
              </h2>
            </div>
            <div className="flex items-center gap-4 glass-card px-6 py-4">
              <GoogleIcon />
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />)}
                </div>
                <p className="font-cinzel text-xs text-white/60 tracking-wider">4.9 · 312 reviews</p>
              </div>
              <a href="#" className="flex items-center gap-1 font-cinzel text-[8px] tracking-[0.2em] uppercase text-primary/60 hover:text-primary transition-colors">
                View all <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          <div ref={revRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GOOGLE_REVIEWS.map((rev, i) => (
              <TiltCard key={i} max={4} glare>
                <div className="glass-card p-7 flex flex-col gap-4 h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-cinzel text-sm font-bold shrink-0"
                        style={{ background: rev.color }}>
                        {rev.initials}
                      </div>
                      <div>
                        <p className="font-cinzel text-[10px] tracking-[0.08em] text-white/85">{rev.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-primary/40" />
                          <p className="font-manrope text-[10px] text-white/35">{rev.location}</p>
                        </div>
                      </div>
                    </div>
                    <GoogleIcon />
                  </div>
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? "fill-[#FBBC05] text-[#FBBC05]" : "text-white/20"}`} />
                    ))}
                    <span className="font-manrope text-[10px] text-white/30 ml-1">{rev.date}</span>
                  </div>
                  {/* Review text */}
                  <p className="font-manrope text-sm text-white/65 leading-relaxed flex-grow">
                    "{rev.text}"
                  </p>
                  <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                    <GoogleIcon />
                    <span className="font-cinzel text-[8px] tracking-[0.2em] text-white/30 uppercase">Reviewed on Google</span>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENT TESTIMONIALS ── */}
      <section className="py-24 px-6 md:px-12 bg-[#080604]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Their Words ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">
              Stories of <span className="text-primary italic font-semibold">unforgettable</span> celebrations
            </h2>
          </div>
          <div ref={testRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <TiltCard key={i} max={4} glare>
                <div className="glass-card p-8 flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)" }} />
                  <div className="font-cormorant text-7xl text-primary/12 absolute top-3 left-5 leading-none pointer-events-none select-none">"</div>
                  <div className="flex gap-1 mb-5 relative z-10">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="font-cormorant italic text-lg text-white/75 leading-relaxed mb-6 flex-grow relative z-10">
                    "{t.text}"
                  </p>
                  <div className="w-10 h-px bg-primary/35 mb-4" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5 text-primary/60" />
                    </div>
                    <div>
                      <p className="font-cinzel text-[10px] tracking-[0.08em] text-primary">{t.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-white/30" />
                        <p className="font-manrope text-[10px] text-white/35">{t.city}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── AWARDS & CERTIFICATIONS ── */}
      <section className="py-24 px-6 md:px-12 bg-[#0a0806] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Recognition ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">
              Awards & <span className="text-primary italic font-semibold">Certifications</span>
            </h2>
          </div>
          <div ref={awardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AWARDS.map((award, i) => (
              <TiltCard key={i} max={4} glare>
                <div className="glass-card p-7 flex gap-5 items-start group">
                  <div className="w-14 h-14 rounded-sm flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{ background: award.color + "12", border: `1px solid ${award.color}35` }}>
                    <award.icon className="w-6 h-6" style={{ color: award.color }} />
                  </div>
                  <div>
                    <span className="font-cinzel text-[8px] tracking-[0.3em] text-white/30 uppercase">{award.year}</span>
                    <h3 className="font-cinzel text-sm tracking-[0.05em] text-white mt-1 mb-1.5 group-hover:text-primary transition-colors leading-snug">
                      {award.title}
                    </h3>
                    <p className="font-manrope text-[11px] text-white/40">{award.org}</p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 md:px-12 bg-[#080604] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ The Journey ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">
              Simple. <span className="text-primary italic font-semibold">Seamless. </span>Perfect.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
            {STEPS.map((step, i) => (
              <div key={i} className="relative text-center glass-card p-8">
                <div className="w-12 h-12 mx-auto mb-5 rounded-sm border border-primary/30 bg-primary/8 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-cinzel text-[9px] tracking-[0.4em] text-primary/40 uppercase mb-2">{step.n}</p>
                <h3 className="font-cinzel text-sm tracking-[0.05em] text-white font-semibold mb-3">{step.title}</h3>
                <p className="font-manrope text-[13px] text-white/45 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 md:px-12 bg-[#0a0806] border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, transparent 65%)" }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-5">✦ Start Today ✦</p>
          <div className="gold-line w-16 mx-auto mb-8" />
          <h2 className="font-cormorant text-5xl md:text-6xl font-semibold text-white mb-6">
            Plan your <span className="italic text-primary">dream event</span><br />with us today
          </h2>
          <p className="font-manrope text-white/50 text-base mb-10 max-w-xl mx-auto leading-relaxed">
            Join 63,000+ couples and event hosts who trusted Book My Squad for their most important celebrations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/vendors">
              <button className="px-10 py-4 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.25em] uppercase hover:bg-primary/90 transition-all gold-glow flex items-center gap-2 group">
                Find Vendors Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/events">
              <button className="px-10 py-4 border border-primary/35 text-primary/80 font-cinzel font-bold text-xs tracking-[0.25em] uppercase hover:bg-primary/8 hover:border-primary/55 transition-all">
                View Portfolio
              </button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {[
              { icon: ShieldCheck, text: "GST Authenticated" },
              { icon: Star, text: "4.9 Google Rating" },
              { icon: BadgeCheck, text: "255+ Verified Vendors" },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-2 text-white/35">
                <b.icon className="w-3.5 h-3.5 text-primary/50" />
                <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
