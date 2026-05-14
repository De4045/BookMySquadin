import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone, Users, Bed, UtensilsCrossed, Heart, CheckCircle2, ChevronRight, Lock, BadgeCheck } from "lucide-react";
import { type Venue } from "@/data/venues";
import { useShortlist } from "@/context/ShortlistContext";
import { useAuth } from "@/context/AuthContext";
import { isVenueVerified } from "@/data/subscriptions";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

const TYPE_IMAGES: Record<string, string> = {
  HOTEL:     "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85",
  RESORT:    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85",
  FARMHOUSE: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=85",
  BANQUET:   "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=85",
};

const INPUT = "w-full bg-white/[0.05] border border-white/10 focus:border-primary/50 outline-none px-4 py-3 font-manrope text-sm text-white placeholder:text-white/30 transition-colors rounded-sm";

interface Props {
  venue: Venue | null;
  onClose: () => void;
}

export function VenueDetailModal({ venue, onClose }: Props) {
  const { has, toggle } = useShortlist();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!venue) return null;

  const typeKey = (venue.type || "").toUpperCase().trim();
  const coverImg = TYPE_IMAGES[typeKey] || TYPE_IMAGES.BANQUET;
  const shortlistId = `venue-${venue.property_name}-${venue.city_sheet}`;
  const isShortlisted = has(shortlistId);
  const isVerified = isVenueVerified(venue.property_name);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone) {
      setError("Name, email and phone are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/api/venues/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          eventDate: form.date,
          message: form.message,
          venueName: venue.property_name,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
      />
      <motion.div
        key="panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#0d0a07] z-50 overflow-y-auto flex flex-col shadow-2xl"
      >
        {/* Cover */}
        <div className="relative h-60 shrink-0 overflow-hidden">
          <img src={coverImg} alt={venue.property_name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a07] via-black/50 to-transparent" />

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-primary bg-black/60 border border-primary/30 px-2.5 py-1 backdrop-blur-sm">
              {typeKey || "VENUE"}
            </span>
            {isVerified && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/15 border border-primary/40 backdrop-blur-sm self-start">
                <BadgeCheck className="w-3 h-3 text-primary" />
                <span className="font-cinzel text-[7px] tracking-[0.15em] text-primary uppercase">Verified</span>
              </div>
            )}
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => toggle({ id: shortlistId, type: "venue", name: venue.property_name, city: venue.city_sheet })}
              className={`w-9 h-9 rounded-sm flex items-center justify-center backdrop-blur-sm border transition-all duration-300 ${
                isShortlisted ? "bg-primary/20 border-primary text-primary" : "bg-black/50 border-white/20 text-white/70 hover:border-primary/60 hover:text-primary"
              }`}
            >
              <Heart className={`w-4 h-4 ${isShortlisted ? "fill-primary" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-sm bg-black/50 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-5 left-6 right-6">
            <h2 className="font-cormorant text-2xl md:text-3xl text-white font-semibold leading-tight mb-1">
              {venue.property_name}
            </h2>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary/60 shrink-0" />
              <span className="font-manrope text-sm text-white/55">{venue.location || venue.city_sheet}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-7 space-y-7">

          {/* Stats grid */}
          {(venue.max_banquet_capacity || venue.max_rooms || venue.catering_type) && (
            <div className="grid grid-cols-3 gap-3">
              {venue.max_banquet_capacity && venue.max_banquet_capacity !== "0" && (
                <div className="bg-white/[0.04] border border-white/8 p-3 rounded-sm text-center">
                  <Users className="w-4 h-4 text-primary/60 mx-auto mb-1.5" />
                  <div className="font-cormorant text-xl text-white font-semibold leading-none">{venue.max_banquet_capacity}</div>
                  <div className="font-cinzel text-[8px] tracking-[0.15em] text-white/35 uppercase mt-1">Guests</div>
                </div>
              )}
              {venue.max_rooms && venue.max_rooms !== "0" && (
                <div className="bg-white/[0.04] border border-white/8 p-3 rounded-sm text-center">
                  <Bed className="w-4 h-4 text-primary/60 mx-auto mb-1.5" />
                  <div className="font-cormorant text-xl text-white font-semibold leading-none">{venue.max_rooms}</div>
                  <div className="font-cinzel text-[8px] tracking-[0.15em] text-white/35 uppercase mt-1">Rooms</div>
                </div>
              )}
              {venue.catering_type && (
                <div className="bg-white/[0.04] border border-white/8 p-3 rounded-sm text-center">
                  <UtensilsCrossed className="w-4 h-4 text-primary/60 mx-auto mb-1.5" />
                  <div className="font-manrope text-xs text-white/80 capitalize leading-tight mt-0.5">{venue.catering_type.toLowerCase()}</div>
                  <div className="font-cinzel text-[8px] tracking-[0.15em] text-white/35 uppercase mt-1">Catering</div>
                </div>
              )}
            </div>
          )}

          {/* Why choose */}
          <div className="space-y-2.5">
            <p className="font-cinzel text-[9px] tracking-[0.3em] text-primary/50 uppercase mb-3">Why choose this venue</p>
            {[
              "Premium property verified by our editorial team",
              "Dedicated relationship manager assigned on booking",
              "Flexible packages for all budget ranges",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <span className="font-manrope text-sm text-white/60">{point}</span>
              </div>
            ))}
          </div>

          {/* Contact */}
          {(venue.contact_number || venue.concerned_person_name) && (
            <div className="border-t border-white/8 pt-6 space-y-3">
              <p className="font-cinzel text-[9px] tracking-[0.3em] text-primary/50 uppercase">Direct Contact</p>
              {user ? (
                <>
                  {venue.concerned_person_name && (
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-[11px] text-primary font-cinzel font-bold">
                        {venue.concerned_person_name.charAt(0)}
                      </div>
                      <span className="font-manrope text-sm text-white/60">{venue.concerned_person_name}</span>
                    </div>
                  )}
                  {venue.contact_number && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                      <a href={`tel:${venue.contact_number}`} className="font-mono text-sm text-white/60 hover:text-primary transition-colors">
                        {venue.contact_number}
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 p-5 bg-primary/5 border border-primary/15 rounded-sm text-center">
                  <Lock className="w-5 h-5 text-primary/40" />
                  <p className="font-manrope text-sm text-white/50 leading-relaxed">
                    Contact details are available to <strong className="text-white/70">members only</strong>.
                  </p>
                  <a
                    href={`${BASE}/login`}
                    className="px-4 py-2 bg-primary text-black font-cinzel text-[9px] tracking-[0.2em] uppercase rounded-sm hover:bg-primary/90 transition-colors"
                  >
                    Sign In to View
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Enquiry form */}
          <div className="border-t border-white/8 pt-6">
            <p className="font-cinzel text-[9px] tracking-[0.3em] text-primary/50 uppercase mb-5">Send Enquiry</p>

            {submitted ? (
              <div className="text-center py-10">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
                  <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
                  <h3 className="font-cormorant text-2xl text-white font-medium mb-2">Enquiry Sent!</h3>
                  <p className="font-manrope text-white/50 text-sm leading-relaxed">
                    Our team will reach out within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name:"",email:"",phone:"",date:"",message:"" }); }}
                    className="mt-6 font-cinzel text-[10px] tracking-[0.2em] text-primary/60 uppercase hover:text-primary transition-colors"
                  >
                    Send Another →
                  </button>
                </motion.div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <p className="text-red-400/90 font-manrope text-sm bg-red-400/8 border border-red-400/20 px-4 py-2.5 rounded-sm">{error}</p>
                )}
                <input type="text" placeholder="Your Full Name *" value={form.name} onChange={set("name")} className={INPUT} />
                <input type="email" placeholder="Email Address *" value={form.email} onChange={set("email")} className={INPUT} />
                <input type="tel" placeholder="Phone Number *" value={form.phone} onChange={set("phone")} className={INPUT} />

                {/* Real-time availability calendar */}
                <div>
                  <p className="font-cinzel text-[9px] tracking-[0.25em] text-white/35 uppercase mb-2">Select Event Date</p>
                  <AvailabilityCalendar
                    venueName={venue.property_name}
                    value={form.date}
                    onChange={(d) => setForm(f => ({ ...f, date: d }))}
                  />
                </div>

                <textarea
                  placeholder="Tell us about your event (guest count, event type, special requests)..."
                  value={form.message} onChange={set("message")} rows={3}
                  className={INPUT + " resize-none"}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed gold-glow rounded-sm mt-1"
                >
                  {submitting ? "Sending…" : "Send Enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
