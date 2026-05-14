import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  MapPin, Phone, Mail, User, Building2, ChevronDown,
  CheckCircle2, ArrowRight, FileText, ExternalLink, AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  "Wedding Planner", "Photographer", "Videographer", "Makeup Artist",
  "Mehendi Artist", "Decorator", "Caterer", "DJ / Music", "Venue / Banquet",
  "Bridal Wear", "Groom Wear", "Jewellery", "Pandit / Priest", "Anchor / MC",
  "Entertainer", "Choreographer", "Florist", "Transportation", "Other",
];

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Jaipur", "Udaipur", "Goa", "Pune", "Ahmedabad", "Lucknow",
  "Chandigarh", "Rishikesh", "Mussoorie", "Dehradun", "Agra", "Varanasi",
  "Amritsar", "Kochi", "Coimbatore", "Bhubaneswar", "Nagpur", "Indore",
];

const GSTIN_PORTAL = "https://services.gst.gov.in/services/searchtp";
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const INPUT_CLS =
  "w-full bg-white/5 border border-white/15 focus:border-primary/50 outline-none px-4 py-3.5 font-manrope text-sm text-white/85 placeholder:text-white/30 transition-colors duration-300 rounded-sm focus:bg-white/8";
const SELECT_CLS = INPUT_CLS + " cursor-pointer appearance-none";

function FIELD({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-cinzel text-[10px] tracking-[0.3em] text-primary/80 uppercase">{label}</label>
      {children}
      {hint && <p className="font-manrope text-[11px] text-white/35 leading-snug">{hint}</p>}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-cormorant text-2xl text-white mb-6 pb-3 border-b border-white/10 flex items-baseline gap-3">
      {children}
    </h3>
  );
}

function ConsentBox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex gap-4 items-start cursor-pointer group">
      <div className={`mt-0.5 w-5 h-5 shrink-0 border flex items-center justify-center rounded-sm transition-all duration-200 ${checked ? "bg-primary border-primary" : "border-white/25 bg-white/5 group-hover:border-primary/50"}`}
        onClick={() => onChange(!checked)}>
        {checked && (
          <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} required />
      <p className="font-manrope text-sm text-white/55 leading-relaxed">
        I have read and agree to the{" "}
        <a href="/terms-of-service" className="text-primary/80 hover:text-primary underline underline-offset-2 transition-colors">Terms of Service</a>
        {" "}and{" "}
        <a href="/privacy-policy" className="text-primary/80 hover:text-primary underline underline-offset-2 transition-colors">Privacy Policy</a>
        {" "}of Book My Squad. I confirm that all information provided is accurate and I consent to being contacted by the BMS team.{" "}
        <span className="text-primary/70 font-semibold">This consent is mandatory to proceed.</span>
      </p>
    </label>
  );
}

/* ─── Individual Form ─── */
function IndividualForm({ onSuccess }: { onSuccess: (name: string) => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "", phone: "", email: "", city: "", category: "", description: "",
  });
  const [consent, setConsent] = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast({ title: "Consent Required", description: "You must agree to our Terms & Privacy Policy to continue.", variant: "destructive" });
      return;
    }
    onSuccess(form.name);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="luxury-card p-8 md:p-12 space-y-10"
    >
      <div>
        <SectionHeading>
          Personal Information
          <span className="text-primary/50 text-sm font-manrope font-light">* required</span>
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FIELD label="Full Name *">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
              <input type="text" placeholder="Your full name" className={INPUT_CLS + " pl-10"}
                value={form.name} onChange={set("name")} required />
            </div>
          </FIELD>

          <FIELD label="Phone Number *">
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
              <input type="tel" placeholder="+91 XXXXX XXXXX" className={INPUT_CLS + " pl-10"}
                value={form.phone} onChange={set("phone")} required />
            </div>
          </FIELD>

          <FIELD label="Email Address *">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
              <input type="email" placeholder="your@email.com" className={INPUT_CLS + " pl-10"}
                value={form.email} onChange={set("email")} required />
            </div>
          </FIELD>

          <FIELD label="City *">
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
              <select className={SELECT_CLS + " pl-10"} value={form.city} onChange={set("city")} required>
                <option value="" className="bg-[#0d0b08]">Select your city</option>
                {CITIES.map(c => <option key={c} value={c} className="bg-[#0d0b08]">{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </FIELD>
        </div>
      </div>

      <div>
        <SectionHeading>Service Interest</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FIELD label="Category Interested In">
            <div className="relative">
              <select className={SELECT_CLS} value={form.category} onChange={set("category")}>
                <option value="" className="bg-[#0d0b08]">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0d0b08]">{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </FIELD>

          <FIELD label="Tell Us More">
            <textarea rows={3} placeholder="Briefly describe what you're looking for…"
              className={INPUT_CLS + " resize-none"}
              value={form.description} onChange={set("description")} />
          </FIELD>
        </div>
      </div>

      <div className="pt-4 border-t border-white/8 space-y-6">
        <ConsentBox checked={consent} onChange={setConsent} />
        <button
          type="submit"
          className="w-full md:w-auto px-12 py-4 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.25em] uppercase hover:bg-primary/90 transition-all duration-300 gold-glow flex items-center justify-center gap-3 group"
        >
          Submit Request
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.form>
  );
}

