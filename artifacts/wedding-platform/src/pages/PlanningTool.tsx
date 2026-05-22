import { useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Check,
  Gift,
  Headphones,
  Heart,
  Hash,
  Monitor,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
  MapPin,
  ClipboardList,
  Clock3,
} from "lucide-react";
import { useMeta } from "@/hooks/useMeta";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const TOOL_PAGES = [
  {
    slug: "find-vendors",
    title: "Luxury Vendor Discovery",
    eyebrow: "Vendor Discovery Dashboard",
    tagline: "Search, filter and compare verified wedding professionals with cinematic portfolios.",
    description:
      "A premium dashboard for luxury vendor discovery, curated for couples who expect every partner to feel editorial and exceptional.",
    accent: "Featured Vendors",
    heroImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1600&q=80",
  },
  {
    slug: "my-wedding-profile",
    title: "Wedding Concierge Profile",
    eyebrow: "Wedding Dashboard",
    tagline: "Track your love story, timeline, budget and guest details in one polished wedding suite.",
    description:
      "A refined profile hub that keeps your wedding essentials accessible, beautifully styled and thoughtfully arranged.",
    accent: "Planning Essentials",
    heroImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80",
  },
  {
    slug: "guest-manager",
    title: "Premium Guest Manager",
    eyebrow: "Guest Management Panel",
    tagline: "Curate guest lists, RSVP details and seating with luxurious clarity.",
    description:
      "A premium guest management suite designed for elegant events, wedding family groups, and VIP invitation workflows.",
    accent: "Guest Insights",
    heroImage: "https://images.unsplash.com/photo-1491933387074-0216d17f1aa9?w=1600&q=80",
  },
  {
    slug: "planning-checklist",
    title: "Wedding Timeline Planner",
    eyebrow: "Planning Checklist",
    tagline: "Stay ahead of every milestone with a cinematic wedding timeline.",
    description:
      "A refined planning checklist for your celebration, with timeline categories, reminders, and milestone tracking.",
    accent: "Timeline Journey",
    heroImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1600&q=80",
  },
  {
    slug: "budget-planner",
    title: "Luxury Budget Dashboard",
    eyebrow: "Budget Planner",
    tagline: "Measure spending across every wedding category with premium clarity.",
    description:
      "An elegant budget experience that keeps venue, decor, photography and catering costs aligned with your vision.",
    accent: "Spend Intelligence",
    heroImage: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3f?w=1600&q=80",
  },
  {
    slug: "saved-shortlists",
    title: "Saved Collections",
    eyebrow: "Shortlist Dashboard",
    tagline: "Capture favorite venues, vendors and inspirations in a luxurious editorial collection.",
    description:
      "A curated shortlist page where every saved listing feels like a premium wedding editorial spread.",
    accent: "Favorite Finds",
    heroImage: "https://images.unsplash.com/photo-1516728778615-2d590ea1856f?w=1600&q=80",
  },
  {
    slug: "expert-consultation",
    title: "Luxury Consultation Booking",
    eyebrow: "Consultation Page",
    tagline: "Request white-glove wedding guidance from destination and luxury event specialists.",
    description:
      "A concierge booking suite for expert consultation, priority support, and bespoke recommendation services.",
    accent: "Concierge Services",
    heroImage: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1600&q=80",
  },
  {
    slug: "wedding-hashtag-ideas",
    title: "Luxury Hashtag Generator",
    eyebrow: "Hashtag Studio",
    tagline: "Create memorable wedding hashtags with premium editorial flair.",
    description:
      "Generate romantic, trendy and luxury hashtags for your celebration with one elegant tool.",
    accent: "Brand Your Celebration",
    heroImage: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1600&q=80",
  },
  {
    slug: "virtual-bridal-preview",
    title: "Bridal Inspiration Studio",
    eyebrow: "Bridal Preview",
    tagline: "Explore bridal looks, makeup stories and luxury moodboards in an editorial gallery.",
    description:
      "A bridal inspiration studio designed like a fashion magazine, with couture styling and premium moodboard layouts.",
    accent: "Bridal Trends",
    heroImage: "https://images.unsplash.com/photo-1505577058444-a3dab5f3f0f3?w=1600&q=80",
  },
];

const TAGLINE_STYLES = [
  "Golden vows",
  "Cinematic ceremonies",
  "Fine art celebrations",
  "Destination dreams",
  "Curated elegance",
];

