import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useShortlist } from "@/context/ShortlistContext";
import { LayoutDashboard, MessageSquare, User, LogOut, ExternalLink, Briefcase, Star, RefreshCw, ChevronRight, CheckCircle2, Heart, MapPin, Trash2, Building2, CreditCard, CalendarDays } from "lucide-react";
import { PaymentTab } from "./PaymentTab";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

interface Enquiry {
  id: number; type: string; name: string; email: string;
  phone: string; category?: string; city?: string; message: string; createdAt: string;
}

interface Booking {
  id: number; vendorName: string; vendorCategory: string; city: string;
  packageName: string; packagePrice: number; eventDate: string; eventType: string;
  guestCount: number; name: string; email: string; phone: string;
  advancePaid: boolean; advanceAmount: number; status: string; createdAt: string;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function StatCard({ label, value, sub, color = "#d4af37" }: { label: string; value: string | number; sub?: React.ReactNode; color?: string }) {
  return (
    <div className="bg-[#1a1510] border border-white/8 p-5 relative overflow-hidden hover:border-primary/20 transition-colors">
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: color }} />
      <div className="font-cinzel text-[9px] tracking-[0.25em] text-white/35 uppercase mb-2">{label}</div>
      <div className="font-cormorant text-3xl font-semibold mb-1" style={{ color }}>{value}</div>
      {sub && <div className="font-manrope text-xs text-white/30">{sub}</div>}
    </div>
  );
}

