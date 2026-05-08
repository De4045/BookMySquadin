import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Heart } from "lucide-react";

const WEDDINGS = [
  { img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80", title: "Royal Rajasthani", names: "Priya & Rahul", city: "Udaipur", desc: "A regal palace wedding filled with marigold mandaps and grand baraat." },
  { img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80", title: "Pink City Magic", names: "Ananya & Vikram", city: "Jaipur", desc: "Rustic havelis, folk music, and a timeless desert sunset ceremony." },
  { img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80", title: "Beach Boho", names: "Neha & Arjun", city: "Goa", desc: "Barefoot on golden sands with florals, fairy lights and ocean waves." },
  { img: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80", title: "Modern Luxury", names: "Shriya & Karan", city: "Mumbai", desc: "A skyline venue draped in ivory and champagne — the epitome of city chic." },
  { img: "https://images.unsplash.com/photo-1583396618422-c6cf3b31e30c?w=800&q=80", title: "Heritage Garden", names: "Pooja & Rohan", city: "Delhi", desc: "Lush greens and heritage architecture turned into a floral dreamscape." },
  { img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80", title: "Mountain Serenity", names: "Aisha & Dev", city: "Mussoorie", desc: "Mist-wrapped mountains and pine forests created nature's own altar." },
];

export default function RealWeddings() {
  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <section className="relative py-24 px-6 md:px-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06)_0%,transparent_65%)]" />
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative z-10">
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Inspiration ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h1 className="font-cormorant text-5xl md:text-7xl font-light mb-6">
              Real <span className="text-primary italic font-semibold">Weddings</span>
            </h1>
            <p className="font-manrope text-white/60 text-base max-w-lg mx-auto">
              Beautiful stories from real couples who found their dream team on Book My Squad.
            </p>
          </motion.div>
        </section>

        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {WEDDINGS.map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="luxury-card group cursor-pointer overflow-hidden"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img src={w.img} alt={w.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="font-cinzel text-[9px] tracking-[0.3em] text-primary/80 uppercase">{w.title}</span>
                      <h3 className="font-cormorant text-xl text-white font-semibold">{w.names}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 mb-3">
                      <MapPin className="w-3 h-3 text-primary/60" />
                      <span className="font-manrope text-xs text-white/50">{w.city}</span>
                    </div>
                    <p className="font-manrope text-sm text-white/60 leading-relaxed">{w.desc}</p>
                    <div className="flex items-center gap-2 mt-4 text-primary/60 hover:text-primary transition-colors">
                      <Heart className="w-3.5 h-3.5" />
                      <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase">View Gallery</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
