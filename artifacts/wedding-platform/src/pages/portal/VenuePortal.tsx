import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, MessageSquare, Building2, LogOut, ExternalLink, RefreshCw, ChevronRight, CheckCircle2, Users, Bed } from "lucide-react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

interface VenueEnquiry {
  id: number; name: string; email: string; phone: string;
  venueName?: string; eventDate?: string; message: string;
  status: string; createdAt: string;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function StatCard({ label, value, sub, color = "#d4af37" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-[#1a1510] border border-white/8 p-5 relative overflow-hidden hover:border-primary/20 transition-colors">
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: color }} />
      <div className="font-cinzel text-[9px] tracking-[0.25em] text-white/35 uppercase mb-2">{label}</div>
      <div className="font-cormorant text-3xl font-semibold mb-1" style={{ color }}>{value}</div>
      {sub && <div className="font-manrope text-xs text-white/30">{sub}</div>}
    </div>
  );
}

export default function VenuePortal() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"dashboard" | "enquiries" | "venue">("dashboard");
  const [enquiries, setEnquiries] = useState<VenueEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "venue") { navigate("/portal/profile"); return; }
    void fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${BASE}/api/venues/enquiries`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json() as { enquiries: VenueEnquiry[] };
        setEnquiries(data.enquiries);
      }
    } finally {
      setLoading(false);
    }
  };

  const initials = user ? user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() : "??";

  const TABS = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "enquiries", label: `Enquiries (${enquiries.length})`, icon: MessageSquare },
    { key: "venue", label: "My Venue", icon: Building2 },
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
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-cinzel text-[9px] tracking-[0.2em] text-purple-400/80 uppercase">Venue Portal</span>
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
              <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-2">✦ Welcome Back ✦</p>
                  <h2 className="font-cormorant text-4xl font-light text-white">
                    Hello, <span className="text-primary italic font-semibold">{user?.name.split(" ")[0]}</span>
                  </h2>
                  <p className="font-manrope text-sm text-white/40 mt-2">Manage your venue listing and track booking enquiries.</p>
                </div>
                <div className="w-16 h-16 rounded-sm bg-purple-400/10 border border-purple-400/30 flex items-center justify-center">
                  <span className="font-cinzel text-2xl text-purple-400 font-bold">{initials}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatCard label="Venue Enquiries" value={enquiries.length} sub="Total received" />
                <StatCard label="Profile Views" value="3,824" sub="This month" color="#9b8ae0" />
                <StatCard label="Capacity" value="500+" sub="Banquet guests" color="#50e3c2" />
                <StatCard label="Listing Status" value="Live" sub="Verified & active" color="#4caf50" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/50 uppercase mb-5">Venue Highlights</p>
                  <div className="space-y-3">
                    {[
                      { icon: Users, label: "Max Banquet Capacity", value: "500 guests" },
                      { icon: Bed, label: "Accommodation Rooms", value: "48 rooms" },
                      { icon: Building2, label: "Venue Type", value: "Luxury Hotel" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-white/5">
                        <div className="flex items-center gap-2.5">
                          <item.icon className="w-4 h-4 text-primary/50" />
                          <span className="font-manrope text-sm text-white/50">{item.label}</span>
                        </div>
                        <span className="font-cinzel text-[10px] tracking-[0.1em] text-white/70">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setTab("venue")} className="mt-4 font-cinzel text-[9px] tracking-[0.2em] text-primary/60 uppercase hover:text-primary transition-colors">
                    Edit Details →
                  </button>
                </div>

                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/50 uppercase mb-5">Quick Actions</p>
                  <div className="space-y-2">
                    {[
                      { label: "View My Venue Listing", action: () => navigate("/venues") },
                      { label: "View All Enquiries", action: () => setTab("enquiries") },
                      { label: "Edit Venue Details", action: () => setTab("venue") },
                      { label: "Browse Platform", action: () => navigate("/") },
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
                <h2 className="font-cormorant text-3xl font-light text-white">Venue <span className="text-primary italic font-semibold">Enquiries</span></h2>
              </div>

              <div className="bg-[#1a1510] border border-white/8 overflow-hidden">
                {enquiries.length === 0 ? (
                  <div className="text-center py-20">
                    <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="font-cormorant text-2xl text-white/40 mb-2">No Enquiries Yet</p>
                    <p className="font-manrope text-sm text-white/25">Booking enquiries from couples will appear here when they send a request for your venue.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/8">
                          {["#", "Guest Name", "Email", "Phone", "Event Date", "Venue", "Status", "Received"].map(h => (
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
                            <td className="py-3 px-4 font-manrope text-xs text-white/45">{e.eventDate || "—"}</td>
                            <td className="py-3 px-4 font-manrope text-xs text-white/45 max-w-[120px] truncate">{e.venueName || "—"}</td>
                            <td className="py-3 px-4">
                              <span className={`font-cinzel text-[8px] uppercase tracking-wider px-2 py-0.5 border rounded-sm ${
                                e.status === "new" ? "text-primary border-primary/30 bg-primary/10" : "text-white/40 border-white/15"
                              }`}>{e.status}</span>
                            </td>
                            <td className="py-3 px-4 font-manrope text-xs text-white/40 whitespace-nowrap">{fmt(e.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* MY VENUE TAB */}
          {tab === "venue" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6">
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ Property Details ✦</p>
                <h2 className="font-cormorant text-3xl font-light text-white">My <span className="text-primary italic font-semibold">Venue</span></h2>
              </div>

              <div className="max-w-2xl space-y-4">
                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-sm bg-purple-400/10 border border-purple-400/30 flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-cormorant text-2xl text-white font-semibold">{user?.name}</h3>
                      <p className="font-manrope text-sm text-white/45">{user?.email}</p>
                      <span className="font-cinzel text-[8px] tracking-[0.2em] uppercase text-purple-400 bg-purple-400/10 border border-purple-400/30 px-2 py-0.5 mt-1 inline-block">Venue Manager</span>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    {[
                      { label: "Member Since", value: user ? fmt(user.createdAt) : "—" },
                      { label: "Account Status", value: "Active & Verified" },
                      { label: "Listing Status", value: "Live on Platform" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-white/5">
                        <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/35 uppercase">{item.label}</span>
                        <span className="font-manrope text-sm text-white/65">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-primary/5 border border-primary/15 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <p className="font-manrope text-sm text-white/55 leading-relaxed">
                        Your venue is listed in our directory. To update details, contact our support team at <span className="text-primary">support@bookmysquad.com</span> or call <span className="text-primary">+91 8796318282</span>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/50 uppercase mb-4">View Your Listing</p>
                  <p className="font-manrope text-sm text-white/50 mb-4">See how your venue appears to couples browsing our platform.</p>
                  <Link href="/venues">
                    <button className="w-full py-3 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all gold-glow">
                      Browse Venue Directory →
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