export default function VendorPortal() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { items: shortlist, remove: removeShortlist } = useShortlist();
  const [tab, setTab] = useState<"dashboard" | "enquiries" | "bookings" | "profile" | "saved" | "payment">("dashboard");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "vendor") { navigate("/portal/profile"); return; }
    void fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [eRes, bRes] = await Promise.all([
        fetch(`${BASE}/api/enquiries`, { credentials: "include" }),
        fetch(`${BASE}/api/bookings/portal`, { credentials: "include" }),
      ]);
      if (eRes.ok) {
        const data = await eRes.json() as { enquiries: Enquiry[] };
        setEnquiries(data.enquiries.filter(e => e.type === "vendor"));
      }
      if (bRes.ok) {
        const data = await bRes.json() as { bookings: Booking[] };
        setBookings(data.bookings ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  const initials = user ? user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() : "??";

  const TABS = [
    { key: "dashboard", label: "Dashboard",                       icon: LayoutDashboard },
    { key: "enquiries", label: `Enquiries (${enquiries.length})`, icon: MessageSquare },
    { key: "bookings",  label: `Bookings (${bookings.length})`,   icon: CalendarDays },
    { key: "profile",   label: "My Profile",                      icon: User },
    { key: "saved",     label: `Saved (${shortlist.length})`,     icon: Heart },
    { key: "payment",   label: "Subscription",                    icon: CreditCard },
  ] as const;

  if (loading) return (
    <div className="min-h-screen bg-[#080604] flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
        <p className="font-cinzel text-[10px] tracking-[0.3em] text-white/40 uppercase">Loading portal…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080604]/98 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-cormorant text-xl font-semibold">
            <span className="text-primary italic">Book</span> My Squad
          </Link>
          <div className="w-px h-4 bg-white/15" />
          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-cinzel text-[9px] tracking-[0.2em] text-blue-400/80 uppercase">Vendor Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hidden md:flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.2em] text-white/35 hover:text-primary uppercase transition-colors">
            <ExternalLink className="w-3 h-3" /> Back to Site
          </Link>
          <div className="w-px h-4 bg-white/15 hidden md:block" />
          <span className="font-cinzel text-[10px] text-white/60 hidden md:block">{user?.name}</span>
          <button onClick={async () => { await logout(); navigate("/"); }}
            className="flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.15em] uppercase text-white/35 hover:text-red-400 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="pt-14">
        {/* Tab bar */}
        <div className="bg-[#0a0806] border-b border-white/8 px-6 flex gap-0">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key as typeof tab)}
              className={`flex items-center gap-2 px-5 py-4 font-cinzel text-[9px] tracking-[0.2em] uppercase border-b-2 transition-all ${
                tab === key ? "border-primary text-primary" : "border-transparent text-white/35 hover:text-white/60"
              }`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* DASHBOARD TAB */}
          {tab === "dashboard" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {/* Welcome */}
              <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-2">✦ Welcome Back ✦</p>
                  <h2 className="font-cormorant text-4xl font-light text-white">
                    Hello, <span className="text-primary italic font-semibold">{user?.name.split(" ")[0]}</span>
                  </h2>
                  <p className="font-manrope text-sm text-white/40 mt-2">Manage your vendor profile and enquiries from this dashboard.</p>
                </div>
                <div className="w-16 h-16 rounded-sm bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <span className="font-cinzel text-2xl text-primary font-bold">{initials}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatCard label="Enquiries Received" value={enquiries.length} sub="Total lifetime" />
                <StatCard label="Profile Views" value="1,247" sub="This month" color="#50e3c2" />
                <StatCard label="Response Rate" value="96%" sub="30-day average" color="#e8a4c8" />
                <StatCard label="Rating" value="4.8" sub={<><Star className="inline w-3 h-3 text-primary fill-primary mr-0.5" />Excellent</>} color="#f5a623" />
              </div>

              {/* Why BMS + quick actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/50 uppercase mb-5">Getting Started</p>
                  <div className="space-y-4">
                    {[
                      { done: true,  text: "Account created" },
                      { done: true,  text: "Profile set up" },
                      { done: enquiries.length > 0, text: "First enquiry received" },
                      { done: false, text: "Complete your business profile" },
                      { done: false, text: "Add portfolio photos" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? "text-primary" : "text-white/20"}`} />
                        <span className={`font-manrope text-sm ${item.done ? "text-white/70 line-through" : "text-white/50"}`}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/50 uppercase mb-5">Quick Actions</p>
                  <div className="space-y-2">
                    {[
                      { label: "Edit My Profile", action: () => setTab("profile") },
                      { label: "View All Enquiries", action: () => setTab("enquiries") },
                      { label: "Browse Vendor Directory", action: () => navigate("/vendors") },
                      { label: "List Another Service", action: () => navigate("/list-your-business") },
                    ].map((item, i) => (
                      <button key={i} onClick={item.action}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.03] border border-white/8 hover:border-primary/30 hover:bg-primary/5 transition-all group">
                        <span className="font-cinzel text-[10px] tracking-[0.15em] text-white/60 uppercase group-hover:text-primary transition-colors">{item.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ENQUIRIES TAB */}
          {tab === "enquiries" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6">
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ Booking Requests ✦</p>
                <h2 className="font-cormorant text-3xl font-light text-white">Your <span className="text-primary italic font-semibold">Enquiries</span></h2>
              </div>

              <div className="bg-[#1a1510] border border-white/8 overflow-hidden">
                {enquiries.length === 0 ? (
                  <div className="text-center py-20">
                    <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="font-cormorant text-2xl text-white/40 mb-2">No Enquiries Yet</p>
                    <p className="font-manrope text-sm text-white/25">Enquiries from customers will appear here once they contact you through the platform.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/8">
                          {["#", "From", "Email", "Phone", "Date", "Message"].map(h => (
                            <th key={h} className="py-3 px-4 font-cinzel text-[8px] tracking-[0.2em] text-white/30 uppercase text-left whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {enquiries.map((e, i) => (
                          <tr key={e.id} className={`border-b border-white/5 hover:bg-white/[0.02] ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
                            <td className="py-3 px-4 font-mono text-xs text-white/30">{e.id}</td>
                            <td className="py-3 px-4 font-manrope text-sm text-white/80">{e.name}</td>
                            <td className="py-3 px-4 font-manrope text-xs text-white/50">{e.email}</td>
                            <td className="py-3 px-4 font-mono text-xs text-white/50">{e.phone}</td>
                            <td className="py-3 px-4 font-manrope text-xs text-white/40 whitespace-nowrap">{fmt(e.createdAt)}</td>
                            <td className="py-3 px-4 font-manrope text-xs text-white/40 max-w-[200px] truncate" title={e.message}>{e.message || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* PROFILE TAB */}
          {tab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6">
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ Business Profile ✦</p>
                <h2 className="font-cormorant text-3xl font-light text-white">My <span className="text-primary italic font-semibold">Profile</span></h2>
              </div>
              <div className="max-w-2xl space-y-4">
                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-sm bg-primary/15 border border-primary/30 flex items-center justify-center">
                      <span className="font-cinzel text-2xl text-primary font-bold">{initials}</span>
                    </div>
                    <div>
                      <h3 className="font-cormorant text-2xl text-white font-semibold">{user?.name}</h3>
                      <p className="font-manrope text-sm text-white/45">{user?.email}</p>
                      <span className="font-cinzel text-[8px] tracking-[0.2em] uppercase text-blue-400 bg-blue-400/10 border border-blue-400/30 px-2 py-0.5 mt-1 inline-block">Vendor</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Member Since", value: user ? fmt(user.createdAt) : "—" },
                      { label: "Account Status", value: "Active & Verified" },
                      { label: "Platform", value: "Book My Squad Vendor Network" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-white/5">
                        <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/35 uppercase">{item.label}</span>
                        <span className="font-manrope text-sm text-white/65">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/50 uppercase mb-4">List Your Business</p>
                  <p className="font-manrope text-sm text-white/50 mb-4">Get discovered by thousands of couples planning their dream wedding.</p>
                  <Link href="/list-your-business">
                    <button className="w-full py-3 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all gold-glow">
                      Submit Your Listing →
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
          {/* PAYMENT TAB */}
          {tab === "bookings" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-8">
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-2">Platform Overview</p>
                <h2 className="font-cormorant text-3xl text-white font-light">Booking <span className="text-primary italic">Requests</span></h2>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Bookings",  value: bookings.length,                                      color: "#d4af37" },
                  { label: "Pending",         value: bookings.filter(b => b.status === "pending").length,   color: "#f59e0b" },
                  { label: "Advance Paid",    value: bookings.filter(b => b.status === "advance_paid").length, color: "#50e3c2" },
                  { label: "Confirmed",       value: bookings.filter(b => b.status === "confirmed").length, color: "#4ade80" },
                ].map((s, i) => (
                  <div key={i} className="luxury-card p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: s.color }} />
                    <div className="font-cormorant text-3xl font-semibold mb-1" style={{ color: s.color }}>{s.value}</div>
                    <div className="font-cinzel text-[9px] tracking-[0.2em] text-white/40 uppercase">{s.label}</div>
                  </div>
                ))}
              </div>

              {bookings.length === 0 ? (
                <div className="luxury-card p-16 text-center">
                  <CalendarDays className="w-12 h-12 text-white/15 mx-auto mb-4" />
                  <h3 className="font-cormorant text-2xl text-white mb-2">No Bookings Yet</h3>
                  <p className="font-manrope text-white/40 text-sm">Bookings made through your listings will appear here.</p>
                </div>
              ) : (
                <div className="luxury-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
                    <h3 className="font-cinzel text-xs tracking-[0.2em] text-white/60 uppercase">Recent Bookings</h3>
                    <span className="font-manrope text-xs text-white/30">{bookings.length} total</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {bookings.map(b => {
                      const statusColors: Record<string, string> = {
                        pending: "#f59e0b", confirmed: "#4ade80",
                        advance_paid: "#d4af37", completed: "#60a5fa", cancelled: "#f87171",
                      };
                      const sc = statusColors[b.status] ?? "#888";
                      return (
                        <div key={b.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6 hover:bg-white/[0.02] transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-cormorant text-base text-white font-semibold truncate">{b.name}</span>
                              <span className="font-manrope text-[10px] text-white/30 shrink-0">{b.email}</span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-cinzel text-[9px] tracking-[0.15em] text-primary/70 uppercase">{b.vendorName}</span>
                              <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                              <span className="font-manrope text-xs text-white/45">{b.packageName}</span>
                              {b.advancePaid && (
                                <span className="font-cinzel text-[8px] tracking-[0.1em] text-emerald-400/80 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-sm uppercase">Advance Paid</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 shrink-0 text-right">
                            <div>
                              <p className="font-manrope text-xs text-white/35">Event Date</p>
                              <p className="font-manrope text-sm text-white/70">{b.eventDate ? new Date(b.eventDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-manrope text-xs text-white/35">Amount</p>
                              <p className="font-manrope text-sm font-medium" style={{ color: sc }}>₹{b.packagePrice?.toLocaleString("en-IN")}</p>
                            </div>
                            <div className="px-2.5 py-1 rounded-sm font-cinzel text-[8px] tracking-[0.15em] uppercase font-bold border"
                              style={{ color: sc, borderColor: sc + "40", background: sc + "12" }}>
                              {b.status.replace("_", " ")}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {tab === "payment" && <PaymentTab role="vendor" />}

          {/* SAVED TAB */}
          {tab === "saved" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ Your Collection ✦</p>
                  <h2 className="font-cormorant text-3xl font-light text-white">Saved <span className="text-primary italic font-semibold">Favourites</span></h2>
                </div>
                <Link href="/portal/saved">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-white/10 hover:border-primary/30 font-cinzel text-[9px] tracking-[0.2em] uppercase text-white/40 hover:text-primary transition-all">
                    Full View →
                  </button>
                </Link>
              </div>

              {shortlist.length === 0 ? (
                <div className="text-center py-20 bg-[#1a1510] border border-white/8">
                  <Heart className="w-10 h-10 text-white/10 mx-auto mb-4" />
                  <p className="font-cormorant text-2xl text-white/40 mb-2">No Saved Items</p>
                  <p className="font-manrope text-sm text-white/25 mb-6">Browse vendors and venues and tap the heart icon to save them here.</p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/vendors"><button className="px-5 py-2.5 bg-primary text-black font-cinzel text-[9px] tracking-widest uppercase font-bold hover:bg-primary/90 transition-all">Browse Vendors</button></Link>
                    <Link href="/venues"><button className="px-5 py-2.5 border border-primary/30 text-primary font-cinzel text-[9px] tracking-widest uppercase font-bold hover:bg-primary/8 transition-all">Browse Venues</button></Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shortlist.map(item => {
                    const Icon = item.type === "venue" ? Building2 : Briefcase;
                    const accent = item.type === "venue" ? "#9b8ae0" : "#d4af37";
                    return (
                      <div key={item.id} className="group relative bg-[#1a1510] border border-white/8 hover:border-primary/25 transition-all p-5">
                        <div className="absolute top-0 left-0 right-0 h-[2px]"
                          style={{ background: `linear-gradient(90deg, transparent, ${accent}50, transparent)` }} />
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-sm flex items-center justify-center"
                            style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}>
                            <Icon className="w-4 h-4" style={{ color: accent }} />
                          </div>
                          <button onClick={() => removeShortlist(item.id)}
                            className="p-1.5 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h3 className="font-cormorant text-lg text-white font-semibold leading-snug mb-1">{item.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-cinzel text-[8px] tracking-widest uppercase px-1.5 py-0.5 border rounded-sm"
                            style={{ color: accent, borderColor: `${accent}30`, background: `${accent}10` }}>{item.type}</span>
                          {item.category && <span className="font-manrope text-[11px] text-white/35">{item.category}</span>}
                        </div>
                        {item.city && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-primary/35 shrink-0" />
                            <span className="font-manrope text-xs text-white/40">{item.city}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
