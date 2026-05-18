import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useShortlist } from "@/context/ShortlistContext";
import {
  LogOut, ExternalLink, Heart, Building2, Briefcase, ShieldCheck, User,
  MapPin, ChevronRight, CreditCard, MessageSquare, Loader2, Inbox,
  CalendarDays, Tag, CalendarCheck2, IndianRupee, CheckCircle2,
} from "lucide-react";
import { PaymentTab } from "./PaymentTab";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const ROLE_META: Record<string, { label: string; color: string; icon: React.ElementType; portal: string; portalLabel: string }> = {
  admin:  { label: "Administrator",  color: "text-red-400 border-red-400/30 bg-red-400/10",      icon: ShieldCheck, portal: "/portal/admin",  portalLabel: "Admin Dashboard" },
  vendor: { label: "Vendor",         color: "text-blue-400 border-blue-400/30 bg-blue-400/10",   icon: Briefcase,   portal: "/portal/vendor", portalLabel: "Vendor Dashboard" },
  venue:  { label: "Venue Manager",  color: "text-purple-400 border-purple-400/30 bg-purple-400/10", icon: Building2, portal: "/portal/venue", portalLabel: "Venue Dashboard" },
  user:   { label: "Customer",       color: "text-green-400 border-green-400/30 bg-green-400/10",  icon: User,       portal: "/",              portalLabel: "Back to Home" },
};

type EnquiryRow = {
  id: string;
  kind: "vendor" | "venue" | "contact" | "listing";
  subject: string;
  detail: string;
  message: string;
  status?: string;
  date: string;
};

interface BookingRow {
  id: number;
  vendorName: string;
  vendorCategory: string;
  packageName: string;
  packagePrice: number;
  eventDate: string;
  eventType: string;
  guestCount: number;
  consultationDate?: string;
  consultationTime?: string;
  advancePaid: boolean;
  advanceAmount: number;
  status: "pending" | "confirmed" | "advance_paid" | "completed" | "cancelled";
  createdAt: string;
}

const KIND_META: Record<EnquiryRow["kind"], { label: string; color: string }> = {
  vendor:  { label: "Vendor",   color: "text-blue-300 border-blue-400/30 bg-blue-400/10" },
  venue:   { label: "Venue",    color: "text-purple-300 border-purple-400/30 bg-purple-400/10" },
  contact: { label: "Contact",  color: "text-amber-300 border-amber-400/30 bg-amber-400/10" },
  listing: { label: "Listing",  color: "text-teal-300 border-teal-400/30 bg-teal-400/10" },
};

const STATUS_COLOR: Record<string, string> = {
  new:       "text-primary border-primary/30 bg-primary/10",
  contacted: "text-blue-300 border-blue-400/30 bg-blue-400/10",
  booked:    "text-green-300 border-green-400/30 bg-green-400/10",
};