/* ─── Vendor Form ─── */
function VendorForm({ onSuccess }: { onSuccess: (name: string) => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    businessName: "", ownerName: "", phone: "", email: "",
    businessAddress: "", billingAddress: "", gstin: "",
    category: "", city: "", website: "", experience: "", description: "",
  });
  const [billingSame, setBillingSame] = useState(false);
  const [consent, setConsent] = useState(false);
  const [gstinValid, setGstinValid] = useState<null | boolean>(null);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      setForm(f => ({ ...f, [k]: val }));
      if (k === "gstin") {
        const upper = val.toUpperCase();
        setForm(f => ({ ...f, gstin: upper }));
        setGstinValid(upper.length === 0 ? null : GSTIN_REGEX.test(upper));
      }
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast({ title: "Consent Required", description: "You must agree to our Terms & Privacy Policy to continue.", variant: "destructive" });
      return;
    }
    if (form.gstin && gstinValid === false) {
      toast({ title: "Invalid GSTIN", description: "Please enter a valid 15-character GSTIN number.", variant: "destructive" });
      return;
    }
    onSuccess(form.ownerName || form.businessName);
  };

  const billingAddressValue = billingSame ? form.businessAddress : form.billingAddress;

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="luxury-card p-8 md:p-12 space-y-10"
    >
      {/* Business Info */}
      <div>
        <SectionHeading>
          Business Information
          <span className="text-primary/50 text-sm font-manrope font-light">* required</span>
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FIELD label="Business Name *">
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
              <input type="text" placeholder="Registered business name" className={INPUT_CLS + " pl-10"}
                value={form.businessName} onChange={set("businessName")} required />
            </div>
          </FIELD>

          <FIELD label="Owner / Contact Name *">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
              <input type="text" placeholder="Full name of proprietor" className={INPUT_CLS + " pl-10"}
                value={form.ownerName} onChange={set("ownerName")} required />
            </div>
          </FIELD>

          <FIELD label="Service Category *">
            <div className="relative">
              <select className={SELECT_CLS} value={form.category} onChange={set("category")} required>
                <option value="" className="bg-[#0d0b08]">Select your category</option>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0d0b08]">{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </FIELD>

          <FIELD label="Primary City *">
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
              <select className={SELECT_CLS + " pl-10"} value={form.city} onChange={set("city")} required>
                <option value="" className="bg-[#0d0b08]">Select city</option>
                {CITIES.map(c => <option key={c} value={c} className="bg-[#0d0b08]">{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </FIELD>
        </div>
      </div>

      {/* Contact Details */}
      <div>
        <SectionHeading>Contact Details</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FIELD label="Phone Number *">
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
              <input type="tel" placeholder="+91 XXXXX XXXXX" className={INPUT_CLS + " pl-10"}
                value={form.phone} onChange={set("phone")} required />
            </div>
          </FIELD>

          <FIELD label="Email Address *">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
              <input type="email" placeholder="your@business.com" className={INPUT_CLS + " pl-10"}
                value={form.email} onChange={set("email")} required />
            </div>
          </FIELD>

          <FIELD label="Website URL">
            <input type="url" placeholder="https://yourbusiness.com" className={INPUT_CLS}
              value={form.website} onChange={set("website")} />
          </FIELD>

          <FIELD label="Years of Experience">
            <div className="relative">
              <select className={SELECT_CLS} value={form.experience} onChange={set("experience")}>
                <option value="" className="bg-[#0d0b08]">Select experience</option>
                {["Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"].map(e => (
                  <option key={e} value={e} className="bg-[#0d0b08]">{e}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </FIELD>
        </div>
      </div>

      {/* Addresses */}
      <div>
        <SectionHeading>Address Details</SectionHeading>
        <div className="space-y-6">
          <FIELD label="Business Address *">
            <textarea rows={3} placeholder="Full registered business address (street, area, city, pincode)"
              className={INPUT_CLS + " resize-none"}
              value={form.businessAddress} onChange={set("businessAddress")} required />
          </FIELD>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-cinzel text-[10px] tracking-[0.3em] text-primary/80 uppercase">Billing Address</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setBillingSame(s => !s)}
                  className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${billingSame ? "bg-primary border-primary" : "border-white/25 bg-white/5"}`}
                >
                  {billingSame && (
                    <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="font-manrope text-xs text-white/50">Same as business address</span>
              </label>
            </div>
            <textarea rows={3}
              placeholder={billingSame ? "Using the business address above" : "Full billing address (if different from business address)"}
              className={INPUT_CLS + " resize-none " + (billingSame ? "opacity-40 cursor-not-allowed" : "")}
              value={billingAddressValue}
              onChange={billingSame ? undefined : set("billingAddress")}
              readOnly={billingSame}
            />
          </div>
        </div>
      </div>

      {/* GSTIN */}
      <div>
        <SectionHeading>
          GST Registration
          <span className="text-primary/50 text-sm font-manrope font-light">Strongly recommended</span>
        </SectionHeading>

        <div className="p-4 bg-primary/5 border border-primary/20 rounded-sm mb-6 flex gap-3">
          <AlertCircle className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" />
          <p className="font-manrope text-xs text-white/55 leading-relaxed">
            Only vendors with an <strong className="text-white/80">Active GST status</strong> will receive a verified badge on Book My Squad.
            Please verify your GSTIN on the official GST portal before submitting.{" "}
            <a
              href={GSTIN_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/80 hover:text-primary inline-flex items-center gap-1 underline underline-offset-2 transition-colors"
            >
              Check GST Status <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        <FIELD
          label="GSTIN (GST Identification Number)"
          hint="15-character GSTIN — e.g. 27AAPFU0939F1ZV. Leave blank if not registered."
        >
          <div className="relative">
            <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
            <input
              type="text"
              placeholder="27AAPFU0939F1ZV"
              maxLength={15}
              className={
                INPUT_CLS + " pl-10 pr-36 tracking-widest font-mono uppercase " +
                (form.gstin.length > 0
                  ? gstinValid === true
                    ? "border-green-500/50 focus:border-green-500/70"
                    : gstinValid === false
                    ? "border-red-500/50 focus:border-red-500/70"
                    : ""
                  : "")
              }
              value={form.gstin}
              onChange={set("gstin")}
            />
            <a
              href={GSTIN_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 font-cinzel text-[8px] tracking-[0.15em] uppercase text-primary/70 hover:text-primary border border-primary/25 hover:border-primary/50 px-2 py-1 transition-all bg-[#0d0a07]"
            >
              Verify <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          {form.gstin.length > 0 && (
            <p className={`font-manrope text-[11px] mt-1 flex items-center gap-1 ${gstinValid ? "text-green-400/80" : "text-red-400/80"}`}>
              {gstinValid === true ? (
                <><CheckCircle2 className="w-3 h-3" /> Valid GSTIN format — please also verify Active status on the GST portal</>
              ) : (
                <><AlertCircle className="w-3 h-3" /> Invalid GSTIN format — must be exactly 15 alphanumeric characters</>
              )}
            </p>
          )}
        </FIELD>
      </div>

      {/* Description */}
      <div>
        <SectionHeading>About Your Business</SectionHeading>
        <FIELD label="Tell Us About Your Services">
          <textarea rows={5} placeholder="Describe your services, specialties, notable events you've covered, and what sets you apart…"
            className={INPUT_CLS + " resize-none"}
            value={form.description} onChange={set("description")} />
        </FIELD>
      </div>

      {/* Consent + Submit */}
      <div className="pt-4 border-t border-white/8 space-y-6">
        <ConsentBox checked={consent} onChange={setConsent} />
        <button
          type="submit"
          className="w-full md:w-auto px-12 py-4 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.25em] uppercase hover:bg-primary/90 transition-all duration-300 gold-glow flex items-center justify-center gap-3 group"
        >
          Submit Application
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.form>
  );
}

/* ─── Main Page ─── */
type FormType = "individual" | "vendor";

export default function ListYourBusiness() {
  const [formType, setFormType] = useState<FormType>("individual");
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const handleSuccess = (name: string) => {
    setSubmittedName(name);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

        {/* Stats strip */}
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

        {/* Form section */}
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
                <p className="font-manrope text-white/60 text-base mb-8 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-primary">{submittedName}</span>. Our team will review your{" "}
                  {formType === "vendor" ? "vendor listing" : "request"} and reach out within 48 hours.
                  {formType === "vendor" && (
                    <span className="block mt-3 text-sm text-white/40">
                      Vendor applications with an Active GSTIN receive priority review and receive a Verified badge.
                    </span>
                  )}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-primary border border-primary/30 px-6 py-3 hover:bg-primary hover:text-black transition-all duration-300"
                >
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <>
                {/* Form type tab switcher */}
                <div className="mb-10">
                  <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/60 uppercase text-center mb-5">
                    Select registration type
                  </p>
                  <div className="flex rounded-sm bg-white/[0.03] border border-white/10 p-1.5 gap-1.5 max-w-md mx-auto">
                    {([
                      { key: "individual", label: "Individual", sub: "Looking for services" },
                      { key: "vendor", label: "Vendor / Business", sub: "Offering services" },
                    ] as const).map(t => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setFormType(t.key)}
                        className={`flex-1 py-3 px-4 rounded-sm transition-all duration-300 flex flex-col items-center gap-0.5 ${
                          formType === t.key
                            ? "bg-primary text-black"
                            : "text-white/45 hover:text-white/70 hover:bg-white/5"
                        }`}
                      >
                        <span className={`font-cinzel text-[10px] tracking-[0.2em] uppercase font-bold ${formType === t.key ? "text-black" : ""}`}>
                          {t.label}
                        </span>
                        <span className={`font-manrope text-[9px] ${formType === t.key ? "text-black/60" : "text-white/30"}`}>
                          {t.sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {formType === "individual" ? (
                    <IndividualForm key="individual" onSuccess={handleSuccess} />
                  ) : (
                    <VendorForm key="vendor" onSuccess={handleSuccess} />
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
