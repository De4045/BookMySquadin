import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, MessageSquare, Users, LogOut, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

interface Stats {
  totalUsers: number;
  breakdown: { admins: number; vendors: number; venues: number; customers: number };
  totalVenues: number;
  totalVendors: number;
  cities: number;
}
interface Enquiry {
  id: number; type: string; name: string; email: string;
  phone: string; businessName?: string; category?: string;
  city?: string; message: string; createdAt: string;
}
interface VenueEnquiry {
  id: number; name: string; email: string; phone: string;
  venueName?: string; eventDate?: string; message: string;
  status: string; createdAt: string;
}
interface User { id: number; name: string; email: string; role: string; createdAt: string; }

const ROLE_COLOR: Record<string, string> = {
  admin: "text-red-400 bg-red-400/10 border-red-400/30",
  vendor: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  venue: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  user: "text-green-400 bg-green-400/10 border-green-400/30",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="bg-[#1a1510] border border-white/8 p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: accent || "#d4af37" }} />
      <div className="font-cinzel text-[9px] tracking-[0.25em] text-white/35 uppercase mb-3">{label}</div>
      <div className="font-cormorant text-4xl text-primary font-semibold mb-1">{value}</div>
      {sub && <div className="font-manrope text-xs text-white/30">{sub}</div>}
    </div>
  );
}

