import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, User, Building2, ChevronDown, CheckCircle2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  "Wedding Planner", "Photographer", "Videographer", "Makeup Artist",
  "Mehendi Artist", "Decorator", "Caterer", "DJ / Music", "Venue / Banquet",
  "Bridal Wear", "Groom Wear", "Jewellery", "Pandit / Priest", "Anchor / MC",
  "Entertainer", "Choreographer", "Florist", "Transportation", "Other"
];

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Jaipur", "Udaipur", "Goa", "Pune", "Ahmedabad", "Lucknow",
  "Chandigarh", "Rishikesh", "Mussoorie", "Dehradun", "Agra", "Varanasi",
  "Amritsar", "Kochi", "Coimbatore", "Bhubaneswar", "Nagpur", "Indore"
];

const FIELD = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="font-cinzel text-[10px] tracking-[0.3em] text-primary/80 uppercase">{label}</label>
    {children}
  </div>
);

const INPUT_CLS = "w-full bg-white/5 border border-white/15 focus:border-primary/50 outline-none px-4 py-3.5 font-manrope text-sm text-white/85 placeholder:text-white/30 transition-colors duration-300 rounded-sm focus:bg-white/8";
const SELECT_CLS = INPUT_CLS + " cursor-pointer appearance-none";

export default function ListYourBusiness() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    category: "",
    city: "",
    phone: "",
    email: "",
    website: "",
    experience: "",
    priceRange: "",
    description: "",
    instagram: "",
    howDidYouHear: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName || !form.ownerName || !form.category || !form.city || !form.phone || !form.email) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Application Submitted!", description: "Our team will review and contact you within 48 hours." });
  };

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero */}
        <section className="relative py-24 px-6 md:px-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.07)_0%,transparent_65%)]" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative z-10 max-w-3xl mx-auto"
          >
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Join The Network ✦</p>
            <div className="gold-line w-16 mx-auto mb-6" />
            <h1 className="font-cormorant text-5xl md:text-7xl font-light mb-6 text-white leading-[1.1]">
              List Your <span className="text-primary italic font-semibold">Business</span>
            </h1>
            <p className="font-manrope text-white/60 text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed">
              Join India's most trusted wedding & event marketplace. Reach thousands of couples planning their dream celebrations.
            </p>
          </motion.div>
        </section>

        {/* Benefits strip */}
        <section className="bg-primary/8 border-y border-primary/15 py-8 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { n: "50,000+", l: "Monthly Couples" },
              { n: "255+", l: "Verified Vendors" },
              { n: "76+", l: "Cities" },
              { n: "Free", l: "Basic Listing" },
            ].map(s => (
              <div key={s.l} className="text-center">
                <div className="font-cormorant text-3xl text-primary font-semibold">{s.n}</div>
                <div className="font-manrope text-xs text-white/50 uppercase tracking-wider mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Form / Success */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="luxury-card p-16 text-center"
              >
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="font-cormorant text-4xl text-white font-semibold mb-4">Application Received!</h2>
                <p className="font-manrope text-white/60 text-base mb-8 max-w-md mx-auto">
                  Thank you, <span className="text-primary">{form.ownerName}</span>. Our team will review your listing for <strong>{form.businessName}</strong> and reach out within 48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-primary border border-primary/30 px-6 py-3 hover:bg-primary hover:text-black transition-all duration-300"
                >
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                onSubmit={handleSubmit}
                className="luxury-card p-8 md:p-12 space-y-10"
              >
                {/* Section: Business Info */}
                <div>
                  <h3 className="font-cormorant text-2xl text-white mb-6 pb-3 border-b border-white/10">
                    Business Information
                    <span className="text-primary/60 text-sm font-manrope font-light ml-3">* required</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FIELD label="Business Name *">
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                        <input
                          type="text"
                          placeholder="Your business name"
                          className={INPUT_CLS + " pl-10"}
                          value={form.businessName}
                          onChange={set("businessName")}
                          required
                        />
                      </div>
                    </FIELD>

                    <FIELD label="Owner / Contact Name *">
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                        <input
                          type="text"
                          placeholder="Full name"
                          className={INPUT_CLS + " pl-10"}
                          value={form.ownerName}
                          onChange={set("ownerName")}
                          required
                        />
                      </div>
                    </FIELD>

                    <FIELD label="Category *">
                      <div className="relative">
                        <select
                          className={SELECT_CLS}
                          value={form.category}
                          onChange={set("category")}
                          required
                        >
                          <option value="" className="bg-[#0d0b08]">Select your category</option>
                          {CATEGORIES.map(c => (
                            <option key={c} value={c} className="bg-[#0d0b08]">{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      </div>
                    </FIELD>

                    <FIELD label="Primary City *">
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                        <select
                          className={SELECT_CLS + " pl-10"}
                          value={form.city}
                          onChange={set("city")}
                          required
                        >
                          <option value="" className="bg-[#0d0b08]">Select your city</option>
                          {CITIES.map(c => (
                            <option key={c} value={c} className="bg-[#0d0b08]">{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      </div>
                    </FIELD>
                  </div>
                </div>

                {/* Section: Contact */}
                <div>
                  <h3 className="font-cormorant text-2xl text-white mb-6 pb-3 border-b border-white/10">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FIELD label="Phone Number *">
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                        <input
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          className={INPUT_CLS + " pl-10"}
                          value={form.phone}
                          onChange={set("phone")}
                          required
                        />
                      </div>
                    </FIELD>

                    <FIELD label="Email Address *">
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                        <input
                          type="email"
                          placeholder="your@email.com"
                          className={INPUT_CLS + " pl-10"}
                          value={form.email}
                          onChange={set("email")}
                          required
                        />
                      </div>
                    </FIELD>

                    <FIELD label="Website URL">
                      <input
                        type="url"
                        placeholder="https://yourbusiness.com"
                        className={INPUT_CLS}
                        value={form.website}
                        onChange={set("website")}
                      />
                    </FIELD>

                    <FIELD label="Instagram Handle">
                      <input
                        type="text"
                        placeholder="@yourbusiness"
                        className={INPUT_CLS}
                        value={form.instagram}
                        onChange={set("instagram")}
                      />
                    </FIELD>
                  </div>
                </div>

                {/* Section: Details */}
                <div>
                  <h3 className="font-cormorant text-2xl text-white mb-6 pb-3 border-b border-white/10">Business Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FIELD label="Years of Experience">
                      <div className="relative">
                        <select
                          className={SELECT_CLS}
                          value={form.experience}
                          onChange={set("experience")}
                        >
                          <option value="" className="bg-[#0d0b08]">Select experience</option>
                          {["Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"].map(e => (
                            <option key={e} value={e} className="bg-[#0d0b08]">{e}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      </div>
                    </FIELD>

                    <FIELD label="Starting Price Range">
                      <div className="relative">
                        <select
                          className={SELECT_CLS}
                          value={form.priceRange}
                          onChange={set("priceRange")}
                        >
                          <option value="" className="bg-[#0d0b08]">Select range</option>
                          {["Under ₹10,000", "₹10,000 – ₹25,000", "₹25,000 – ₹50,000", "₹50,000 – ₹1,00,000", "₹1,00,000 – ₹3,00,000", "₹3,00,000+"].map(p => (
                            <option key={p} value={p} className="bg-[#0d0b08]">{p}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      </div>
                    </FIELD>
                  </div>

                  <FIELD label="Tell Us About Your Business">
                    <textarea
                      rows={5}
                      placeholder="Describe your services, specialties, and what makes you unique..."
                      className={INPUT_CLS + " resize-none"}
                      value={form.description}
                      onChange={set("description")}
                    />
                  </FIELD>
                </div>

                {/* Section: How did you hear */}
                <div>
                  <FIELD label="How Did You Hear About Us?">
                    <div className="relative">
                      <select
                        className={SELECT_CLS}
                        value={form.howDidYouHear}
                        onChange={set("howDidYouHear")}
                      >
                        <option value="" className="bg-[#0d0b08]">Select an option</option>
                        {["Google Search", "Instagram / Social Media", "Referred by a Friend", "Existing BMS Vendor", "Wedding Expo / Event", "Other"].map(h => (
                          <option key={h} value={h} className="bg-[#0d0b08]">{h}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                  </FIELD>
                </div>

                {/* Terms + Submit */}
                <div className="pt-4 border-t border-white/8">
                  <p className="font-manrope text-xs text-white/35 mb-8 leading-relaxed">
                    By submitting this form, you agree to our{" "}
                    <a href="/terms" className="text-primary/70 hover:text-primary underline underline-offset-2">Terms of Service</a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-primary/70 hover:text-primary underline underline-offset-2">Privacy Policy</a>.
                    Our team will review your application and contact you within 48 hours.
                  </p>

                  <button
                    type="submit"
                    className="w-full md:w-auto px-12 py-4 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.25em] uppercase hover:bg-primary/90 transition-all duration-300 gold-glow flex items-center justify-center gap-3 group"
                    data-testid="btn-submit-listing"
                  >
                    Submit Application
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
