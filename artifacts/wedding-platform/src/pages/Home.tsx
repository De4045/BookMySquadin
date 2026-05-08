import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Search, ChevronDown, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

const SectionHeading = ({ label, title, highlightedWord, light = false }: { label: string, title: string, highlightedWord: string, light?: boolean }) => {
  const [firstPart, secondPart] = title.split(highlightedWord);
  
  return (
    <div className="flex flex-col items-center text-center mb-12">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-8 h-px ${light ? 'bg-primary/50' : 'bg-primary'}`} />
        <span className={`tracking-[0.2em] text-xs font-semibold uppercase ${light ? 'text-white/80' : 'text-muted-foreground'}`}>
          {label}
        </span>
        <div className={`w-8 h-px ${light ? 'bg-primary/50' : 'bg-primary'}`} />
      </div>
      <h2 className={`text-4xl md:text-5xl font-serif ${light ? 'text-white' : 'text-foreground'}`}>
        {firstPart} <span className="text-primary italic">{highlightedWord}</span> {secondPart}
      </h2>
    </div>
  );
};

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.1 }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[100dvh] flex items-center justify-center pt-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80" 
            alt="Wedding Background" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-primary/80" />
              <span className="text-white tracking-[0.2em] text-xs font-semibold uppercase">India's Finest Wedding Platform</span>
              <div className="w-12 h-px bg-primary/80" />
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight">
              Your Wedding, <span className="text-primary italic block md:inline mt-2 md:mt-0">Your Way</span>
            </h1>

            <p className="text-white/90 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12">
              Find the best wedding vendors with thousands of trusted reviews
            </p>

            <div className="w-full max-w-3xl bg-white p-2 rounded-sm flex flex-col md:flex-row gap-2 shadow-2xl">
              <div className="flex-1 flex items-center bg-gray-50 px-4 py-3 border border-border">
                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                <select className="w-full bg-transparent border-none outline-none text-foreground text-sm" data-testid="select-vendor">
                  <option value="">Select vendor type</option>
                  <option value="banquet">Banquet Halls</option>
                  <option value="venues">Wedding Venues</option>
                  <option value="photographers">Photographers</option>
                  <option value="makeup">Makeup Artists</option>
                  <option value="planners">Wedding Planners</option>
                  <option value="decorators">Decorators</option>
                  <option value="caterers">Caterers</option>
                  <option value="mehendi">Mehendi Artists</option>
                  <option value="djs">DJs & Music</option>
                  <option value="choreographers">Choreographers</option>
                </select>
              </div>
              <div className="flex-1 flex items-center bg-gray-50 px-4 py-3 border border-border">
                <MapPin className="w-5 h-5 text-muted-foreground mr-3" />
                <select className="w-full bg-transparent border-none outline-none text-foreground text-sm" data-testid="select-city">
                  <option value="">Select city</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="jaipur">Jaipur</option>
                  <option value="chennai">Chennai</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="kolkata">Kolkata</option>
                  <option value="pune">Pune</option>
                  <option value="goa">Goa</option>
                  <option value="udaipur">Udaipur</option>
                </select>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-none py-6 px-8 text-sm uppercase tracking-wider font-semibold w-full md:w-auto" data-testid="btn-get-started">
                Get Started
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-white/80">
              <span className="font-semibold text-white mr-2">POPULAR:</span>
              <span className="px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 cursor-pointer transition-colors backdrop-blur-sm">Wedding Photographers</span>
              <span className="px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 cursor-pointer transition-colors backdrop-blur-sm">Bridal Makeup Artists</span>
              <span className="px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 cursor-pointer transition-colors backdrop-blur-sm">Wedding Cards</span>
              <span className="px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 cursor-pointer transition-colors backdrop-blur-sm">Wedding Venues</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70 animate-bounce">
          <span className="text-[10px] tracking-[0.3em] uppercase mb-2">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* 4. Popular Venue Searches Section */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn}>
            <SectionHeading label="Curated For You" title="Popular Venue Searches" highlightedWord="Venue" />
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=80",
                title: "4 Star & Above Hotels",
                cities: ["Mumbai", "Bangalore", "Pune", "Delhi", "More"]
              },
              {
                img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=700&q=80",
                title: "Banquet Halls",
                cities: ["Mumbai", "Bangalore", "Pune", "Delhi", "More"]
              },
              {
                img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=700&q=80",
                title: "Marriage Garden / Lawns",
                cities: ["Jaipur", "Delhi", "Hyderabad", "Lucknow", "More"]
              },
              {
                img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=700&q=80",
                title: "Destination Resorts",
                cities: ["Goa", "Udaipur", "Mussoorie", "Rishikesh", "More"]
              }
            ].map((card, i) => (
              <motion.div key={i} variants={staggerItem} className="group cursor-pointer">
                <div className="relative h-[400px] overflow-hidden rounded-sm mb-4">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white font-serif text-xl font-bold mb-2">{card.title}</h3>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  {card.cities.map((city, j) => (
                    <span key={j} className="hover:text-primary transition-colors">{city}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. BMS Inhouse Services */}
      <section className="py-24 px-6 md:px-12 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn}>
            <SectionHeading label="Premium Services" title="BMS Inhouse Services" highlightedWord="Inhouse" light />
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {[
              {
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80",
                title: "Wedding Planning",
                desc: "End-to-end planning by our expert team"
              },
              {
                img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=700&q=80",
                title: "Photography & Films",
                desc: "Candid, cinematic and pre-wedding shoots"
              },
              {
                img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80",
                title: "Bridal Makeup",
                desc: "Top makeup artists for your special day"
              }
            ].map((service, i) => (
              <motion.div key={i} variants={staggerItem} className="bg-white/5 border border-white/10 hover:border-primary/50 transition-colors flex overflow-hidden rounded-sm group cursor-pointer">
                <div className="w-1/3 overflow-hidden">
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="w-2/3 p-6 flex flex-col justify-center">
                  <h3 className="text-white font-serif text-xl mb-2">{service.title}</h3>
                  <p className="text-white/60 text-sm mb-4">{service.desc}</p>
                  <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all uppercase tracking-wider">
                    Know More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. Every Vendor You Need */}
      <section className="py-24 px-6 md:px-12 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <motion.div {...fadeIn} className="flex-1">
              <SectionHeading label="Browse by Category" title="Every Vendor You Need" highlightedWord="Vendor" />
            </motion.div>
            <motion.div {...fadeIn} className="mb-12 md:mb-16">
              <Button variant="outline" className="rounded-none border-primary text-primary hover:bg-primary hover:text-white transition-colors" data-testid="btn-all-vendors">
                All Vendors
              </Button>
            </motion.div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {[
              { emoji: "🏛️", name: "Venues", count: "1,800+" },
              { emoji: "📸", name: "Photographers", count: "2,400+" },
              { emoji: "💄", name: "Makeup Artists", count: "900+" },
              { emoji: "🎨", name: "Decorators", count: "1,200+" },
              { emoji: "🍽️", name: "Caterers", count: "1,500+" },
              { emoji: "🌿", name: "Mehendi", count: "600+" },
              { emoji: "📋", name: "Planners", count: "750+" },
              { emoji: "🎵", name: "DJs & Music", count: "450+" },
              { emoji: "💌", name: "Invitations", count: "320+" },
              { emoji: "💃", name: "Choreographers", count: "190+" }
            ].map((vendor, i) => (
              <motion.div key={i} variants={staggerItem} className="bg-white p-6 rounded-sm border border-border hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group flex flex-col items-center text-center">
                <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{vendor.emoji}</span>
                <h4 className="font-semibold text-foreground mb-1">{vendor.name}</h4>
                <span className="text-xs text-muted-foreground">{vendor.count}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. Real Weddings */}
      <section className="py-24 px-6 md:px-12 bg-[#fdf6ee]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <motion.div {...fadeIn} className="flex-1">
              <SectionHeading label="Inspiration" title="Real Weddings" highlightedWord="Weddings" />
            </motion.div>
            <motion.div {...fadeIn} className="mb-12 md:mb-16">
              <Button variant="outline" className="rounded-none border-primary text-primary hover:bg-primary hover:text-white transition-colors" data-testid="btn-all-weddings">
                View all
              </Button>
            </motion.div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=700&q=80", title: "Royal Rajasthani", names: "Priya & Rahul", city: "Udaipur" },
              { img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=700&q=80", title: "Pink City Magic", names: "Ananya & Vikram", city: "Jaipur" },
              { img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&q=80", title: "Beach Boho", names: "Neha & Arjun", city: "Goa" },
              { img: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=700&q=80", title: "Modern Luxury", names: "Shriya & Karan", city: "Mumbai" }
            ].map((wedding, i) => (
              <motion.div key={i} variants={staggerItem} className="group cursor-pointer">
                <div className="overflow-hidden rounded-sm mb-4 aspect-[4/5]">
                  <img src={wedding.img} alt={wedding.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-1">{wedding.title}</h3>
                  <p className="text-primary font-medium mb-1">{wedding.names}</p>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" /> {wedding.city}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8. Stats Counter */}
      <section className="py-20 bg-[#1a1a1a] border-y border-primary/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            {[
              { num: "6,346+", label: "Verified Vendors" },
              { num: "76+", label: "Cities Covered" },
              { num: "63,346+", label: "Happy Couples" },
              { num: "304", label: "Wedding Venues" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-serif text-primary mb-2">{stat.num}</div>
                <div className="text-white/70 text-sm uppercase tracking-wider font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Wedding Blog */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <motion.div {...fadeIn} className="flex-1">
              <SectionHeading label="Tips & Ideas" title="Wedding Blog" highlightedWord="Blog" />
            </motion.div>
            <motion.div {...fadeIn} className="mb-12 md:mb-16">
              <Button variant="outline" className="rounded-none border-primary text-primary hover:bg-primary hover:text-white transition-colors" data-testid="btn-all-posts">
                All posts
              </Button>
            </motion.div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { img: "https://images.unsplash.com/photo-1583396618422-c6cf3b31e30c?w=600&q=80", tag: "Bridal Fashion", title: "15 Stunning Lehenga Trends for 2025 Brides", readTime: "5 min read" },
              { img: "https://images.unsplash.com/photo-1554774853-719586f82d77?w=600&q=80", tag: "Planning Tips", title: "How to Plan Your Wedding Budget Without Stress", readTime: "7 min read" },
              { img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", tag: "Venues", title: "Top 10 Destination Wedding Venues in India", readTime: "6 min read" }
            ].map((blog, i) => (
              <motion.div key={i} variants={staggerItem} className="group cursor-pointer flex flex-col">
                <div className="overflow-hidden rounded-sm mb-4 aspect-video">
                  <img src={blog.img} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2">{blog.tag}</span>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                  <div className="mt-auto text-sm text-muted-foreground flex items-center justify-between">
                    <span>{blog.readTime}</span>
                    <span className="flex items-center gap-1 hover:text-primary transition-colors uppercase text-xs font-bold tracking-wider">
                      Read More <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 10. Testimonials */}
      <section className="py-24 px-6 md:px-12 bg-[#fdf6ee]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn}>
            <SectionHeading label="Love Stories" title="What Couples Say" highlightedWord="Couples" />
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&q=80", name: "Priya & Rahul", city: "Mumbai", text: "Book My Squad made our wedding planning so effortless. We found our photographer, decorator, and caterer all through this platform. Pure magic!" },
              { img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&q=80", name: "Ananya & Vikram", city: "Jaipur", text: "From mehendi artist to venue — every vendor we found through Book My Squad was absolutely top-notch. Couldn't have done it without them." },
              { img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&q=80", name: "Neha & Arjun", city: "Goa", text: "The best platform to plan a wedding in India. The vendor quality is exceptional and the team support was incredible throughout our journey." }
            ].map((testimonial, i) => (
              <motion.div key={i} variants={staggerItem} className="bg-white p-8 border border-border shadow-sm flex flex-col items-center text-center relative mt-10">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md absolute -top-10">
                  <img src={testimonial.img} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div className="pt-10 flex flex-col items-center">
                  <div className="flex text-primary mb-4">
                    {[1,2,3,4,5].map(star => <span key={star}>★</span>)}
                  </div>
                  <p className="text-muted-foreground italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <h4 className="font-serif text-lg font-bold text-foreground">{testimonial.name}</h4>
                  <span className="text-sm text-primary uppercase tracking-wider">{testimonial.city}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 11. Vendor CTA Section */}
      <section className="py-24 px-6 md:px-12 bg-[#1a1a1a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
            <path d="M0,50 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0" />
          </svg>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeIn}>
            <span className="tracking-[0.2em] text-xs font-semibold uppercase text-white/80 block mb-4">For Vendors</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
              Grow Your <span className="text-primary italic">Wedding</span> Business
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
              Join 10,000+ vendors growing their business on Book My Squad. List for free and reach thousands of couples planning right now.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {['Free basic listing', 'Direct enquiries', 'Verified badge', 'Analytics dashboard'].map((feature, i) => (
                <div key={i} className="flex items-center text-white gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-none py-6 px-10 text-base uppercase tracking-wider font-semibold" data-testid="btn-vendor-cta">
              List Your Business Free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 12. App Download Section */}
      <section className="py-0 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 p-12 md:p-24"
          >
            <span className="tracking-[0.2em] text-xs font-semibold uppercase text-muted-foreground block mb-4">Available on iOS & Android</span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6 leading-tight">
              Plan Your Wedding <br/><span className="text-primary italic">On the Go</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-md">
              Browse vendors, save favourites, chat directly, and manage everything from your phone.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="rounded-none border-border text-foreground hover:bg-gray-50 h-14 px-8 text-base gap-3" data-testid="btn-app-store">
                <span className="text-xl">📱</span> App Store
              </Button>
              <Button variant="outline" className="rounded-none border-border text-foreground hover:bg-gray-50 h-14 px-8 text-base gap-3" data-testid="btn-play-store">
                <span className="text-xl">🤖</span> Google Play
              </Button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80" 
              alt="App on mobile device" 
              className="w-full h-full object-cover object-center max-h-[600px] md:max-h-[800px]"
            />
          </motion.div>
        </div>
      </section>

    </div>
  );
}