export default function AdminPortal() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"overview" | "enquiries" | "users">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [venueEnquiries, setVenueEnquiries] = useState<VenueEnquiry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [enquiryFilter, setEnquiryFilter] = useState("all");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "admin") { navigate("/portal/profile"); return; }
    void fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, enqRes, venueEnqRes, usersRes] = await Promise.all([
        fetch(`${BASE}/api/admin/stats`, { credentials: "include" }),
        fetch(`${BASE}/api/enquiries`, { credentials: "include" }),
        fetch(`${BASE}/api/venues/enquiries`, { credentials: "include" }),
        fetch(`${BASE}/api/admin/users`, { credentials: "include" }),
      ]);
      if (statsRes.ok)    setStats(await statsRes.json() as Stats);
      if (enqRes.ok)      setEnquiries((await enqRes.json() as { enquiries: Enquiry[] }).enquiries);
      if (venueEnqRes.ok) setVenueEnquiries((await venueEnqRes.json() as { enquiries: VenueEnquiry[] }).enquiries);
      if (usersRes.ok)    setUsers((await usersRes.json() as { users: User[] }).users);
    } finally {
      setLoading(false);
    }
  };

  const allEnquiries = [
    ...enquiries.map(e => ({ ...e, source: "general" })),
    ...venueEnquiries.map(e => ({ id: e.id, type: "venue", name: e.name, email: e.email, phone: e.phone, message: e.message, createdAt: e.createdAt, category: e.venueName, city: undefined, businessName: undefined, source: "venue" })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredEnquiries = enquiryFilter === "all" ? allEnquiries : allEnquiries.filter(e => e.type === enquiryFilter);

  const TABS = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "enquiries", label: `Enquiries (${allEnquiries.length})`, icon: MessageSquare },
    { key: "users", label: `Users (${users.length})`, icon: Users },
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
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span className="font-cinzel text-[9px] tracking-[0.2em] text-red-400/80 uppercase">Admin Portal</span>
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

          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-8">
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-2">✦ Platform Overview ✦</p>
                <h2 className="font-cormorant text-4xl font-light text-white">Admin <span className="text-primary italic font-semibold">Dashboard</span></h2>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatCard label="Registered Users" value={stats?.totalUsers ?? "—"} sub={`${stats?.breakdown.vendors ?? 0} vendors · ${stats?.breakdown.venues ?? 0} venues`} accent="#d4af37" />
                <StatCard label="Total Venues" value={stats?.totalVenues ?? 436} sub="Across India" accent="#4a90e2" />
                <StatCard label="Total Vendors" value={stats?.totalVendors ?? 255} sub="Verified professionals" accent="#50e3c2" />
                <StatCard label="All Enquiries" value={allEnquiries.length} sub="Lifetime" accent="#e8a4c8" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Breakdown */}
                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/50 uppercase mb-5">User Breakdown</p>
                  <div className="space-y-4">
                    {stats && Object.entries(stats.breakdown).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`font-cinzel text-[9px] uppercase tracking-wider px-2 py-0.5 border rounded-sm ${ROLE_COLOR[role] ?? "text-white/40"}`}>{role}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary/60 rounded-full" style={{ width: `${stats.totalUsers ? (count / stats.totalUsers) * 100 : 0}%` }} />
                          </div>
                          <span className="font-cormorant text-lg text-white font-semibold w-6 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Enquiries */}
                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/50 uppercase mb-5">Recent Enquiries</p>
                  {allEnquiries.length === 0 ? (
                    <p className="font-manrope text-sm text-white/30 text-center py-6">No enquiries yet</p>
                  ) : (
                    <div className="space-y-3">
                      {allEnquiries.slice(0, 5).map(e => (
                        <div key={`${e.source}-${e.id}`} className="flex items-center justify-between py-2 border-b border-white/5">
                          <div>
                            <p className="font-manrope text-sm text-white/80">{e.name}</p>
                            <p className="font-cinzel text-[8px] text-primary/50 uppercase tracking-wider">{e.type}</p>
                          </div>
                          <span className="font-manrope text-[11px] text-white/30">{fmt(e.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setTab("enquiries")} className="mt-4 font-cinzel text-[9px] tracking-[0.2em] text-primary/60 uppercase hover:text-primary transition-colors">
                    View All →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ENQUIRIES TAB */}
          {tab === "enquiries" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ All Enquiries ✦</p>
                  <h2 className="font-cormorant text-3xl font-light text-white">Enquiry <span className="text-primary italic font-semibold">Inbox</span></h2>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["all", "venue", "vendor", "contact", "listing"].map(f => (
                    <button key={f} onClick={() => setEnquiryFilter(f)}
                      className={`px-3 py-1.5 font-cinzel text-[9px] tracking-[0.15em] uppercase border rounded-sm transition-all ${
                        enquiryFilter === f ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-white/40 hover:border-primary/30"
                      }`}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="bg-[#1a1510] border border-white/8 overflow-hidden">
                {filteredEnquiries.length === 0 ? (
                  <div className="text-center py-16">
                    <MessageSquare className="w-10 h-10 text-white/15 mx-auto mb-3" />
                    <p className="font-manrope text-sm text-white/30">No enquiries found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/8">
                          {["#", "Type", "Name", "Email", "Phone", "Date", "Detail"].map(h => (
                            <th key={h} className="py-3 px-4 font-cinzel text-[8px] tracking-[0.2em] text-white/30 uppercase text-left whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEnquiries.map((e, i) => (
                          <tr key={`${e.source ?? ""}-${e.id}`} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
                            <td className="py-3 px-4 font-mono text-xs text-white/30">{e.id}</td>
                            <td className="py-3 px-4">
                              <span className={`font-cinzel text-[8px] uppercase tracking-wider px-2 py-0.5 border rounded-sm ${
                                e.type === "venue" ? "text-blue-400 border-blue-400/30 bg-blue-400/10" :
                                e.type === "vendor" ? "text-primary border-primary/30 bg-primary/10" :
                                e.type === "listing" ? "text-purple-400 border-purple-400/30 bg-purple-400/10" :
                                "text-white/40 border-white/15 bg-white/5"
                              }`}>{e.type}</span>
                            </td>
                            <td className="py-3 px-4 font-manrope text-sm text-white/75 max-w-[140px] truncate">{e.name}</td>
                            <td className="py-3 px-4 font-manrope text-xs text-white/50 max-w-[160px] truncate">{e.email}</td>
                            <td className="py-3 px-4 font-mono text-xs text-white/50">{e.phone}</td>
                            <td className="py-3 px-4 font-manrope text-xs text-white/40 whitespace-nowrap">{fmt(e.createdAt)}</td>
                            <td className="py-3 px-4 font-manrope text-xs text-white/40 max-w-[200px] truncate" title={e.message}>{e.category || e.businessName || e.message.slice(0, 40) || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* USERS TAB */}
          {tab === "users" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6">
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ Registered Accounts ✦</p>
                <h2 className="font-cormorant text-3xl font-light text-white">User <span className="text-primary italic font-semibold">Management</span></h2>
              </div>

              <div className="bg-[#1a1510] border border-white/8 overflow-hidden">
                {users.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="w-10 h-10 text-white/15 mx-auto mb-3" />
                    <p className="font-manrope text-sm text-white/30">No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/8">
                          {["ID", "Name", "Email", "Role", "Joined"].map(h => (
                            <th key={h} className="py-3 px-4 font-cinzel text-[8px] tracking-[0.2em] text-white/30 uppercase text-left">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={u.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
                            <td className="py-3 px-4 font-mono text-xs text-white/30">{u.id}</td>
                            <td className="py-3 px-4 font-manrope text-sm text-white/80">{u.name}</td>
                            <td className="py-3 px-4 font-manrope text-xs text-white/50">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className={`font-cinzel text-[8px] uppercase tracking-wider px-2 py-0.5 border rounded-sm ${ROLE_COLOR[u.role] ?? "text-white/40 border-white/15"}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-manrope text-xs text-white/40">{fmt(u.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