const BOOKING_STATUS: Record<BookingRow["status"], { label: string; color: string }> = {
  pending:      { label: "Pending",      color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
  confirmed:    { label: "Confirmed",    color: "text-blue-300 border-blue-400/30 bg-blue-400/10" },
  advance_paid: { label: "Advance Paid", color: "text-primary border-primary/30 bg-primary/10" },
  completed:    { label: "Completed",    color: "text-green-300 border-green-400/30 bg-green-400/10" },
  cancelled:    { label: "Cancelled",    color: "text-red-400 border-red-400/30 bg-red-400/10" },
};

function fmtINR(n: number) {
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

export default function Profile() {
  const { user, logout } = useAuth();
  const { items, remove } = useShortlist();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"account" | "bookings" | "enquiries" | "shortlist" | "payment">("account");

  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([]);
  const [enqLoading, setEnqLoading] = useState(false);
  const [enqError, setEnqError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [bkLoading, setBkLoading] = useState(false);
  const [bkError, setBkError] = useState<string | null>(null);

  const fetchEnquiries = useCallback(async () => {
    setEnqLoading(true);
    setEnqError(null);
    try {
      const [genRes, venueRes] = await Promise.all([
        fetch(`${BASE}/api/enquiries/my`, { credentials: "include" }),
        fetch(`${BASE}/api/venues/my-enquiries`, { credentials: "include" }),
      ]);

      const rows: EnquiryRow[] = [];

      if (genRes.ok) {
        const data = await genRes.json() as { enquiries: Array<{
          id: number; type: string; message: string; createdAt: string;
          businessName?: string; category?: string; city?: string;
        }> };
        for (const e of data.enquiries) {
          const kind = (["vendor", "contact", "listing"].includes(e.type) ? e.type : "contact") as EnquiryRow["kind"];
          const subject =
            kind === "vendor"  ? (e.message.match(/Vendor: ([^|]+)/)?.[1]?.trim() ?? "Vendor Enquiry") :
            kind === "listing" ? (e.businessName ?? "Listing Application") :
            "General Contact";
          const detail =
            kind === "vendor"  ? (e.category ?? e.message.match(/Date: ([^|]+)/)?.[1]?.trim() ?? "") :
            kind === "listing" ? (e.category ? `${e.category} · ${e.city ?? ""}` : (e.city ?? "")) :
            "";
          rows.push({ id: `gen-${e.id}`, kind, subject, detail, message: e.message, date: e.createdAt });
        }
      }

      if (venueRes.ok) {
        const data = await venueRes.json() as { enquiries: Array<{
          id: number; venueName?: string; eventDate?: string; message: string;
          status: string; createdAt: string;
        }> };
        for (const e of data.enquiries) {
          rows.push({
            id: `venue-${e.id}`,
            kind: "venue",
            subject: e.venueName ?? "Venue Enquiry",
            detail: e.eventDate ? `Event: ${new Date(e.eventDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}` : "",
            message: e.message,
            status: e.status,
            date: e.createdAt,
          });
        }
      }

      rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEnquiries(rows);
    } catch {
      setEnqError("Could not load enquiries. Please try again.");
    } finally {
      setEnqLoading(false);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    setBkLoading(true);
    setBkError(null);
    try {
      const res = await fetch(`${BASE}/api/bookings/my`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json() as { bookings: BookingRow[] };
        setBookings(data.bookings);
      } else {
        setBkError("Could not load bookings.");
      }
    } catch {
      setBkError("Could not load bookings. Please try again.");
    } finally {
      setBkLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "enquiries") void fetchEnquiries();
    if (tab === "bookings")  void fetchBookings();
  }, [tab, fetchEnquiries, fetchBookings]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080604] flex items-center justify-center">
        <div className="text-center">
          <p className="font-cormorant text-2xl text-white mb-4">Please log in to view your profile</p>
          <Link href="/login">
            <button className="px-6 py-3 bg-primary text-black font-cinzel text-xs tracking-widest uppercase hover:bg-primary/90 transition-all">Sign In</button>
          </Link>
        </div>
      </div>
    );
  }

  const meta = ROLE_META[user.role] ?? ROLE_META.user;
  const RoleIcon = meta.icon;
  const initials = user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const venueItems = items.filter(i => i.type === "venue");
  const vendorItems = items.filter(i => i.type === "vendor");

  const tabs = [
    { key: "account",   label: "Account",                        icon: User },
    { key: "bookings",  label: bookings.length > 0 ? `Bookings (${bookings.length})` : "Bookings", icon: CalendarCheck2 },
    { key: "enquiries", label: enquiries.length > 0 && tab !== "enquiries" ? `Enquiries (${enquiries.length})` : "Enquiries", icon: MessageSquare },
    { key: "shortlist", label: `Saved (${items.length})`,        icon: Heart },
    { key: "payment",   label: "Membership",                     icon: CreditCard },
  ] as const;

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080604]/98 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-cormorant text-xl font-semibold">
            <span className="text-primary italic">Book</span> My Squad
          </Link>
          <div className="w-px h-4 bg-white/15" />
          <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/40 uppercase">My Profile</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hidden md:flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.2em] text-white/35 hover:text-primary uppercase transition-colors">
            <ExternalLink className="w-3 h-3" /> Back to Site
          </Link>
          <div className="w-px h-4 bg-white/15 hidden md:block" />
          <button onClick={async () => { await logout(); navigate("/"); }}
            className="flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.15em] uppercase text-white/35 hover:text-red-400 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="pt-14">
        <div className="bg-[#0a0806] border-b border-white/8 px-6 flex gap-0 overflow-x-auto">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-4 font-cinzel text-[9px] tracking-[0.2em] uppercase border-b-2 transition-all whitespace-nowrap ${
                  tab === t.key ? "border-primary text-primary" : "border-transparent text-white/35 hover:text-white/60"
                }`}>
                <Icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto px-6 py-10">

          {/* ── Account ── */}
          {tab === "account" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5">
              <div className="bg-[#1a1510] border border-white/8 p-8">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 rounded-sm bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                    <span className="font-cinzel text-3xl text-primary font-bold">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-cormorant text-3xl text-white font-semibold mb-1">{user.name}</h2>
                    <p className="font-manrope text-sm text-white/45 mb-2">{user.email}</p>
                    <span className={`font-cinzel text-[8px] uppercase tracking-[0.2em] px-2.5 py-1 border rounded-sm inline-flex items-center gap-1.5 ${meta.color}`}>
                      <RoleIcon className="w-3 h-3" /> {meta.label}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Full Name",      value: user.name },
                    { label: "Email Address",  value: user.email },
                    { label: "Account Type",   value: meta.label },
                    { label: "Member Since",   value: fmt(user.createdAt) },
                    { label: "Account Status", value: "Active" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/30 uppercase">{item.label}</span>
                      <span className="font-manrope text-sm text-white/65">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {user.role !== "user" && (
                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/50 uppercase mb-3">Your Portal</p>
                  <p className="font-manrope text-sm text-white/45 mb-4">Access your dedicated management portal to manage listings and enquiries.</p>
                  <Link href={meta.portal}>
                    <button className="w-full flex items-center justify-between px-5 py-4 bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all group">
                      <div className="flex items-center gap-3">
                        <RoleIcon className="w-4 h-4 text-primary" />
                        <span className="font-cinzel text-[10px] tracking-[0.2em] text-primary uppercase">{meta.portalLabel}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>
                </div>
              )}

              <div className="bg-[#1a1510] border border-white/8 p-6">
                <p className="font-cinzel text-[10px] tracking-[0.3em] text-white/30 uppercase mb-3">Session</p>
                <button
                  onClick={async () => { await logout(); navigate("/"); }}
                  className="flex items-center gap-2.5 font-cinzel text-[10px] tracking-[0.2em] uppercase text-red-400/60 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out of Account
                </button>
              </div>
            </motion.div>
          )}

          {/* ── My Bookings ── */}
          {tab === "bookings" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6">
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ Confirmed & Pending ✦</p>
                <h2 className="font-cormorant text-3xl font-light text-white">My <span className="text-primary italic font-semibold">Bookings</span></h2>
              </div>

              {bkLoading && (
                <div className="flex items-center justify-center py-20 bg-[#1a1510] border border-white/8">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              )}

              {bkError && !bkLoading && (
                <div className="bg-[#1a1510] border border-red-400/20 p-6 text-center">
                  <p className="font-manrope text-sm text-red-400/70 mb-3">{bkError}</p>
                  <button onClick={() => void fetchBookings()} className="font-cinzel text-[9px] tracking-widest uppercase text-primary hover:text-primary/80 transition-colors">
                    Try Again
                  </button>
                </div>
              )}

              {!bkLoading && !bkError && bookings.length === 0 && (
                <div className="text-center py-20 bg-[#1a1510] border border-white/8">
                  <CalendarCheck2 className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="font-cormorant text-2xl text-white/40 mb-2">No Bookings Yet</p>
                  <p className="font-manrope text-sm text-white/25 mb-6">When you book a vendor through BMS, your confirmed bookings will appear here.</p>
                  <div className="flex justify-center gap-4">
                    <Link href="/vendors"><button className="px-5 py-2.5 border border-primary/40 text-primary font-cinzel text-[9px] tracking-widest uppercase hover:bg-primary hover:text-black transition-all">Browse Vendors</button></Link>
                    <Link href="/venues"><button className="px-5 py-2.5 border border-white/15 text-white/50 font-cinzel text-[9px] tracking-widest uppercase hover:border-primary/40 hover:text-primary transition-all">Browse Venues</button></Link>
                  </div>
                </div>
              )}

              {!bkLoading && !bkError && bookings.length > 0 && (
                <>
                  {/* Summary stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: "Total",        value: bookings.length,                                    color: "text-primary" },
                      { label: "Advance Paid", value: bookings.filter(b => b.advancePaid).length,         color: "text-green-400" },
                      { label: "Completed",    value: bookings.filter(b => b.status === "completed").length, color: "text-blue-300" },
                    ].map(s => (
                      <div key={s.label} className="bg-[#1a1510] border border-white/8 p-4 text-center">
                        <p className={`font-cinzel text-2xl font-bold mb-0.5 ${s.color}`}>{s.value}</p>
                        <p className="font-cinzel text-[8px] tracking-[0.25em] text-white/30 uppercase">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <AnimatePresence>
                    <div className="space-y-3">
                      {bookings.map((b, i) => {
                        const st = BOOKING_STATUS[b.status];
                        return (
                          <motion.div
                            key={b.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.04 }}
                            className="bg-[#1a1510] border border-white/8 hover:border-primary/20 transition-colors p-5"
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`font-cinzel text-[7px] tracking-[0.15em] uppercase px-2 py-0.5 border rounded-sm ${st.color}`}>{st.label}</span>
                                {b.advancePaid && (
                                  <span className="font-cinzel text-[7px] tracking-[0.15em] uppercase px-2 py-0.5 border border-green-400/35 bg-green-400/10 text-green-400 rounded-sm flex items-center gap-1">
                                    <CheckCircle2 className="w-2.5 h-2.5" /> {fmtINR(b.advanceAmount)} Advance Paid
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <CalendarDays className="w-3 h-3 text-white/20" />
                                <span className="font-cinzel text-[8px] tracking-wide text-white/25">{fmt(b.createdAt)}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-4 flex-wrap mb-3">
                              <div className="min-w-0">
                                <p className="font-cormorant text-lg text-primary/90 font-semibold leading-tight">{b.vendorName}</p>
                                <p className="font-cinzel text-[8px] tracking-[0.15em] text-white/35 uppercase mt-0.5">{b.vendorCategory}</p>
                              </div>
                              <div className="w-px h-8 bg-white/8 hidden sm:block self-center" />
                              <div className="min-w-0">
                                <p className="font-manrope text-sm text-white/70 font-medium">{b.packageName}</p>
                                <p className="font-cinzel text-[8px] tracking-[0.12em] text-primary/50 uppercase">{b.eventType}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 flex-wrap">
                              {b.eventDate && (
                                <div className="flex items-center gap-1.5">
                                  <CalendarDays className="w-3 h-3 text-primary/35" />
                                  <span className="font-manrope text-xs text-white/50">{fmt(b.eventDate)}</span>
                                </div>
                              )}
                              {b.guestCount > 0 && (
                                <span className="font-manrope text-xs text-white/40">~{b.guestCount} guests</span>
                              )}
                              {b.packagePrice > 0 && (
                                <div className="flex items-center gap-1">
                                  <IndianRupee className="w-3 h-3 text-primary/35" />
                                  <span className="font-manrope text-xs text-white/45">{fmtINR(b.packagePrice)}</span>
                                </div>
                              )}
                            </div>

                            {b.consultationDate && b.consultationTime && (
                              <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-primary/8 border border-primary/20 rounded-sm">
                                <Tag className="w-3 h-3 text-primary/50 shrink-0" />
                                <span className="font-cinzel text-[8px] tracking-[0.12em] text-primary/70 uppercase">
                                  Consultation: {fmt(b.consultationDate)} · {b.consultationTime}
                                </span>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          )}

          {/* ── My Enquiries ── */}
          {tab === "enquiries" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6">
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ Your Activity ✦</p>
                <h2 className="font-cormorant text-3xl font-light text-white">My <span className="text-primary italic font-semibold">Enquiries</span></h2>
              </div>

              {!enqLoading && enquiries.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Total",   value: enquiries.length, color: "text-primary" },
                    { label: "Vendors", value: enquiries.filter(e => e.kind === "vendor").length, color: "text-blue-300" },
                    { label: "Venues",  value: enquiries.filter(e => e.kind === "venue").length,  color: "text-purple-300" },
                  ].map(s => (
                    <div key={s.label} className="bg-[#1a1510] border border-white/8 p-4 text-center">
                      <p className={`font-cinzel text-2xl font-bold mb-0.5 ${s.color}`}>{s.value}</p>
                      <p className="font-cinzel text-[8px] tracking-[0.25em] text-white/30 uppercase">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {enqLoading && (
                <div className="flex items-center justify-center py-20 bg-[#1a1510] border border-white/8">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              )}

              {enqError && !enqLoading && (
                <div className="bg-[#1a1510] border border-red-400/20 p-6 text-center">
                  <p className="font-manrope text-sm text-red-400/70 mb-3">{enqError}</p>
                  <button onClick={() => void fetchEnquiries()} className="font-cinzel text-[9px] tracking-widest uppercase text-primary hover:text-primary/80 transition-colors">
                    Try Again
                  </button>
                </div>
              )}

              {!enqLoading && !enqError && enquiries.length === 0 && (
                <div className="text-center py-20 bg-[#1a1510] border border-white/8">
                  <Inbox className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="font-cormorant text-2xl text-white/40 mb-2">No Enquiries Yet</p>
                  <p className="font-manrope text-sm text-white/25 mb-6">When you contact a vendor or venue, your enquiries will appear here.</p>
                  <div className="flex justify-center gap-4">
                    <Link href="/venues"><button className="px-5 py-2.5 border border-primary/40 text-primary font-cinzel text-[9px] tracking-widest uppercase hover:bg-primary hover:text-black transition-all">Browse Venues</button></Link>
                    <Link href="/vendors"><button className="px-5 py-2.5 border border-white/15 text-white/50 font-cinzel text-[9px] tracking-widest uppercase hover:border-primary/40 hover:text-primary transition-all">Browse Vendors</button></Link>
                  </div>
                </div>
              )}

              {!enqLoading && !enqError && enquiries.length > 0 && (
                <AnimatePresence>
                  <div className="space-y-2">
                    {enquiries.map((e, i) => {
                      const km = KIND_META[e.kind];
                      const msgPreview = e.message.length > 80 ? e.message.slice(0, 80) + "…" : e.message;
                      return (
                        <motion.div
                          key={e.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.04 }}
                          className="bg-[#1a1510] border border-white/8 hover:border-primary/20 transition-colors p-5"
                        >
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className={`font-cinzel text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 border rounded-sm ${km.color}`}>
                                {km.label}
                              </span>
                              {e.status && (
                                <span className={`font-cinzel text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 border rounded-sm ${STATUS_COLOR[e.status] ?? STATUS_COLOR.new}`}>
                                  {e.status}
                                </span>
                              )}
                              <h3 className="font-manrope text-sm text-white/80 font-medium">{e.subject}</h3>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <CalendarDays className="w-3 h-3 text-white/25" />
                              <span className="font-cinzel text-[8px] tracking-wide text-white/30">{fmt(e.date)}</span>
                            </div>
                          </div>

                          {e.detail && (
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Tag className="w-3 h-3 text-primary/30 shrink-0" />
                              <span className="font-cinzel text-[8px] tracking-wider text-primary/50 uppercase">{e.detail}</span>
                            </div>
                          )}

                          <p className="font-manrope text-xs text-white/30 leading-relaxed">{msgPreview}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </AnimatePresence>
              )}
            </motion.div>
          )}

          {/* ── Membership ── */}
          {tab === "payment" && <PaymentTab role="user" />}

          {/* ── Saved / Shortlist ── */}
          {tab === "shortlist" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6">
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ Saved Favourites ✦</p>
                <h2 className="font-cormorant text-3xl font-light text-white">My <span className="text-primary italic font-semibold">Shortlist</span></h2>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-20 bg-[#1a1510] border border-white/8">
                  <Heart className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="font-cormorant text-2xl text-white/40 mb-2">No Saved Items</p>
                  <p className="font-manrope text-sm text-white/25 mb-6">Heart venues and vendors to save them here for easy comparison.</p>
                  <div className="flex justify-center gap-4">
                    <Link href="/venues"><button className="px-5 py-2.5 border border-primary/40 text-primary font-cinzel text-[9px] tracking-widest uppercase hover:bg-primary hover:text-black transition-all">Browse Venues</button></Link>
                    <Link href="/vendors"><button className="px-5 py-2.5 border border-white/15 text-white/50 font-cinzel text-[9px] tracking-widest uppercase hover:border-primary/40 hover:text-primary transition-all">Browse Vendors</button></Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {venueItems.length > 0 && (
                    <div>
                      <p className="font-cinzel text-[9px] tracking-[0.3em] text-white/30 uppercase mb-3">Saved Venues ({venueItems.length})</p>
                      <div className="space-y-2">
                        {venueItems.map(item => (
                          <div key={item.id} className="flex items-center justify-between bg-[#1a1510] border border-white/8 px-5 py-4 hover:border-primary/20 transition-colors">
                            <div className="flex items-center gap-3">
                              <Building2 className="w-4 h-4 text-primary/50 shrink-0" />
                              <div>
                                <p className="font-manrope text-sm text-white/80">{item.name}</p>
                                {item.city && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3 text-primary/30" />
                                    <span className="font-cinzel text-[8px] tracking-wider text-white/30 uppercase">{item.city}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Link href="/venues">
                                <button className="font-cinzel text-[9px] tracking-[0.15em] uppercase text-primary/60 hover:text-primary transition-colors">View</button>
                              </Link>
                              <button onClick={() => remove(item.id)} className="font-cinzel text-[9px] tracking-[0.15em] uppercase text-white/20 hover:text-red-400 transition-colors">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {vendorItems.length > 0 && (
                    <div>
                      <p className="font-cinzel text-[9px] tracking-[0.3em] text-white/30 uppercase mb-3">Saved Vendors ({vendorItems.length})</p>
                      <div className="space-y-2">
                        {vendorItems.map(item => (
                          <div key={item.id} className="flex items-center justify-between bg-[#1a1510] border border-white/8 px-5 py-4 hover:border-primary/20 transition-colors">
                            <div className="flex items-center gap-3">
                              <Briefcase className="w-4 h-4 text-primary/50 shrink-0" />
                              <div>
                                <p className="font-manrope text-sm text-white/80">{item.name}</p>
                                {item.category && (
                                  <span className="font-cinzel text-[8px] tracking-wider text-primary/40 uppercase">{item.category}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Link href="/vendors">
                                <button className="font-cinzel text-[9px] tracking-[0.15em] uppercase text-primary/60 hover:text-primary transition-colors">View</button>
                              </Link>
                              <button onClick={() => remove(item.id)} className="font-cinzel text-[9px] tracking-[0.15em] uppercase text-white/20 hover:text-red-400 transition-colors">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