function generateHashtags(bride: string, groom: string, year: string) {
  const cleanBride = bride.trim() || "Bride";
  const cleanGroom = groom.trim() || "Groom";
  const cleanYear = year.trim() || new Date().getFullYear().toString();
  return [
    `#${cleanBride}${cleanGroom}${cleanYear}`,
    `#Forever${cleanBride}${cleanGroom}`,
    `#The${cleanGroom}${cleanBride}Wedding`,
    `#${cleanYear}With${cleanBride}`,
    `#GoldAndGrace${cleanBride}`,
    `#Royal${cleanBride}${cleanGroom}`,
    `#Eternal${cleanBride}${cleanGroom}`,
  ];
}

function getToolBySlug(slug?: string) {
  return TOOL_PAGES.find((tool) => tool.slug === slug);
}

export default function PlanningTool() {
  const [match, params] = useRoute("/planning-tool/:slug");
  const slug = params?.slug ?? "";
  const tool = getToolBySlug(slug);
  useMeta({
    title: tool ? `${tool.title} · Book My Squad` : "Planning Tool · Book My Squad",
    description: tool ? tool.description : "Luxury wedding planning tools from Book My Squad.",
    keywords: "luxury wedding tools, vendor discovery, guest manager, wedding checklist, budget planner",
  });
  const [brideName, setBrideName] = useState("Riya");
  const [groomName, setGroomName] = useState("Arjun");
  const [weddingYear, setWeddingYear] = useState("2026");
  const [copied, setCopied] = useState(false);

  const hashtags = useMemo(
    () => generateHashtags(brideName, groomName, weddingYear),
    [brideName, groomName, weddingYear]
  );

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  if (!tool) {
    return (
      <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow px-6 md:px-12 py-24">
          <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-black/40 p-12 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl text-center">
            <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Tool Not Found</p>
            <h1 className="font-cormorant text-4xl sm:text-5xl text-white font-semibold mb-6">That tool isn’t available yet.</h1>
            <p className="font-manrope text-[17px] text-white/65 leading-[1.9] mb-10">
              Return to the wedding planning hub and choose a premium tool designed to keep your celebration effortless.
            </p>
            <Link href="/" className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-primary text-black font-cinzel text-[10px] tracking-[0.25em] uppercase hover:bg-primary/90 transition-all duration-300">
              Back to Home <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="relative overflow-hidden py-28 px-6 md:px-12 text-center">
          <div className="absolute inset-0">
            <img
              src={tool.heroImage}
              alt={tool.title}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),transparent_45%)]" />
          </div>
          <div className="relative mx-auto max-w-5xl">
            <p className="font-cinzel text-[11px] tracking-[0.34em] uppercase text-primary/80 mb-4">
              ✦ {tool.eyebrow.toUpperCase()} ✦
            </p>
            <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-white max-w-4xl mx-auto" style={{ textShadow: "0 0 36px rgba(212,175,55,0.16)" }}>
              {tool.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl font-manrope text-[18px] md:text-[19px] text-white/70 leading-[1.9]">
              {tool.tagline}
            </p>
            <p className="mx-auto mt-6 max-w-2xl font-manrope text-[16px] text-white/65 leading-[1.9]">
              {tool.description}
            </p>
            <div className="mt-10 flex flex-col gap-4 items-center justify-center sm:flex-row sm:gap-6">
              <Link
                href="/vendors"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-10 py-4 text-black font-cinzel text-[10px] tracking-[0.25em] uppercase transition-all duration-300 hover:bg-primary/90"
              >
                Explore Vendors
              </Link>
              <Link
                href="/the-edit"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black/30 px-10 py-4 text-[10px] font-cinzel uppercase tracking-[0.25em] text-white/80 hover:border-primary/40 hover:text-white transition-all duration-300"
              >
                View Editorial Inspiration
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-12 pb-20">
          <div className="max-w-7xl mx-auto space-y-16">
            {slug === "find-vendors" && (
              <>
                <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] items-start">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="rounded-[32px] border border-white/10 bg-black/40 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                  >
                    <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Premium Search</p>
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="space-y-4">
                        <div className="rounded-[24px] border border-white/10 bg-[#0d0a07]/90 p-5">
                          <div className="flex items-center gap-3 mb-4">
                            <Search className="w-5 h-5 text-primary" />
                            <h3 className="font-cormorant text-2xl text-white font-semibold">Luxury search</h3>
                          </div>
                          <p className="font-manrope text-sm text-white/70 leading-7">
                            Refine your vendor selection by category, city, price, rating and verified status.
                          </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {[
                            "City: Udaipur",
                            "Price: ₹2L - ₹15L",
                            "Rating: 4.9+",
                            "Verified Vendors",
                          ].map((item) => (
                            <div key={item} className="rounded-[24px] border border-white/10 bg-black/40 px-5 py-4 text-sm text-white/70">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-[32px] border border-white/10 bg-[#090705] p-6 shadow-[0_24px_48px_rgba(0,0,0,0.22)]">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-2">Search panel</p>
                            <h3 className="font-cormorant text-3xl text-white font-semibold">Curate your vendor shortlist</h3>
                          </div>
                          <div className="rounded-full bg-primary/10 px-3 py-2 text-[11px] uppercase tracking-[0.25em] text-primary">
                            Live</div>
                        </div>
                        <div className="space-y-4">
                          {[
                            "Category",
                            "City",
                            "Price range",
                            "Verified filter",
                          ].map((item) => (
                            <div key={item} className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-4 text-white/70">
                              <p className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">{item}</p>
                              <div className="text-white/80">Select premium options</div>
                            </div>
                          ))}
                        </div>
                        <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-black font-cinzel text-[10px] tracking-[0.25em] uppercase hover:bg-primary/90 transition-all duration-300">
                          Start Discovery
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="space-y-6"
                  >
                    <div className="rounded-[32px] border border-white/10 bg-black/40 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                      <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Trending Categories</p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[
                          "Designer venues",
                          "Bridal makeup",
                          "Cinematic photography",
                          "Floral couture",
                        ].map((item) => (
                          <div key={item} className="rounded-[24px] border border-white/10 bg-[#0d0a07]/90 px-5 py-4">
                            <h4 className="font-cormorant text-xl text-white mb-2">{item}</h4>
                            <p className="font-manrope text-sm text-white/60">Curated premium partners</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[32px] border border-white/10 bg-black/40 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                      <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Verified Professionals</p>
                      <div className="grid gap-4">
                        {[
                          {
                            name: "Aditi Malhotra",
                            role: "Luxury Photographer",
                            rating: "4.98",
                            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&q=80",
                          },
                          {
                            name: "Nikhil Sharma",
                            role: "Venue Curator",
                            rating: "4.96",
                            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700&q=80",
                          },
                        ].map((pro) => (
                          <div key={pro.name} className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0d0a07]/80 hover:border-primary/40 transition duration-300">
                            <img src={pro.image} alt={pro.name} className="w-full h-32 object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="p-5">
                              <h4 className="font-cormorant text-2xl text-white mb-2">{pro.name}</h4>
                              <p className="font-manrope text-sm text-white/65 mb-3">{pro.role}</p>
                              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-primary">
                                <Star className="w-3.5 h-3.5" /> {pro.rating}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {[
                    {
                      title: "Premium Picks",
                      label: "Featured",
                      excerpt: "Hand-picked wedding vendors with editorial portfolios.",
                      icon: Sparkles,
                    },
                    {
                      title: "Compare Top Teams",
                      label: "Compare",
                      excerpt: "Side-by-side vendor highlights and service visuals.",
                      icon: ShieldCheck,
                    },
                    {
                      title: "Contact Directly",
                      label: "Connect",
                      excerpt: "Reach out instantly to curated wedding specialists.",
                      icon: MapPin,
                    },
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.05 }}
                        className="group rounded-[28px] border border-white/10 bg-black/30 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-3xl bg-primary/10 text-primary mb-5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">{card.label}</p>
                        <h3 className="font-cormorant text-2xl text-white mb-3">{card.title}</h3>
                        <p className="font-manrope text-sm text-white/65 leading-7">{card.excerpt}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}

            {slug === "my-wedding-profile" && (
              <>
                <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[32px] border border-white/10 bg-black/40 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                    <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Profile Summary</p>
                    <div className="grid gap-5 md:grid-cols-2">
                      {[
                        { label: "Couple", value: "Riya & Arjun" },
                        { label: "Wedding Date", value: "12 December 2026" },
                        { label: "Budget", value: "₹28,00,000" },
                        { label: "Guests", value: "320" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-[26px] border border-white/10 bg-[#0d0a07]/90 p-6">
                          <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-white/40 mb-3">{item.label}</p>
                          <p className="font-cormorant text-2xl text-white font-semibold">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[32px] border border-white/10 bg-black/40 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                    <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Countdown</p>
                    <div className="rounded-[28px] border border-white/10 bg-[#0d0a07]/95 p-8 text-center">
                      <p className="font-manrope text-[13px] uppercase tracking-[0.35em] text-primary/70 mb-4">Days Until Celebration</p>
                      <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full border border-primary/30 bg-black/60 text-5xl text-white font-cormorant">
                        232
                      </div>
                      <p className="font-manrope text-sm text-white/65 leading-7">
                        Personalized recommendations refresh as your profile evolves — from venue fits to vendor style direction.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {[
                    { label: "Saved Venues", value: "12", icon: Heart },
                    { label: "Vendor Matches", value: "8", icon: Users },
                    { label: "Planning Progress", value: "74%", icon: Check },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[28px] border border-white/10 bg-black/30 p-8 shadow-[0_30px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-3xl bg-primary/10 text-primary mb-5">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-3">{item.label}</p>
                      <p className="font-cormorant text-4xl text-white font-semibold mb-4">{item.value}</p>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-white/10" style={{ width: item.label === "Planning Progress" ? "74%" : "100%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {slug === "guest-manager" && (
              <>
                <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-[32px] border border-white/10 bg-black/40 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                    <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Guest Flow</p>
                    <div className="grid gap-4">
                      {[
                        { label: "Confirmed", value: "206" },
                        { label: "Pending", value: "68" },
                        { label: "VIP", value: "24" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-[24px] border border-white/10 bg-[#0d0a07]/90 px-5 py-5">
                          <div>
                            <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-white/40">{item.label}</p>
                            <p className="font-cormorant text-3xl text-white font-semibold">{item.value}</p>
                          </div>
                          <div className="rounded-full bg-primary/10 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-primary">View</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[32px] border border-white/10 bg-black/40 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                    <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Family Groups</p>
                    <div className="space-y-4">
                      {[
                        "Bride Side",
                        "Groom Side",
                        "VIP Tables",
                      ].map((group) => (
                        <div key={group} className="rounded-[24px] border border-white/10 bg-[#0b0906]/95 px-5 py-4">
                          <p className="font-cormorant text-xl text-white mb-1">{group}</p>
                          <p className="font-manrope text-sm text-white/60">Organize invitations, meals and seating notes.</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="rounded-[32px] border border-white/10 bg-black/30 p-8 shadow-[0_30px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                    <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Meal Preferences</p>
                    <div className="space-y-3">
                      {[
                        "Vegetarian",
                        "Non vegetarian",
                        "Custom menu requests",
                      ].map((item) => (
                        <div key={item} className="rounded-[20px] border border-white/10 bg-[#0d0a07]/85 px-4 py-4 text-white/70">{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[32px] border border-white/10 bg-black/30 p-8 shadow-[0_30px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                    <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Invitation Status</p>
                    <div className="space-y-3">
                      {[
                        "Sent",
                        "Opened",
                        "Awaiting RSVP",
                      ].map((item) => (
                        <div key={item} className="rounded-[20px] border border-white/10 bg-[#0d0a07]/85 px-4 py-4 text-white/70">{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[32px] border border-white/10 bg-black/30 p-8 shadow-[0_30px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                    <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Seating Notes</p>
                    <div className="rounded-[24px] border border-white/10 bg-[#0d0a07]/90 px-5 py-5 text-white/70">
                      <p className="font-cormorant text-xl text-white mb-3">Table 1</p>
                      <p className="text-sm">Bride’s close friends, perfume notes: jasmine, VIP access.</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {slug === "planning-checklist" && (
              <>
                <div className="grid gap-6 lg:grid-cols-2">
                  {[
                    {
                      stage: "6 Months Before",
                      tasks: [
                        "Secure venue and date",
                        "Book photographer & stylist",
                        "Finalize guest list",
                      ],
                    },
                    {
                      stage: "3 Months Before",
                      tasks: [
                        "Confirm decor & menu",
                        "Send invitations",
                        "Book entertainment",
                      ],
                    },
                  ].map((phase) => (
                    <div key={phase.stage} className="rounded-[32px] border border-white/10 bg-black/40 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                      <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">{phase.stage}</p>
                      <div className="space-y-4">
                        {phase.tasks.map((task) => (
                          <div key={task} className="rounded-[24px] border border-white/10 bg-[#0d0a07]/90 p-5">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                              <h3 className="font-cormorant text-xl text-white">{task}</h3>
                            </div>
                            <p className="font-manrope text-sm text-white/65">Stay on schedule with elegant reminders and wedding-week milestones.</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[32px] border border-white/10 bg-black/30 p-8 shadow-[0_30px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                  <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Wedding Week</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      "Final dress fitting",
                      "Vendor confirmations",
                      "Ceremony rehearsal",
                    ].map((item) => (
                      <div key={item} className="rounded-[24px] border border-white/10 bg-[#0b0906]/95 px-5 py-5 text-white/70">
                        <p className="font-cormorant text-lg text-white mb-2">{item}</p>
                        <p className="text-sm">A luxurious check-in before the celebration begins.</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {slug === "budget-planner" && (
              <>
                <div className="grid gap-6 lg:grid-cols-3">
                  {[
                    { label: "Total Budget", value: "₹37,50,000" },
                    { label: "Remaining", value: "₹9,80,000" },
                    { label: "Committed", value: "₹27,70,000" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-[28px] border border-white/10 bg-black/30 p-8 shadow-[0_30px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                      <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">{stat.label}</p>
                      <p className="font-cormorant text-4xl text-white font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-[32px] border border-white/10 bg-black/40 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                  <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Category Spending</p>
                  {[
                    { label: "Venue", value: 34 },
                    { label: "Decor", value: 22 },
                    { label: "Makeup", value: 11 },
                    { label: "Photography", value: 14 },
                    { label: "Catering", value: 19 },
                  ].map((entry) => (
                    <div key={entry.label} className="mb-5">
                      <div className="flex items-center justify-between mb-2 text-sm text-white/65">
                        <span>{entry.label}</span>
                        <span>{entry.value}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-white/20" style={{ width: `${entry.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {slug === "saved-shortlists" && (
              <>
                <div className="grid gap-6 lg:grid-cols-3">
                  {[
                    { title: "Saved Venues", subtitle: "Royal palace gardens and seafront pavilions." },
                    { title: "Saved Vendors", subtitle: "Bridal stylists, photographers and planners." },
                    { title: "Inspiration Boards", subtitle: "Couture moodboards and editorial looks." },
                  ].map((item) => (
                    <div key={item.title} className="rounded-[32px] border border-white/10 bg-black/30 p-8 shadow-[0_30px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl hover:border-primary/40 transition-all duration-300">
                      <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">{item.title}</p>
                      <h3 className="font-cormorant text-3xl text-white font-semibold mb-4">{item.title}</h3>
                      <p className="font-manrope text-sm text-white/65 leading-7">{item.subtitle}</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  {[
                    { title: "Recent Views", detail: "9 venues and 5 vendors" },
                    { title: "Favorites", detail: "21 listings saved" },
                  ].map((card) => (
                    <div key={card.title} className="rounded-[32px] border border-white/10 bg-black/40 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                      <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">{card.title}</p>
                      <h4 className="font-cormorant text-3xl text-white font-semibold mb-4">{card.detail}</h4>
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-primary">
                        Manage Collection
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {slug === "expert-consultation" && (
              <>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-[32px] border border-white/10 bg-black/40 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                    <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Concierge Booking</p>
                    <h3 className="font-cormorant text-4xl text-white font-semibold mb-6">White-glove assistance for your wedding journey</h3>
                    <p className="font-manrope text-sm text-white/65 leading-7 mb-8">
                      Request personalized consultation, destination guidance and curated vendor recommendations with priority support.
                    </p>
                    <div className="space-y-4">
                      {[
                        "Consultation request form",
                        "Priority support booking",
                        "Budget guidance & travel advice",
                        "WhatsApp consultation access",
                      ].map((item) => (
                        <div key={item} className="rounded-[24px] border border-white/10 bg-[#0d0a07]/95 px-5 py-4 text-white/70">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[32px] border border-white/10 bg-black/30 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                    <div className="inline-flex items-center gap-3 mb-6 rounded-full border border-primary/20 bg-black/50 px-4 py-3 text-[11px] uppercase tracking-[0.25em] text-primary">
                      <Headphones className="w-4 h-4" /> Priority concierge
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: "Preferred callback", value: "Morning / Evening" },
                        { label: "Destination support", value: "Jaipur & Goa" },
                        { label: "Vendor recommendations", value: "Curated luxury teams" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-[24px] border border-white/10 bg-[#0d0a07]/90 p-5">
                          <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-white/40">{item.label}</p>
                          <p className="font-manrope text-sm text-white/70 mt-1">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <button className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-black font-cinzel text-[10px] tracking-[0.25em] uppercase hover:bg-primary/90 transition-all duration-300">
                      Request Consultation
                    </button>
                  </div>
                </div>
              </>
            )}

            {slug === "wedding-hashtag-ideas" && (
              <>
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[32px] border border-white/10 bg-black/40 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                    <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Create Your Hashtag</p>
                    <div className="grid gap-4">
                      {[
                        { label: "Bride Name", value: brideName, setter: setBrideName },
                        { label: "Groom Name", value: groomName, setter: setGroomName },
                        { label: "Wedding Year", value: weddingYear, setter: setWeddingYear },
                      ].map((field) => (
                        <label key={field.label} className="block text-left text-white/70">
                          <span className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-white/40 mb-2 inline-block">{field.label}</span>
                          <input
                            type="text"
                            value={field.value}
                            onChange={(event) => field.setter(event.target.value)}
                            className="w-full rounded-[18px] border border-white/10 bg-[#0d0a07]/90 px-4 py-3 text-white outline-none transition focus:border-primary/50"
                          />
                        </label>
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                      {hashtags.slice(0, 4).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleCopy(tag)}
                          className="rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70 transition hover:border-primary/40 hover:text-white"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-white/50">Tap any tag to copy it instantly.</p>
                    {copied && <p className="mt-3 text-sm text-primary">Copied to clipboard</p>}
                  </div>

                  <div className="rounded-[32px] border border-white/10 bg-black/30 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                    <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Hashtag Inspiration</p>
                    <div className="space-y-4">
                      {TAGLINE_STYLES.map((line) => (
                        <div key={line} className="rounded-[24px] border border-white/10 bg-[#0d0a07]/90 px-5 py-4">
                          <p className="font-cormorant text-xl text-white">{line}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {slug === "virtual-bridal-preview" && (
              <>
                <div className="grid gap-6 lg:grid-cols-3">
                  {[
                    { title: "Royal Bridal", detail: "Draped silhouettes & heirloom elegance" },
                    { title: "Minimal Bridal", detail: "Soft neutrals with refined details" },
                    { title: "Modern Luxury", detail: "Contemporary couture for destination moments" },
                  ].map((tile) => (
                    <div key={tile.title} className="rounded-[32px] border border-white/10 bg-black/30 p-8 shadow-[0_30px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl hover:border-primary/40 transition-all duration-300">
                      <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">{tile.title}</p>
                      <h3 className="font-cormorant text-3xl text-white font-semibold mb-4">{tile.title}</h3>
                      <p className="font-manrope text-sm text-white/65 leading-7">{tile.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {[
                    {
                      title: "Makeup inspirations",
                      label: "Beauty",
                      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700&q=80",
                    },
                    {
                      title: "Jewelry trends",
                      label: "Couture",
                      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80",
                    },
                  ].map((item) => (
                    <div key={item.title} className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0d0a07]/95 shadow-[0_30px_70px_rgba(0,0,0,0.24)]">
                      <img src={item.image} alt={item.title} className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="font-cinzel text-[9px] uppercase tracking-[0.32em] text-primary/80 mb-2 block">{item.label}</span>
                        <h3 className="font-cormorant text-3xl text-white font-semibold">{item.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {slug !== "find-vendors" && slug !== "my-wedding-profile" && slug !== "guest-manager" && slug !== "planning-checklist" && slug !== "budget-planner" && slug !== "saved-shortlists" && slug !== "expert-consultation" && slug !== "wedding-hashtag-ideas" && slug !== "virtual-bridal-preview" && (
              <div className="rounded-[32px] border border-white/10 bg-black/40 p-12 shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl text-center">
                <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Coming Soon</p>
                <h3 className="font-cormorant text-4xl text-white font-semibold mb-4">Luxury dashboard experience coming soon.</h3>
                <p className="font-manrope text-sm text-white/65 leading-7">We’re crafting an elegant planning suite for your celebration.</p>
              </div>
            )}
          </div>
        </section>

        <section className="px-6 md:px-12 pb-24">
          <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-black/40 p-12 text-center shadow-[0_40px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-primary/70 mb-4">Luxury Planning Ecosystem</p>
            <h2 className="font-cormorant text-5xl text-white font-semibold leading-tight mb-6">Your premium planning journey continues here.</h2>
            <p className="mx-auto max-w-2xl font-manrope text-[17px] text-white/70 leading-[1.9] mb-8">
              Every tool is designed to feel like a curated extension of the homepage, the editorial suite and the Book My Squad luxury experience.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-12 py-4 text-black font-cinzel text-[10px] tracking-[0.25em] uppercase hover:bg-primary/90 transition-all duration-300"
            >
              Return to planning hub
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
