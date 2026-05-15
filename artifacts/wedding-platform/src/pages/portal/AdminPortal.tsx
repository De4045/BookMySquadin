import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useShortlist } from "@/context/ShortlistContext";
import { LayoutDashboard, MessageSquare, Users, LogOut, ExternalLink, RefreshCw, ShieldCheck, Heart, MapPin, Trash2, Building2, Briefcase, CreditCard, TrendingUp, BadgeCheck, Crown, Zap } from "lucide-react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

interface Stats {
  totalUsers: number;
  breakdown: { admins: number; vendors: number; venues: number; customers: number };
  totalVenues: number;
  totalVendors: number;
  cities: number;
}
interface PaymentStats {
  mrr: number;
  arr: number;
  totalSubscribers: number;
  conversionRate: number;
  totalRevenue: number;
  breakdown: { essential: number; premium: number; member: number; free: number };
  recentTransactions: {
    id: string; name: string; plan: string; amount: number;
    date: string; method: string; status: string;
  }[];
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
interface GstConfig {
  hasApiKey: boolean;
  mode: "live" | "format-only";
  provider: string | null;
  envKey: string;
  optionalEnvKey: string;
}

const ROLE_COLOR: Record<string, string> = {
  admin:  "text-red-400 bg-red-400/10 border-red-400/40",
  vendor: "text-blue-400 bg-blue-400/10 border-blue-400/40",
  venue:  "text-purple-400 bg-purple-400/10 border-purple-400/40",
  user:   "text-green-400 bg-green-400/10 border-green-400/40",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  const color = accent || "#d4af37";
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="relative overflow-hidden cursor-default group"
      style={{
        background: "linear-gradient(145deg, #211a0a 0%, #161005 55%, #100d04 100%)",
        border: `1px solid ${color}30`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 ${color}18`,
      }}
    >
      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${color} 40%, ${color}aa 60%, transparent 100%)` }} />
      {/* Glow orb on hover */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: `${color}22` }} />
      {/* Corner accent */}
      <div className="absolute top-4 right-4 w-6 h-6 opacity-30"
        style={{ borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
      <div className="absolute bottom-4 left-4 w-4 h-4 opacity-20"
        style={{ borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />

      <div className="relative z-10 px-7 pt-7 pb-6">
        <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase mb-5 flex items-center gap-2"
          style={{ color: `${color}cc` }}>
          <div className="w-3 h-px" style={{ backgroundColor: `${color}80` }} />
          {label}
        </div>
        <div
          className="font-cormorant text-5xl font-bold leading-none mb-3"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}aa 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 12px rgba(212,175,55,0.3))",
          }}
        >
          {value}
        </div>
        {sub && (
          <div className="font-manrope text-xs tracking-wide" style={{ color: `${color}70` }}>{sub}</div>
        )}
      </div>
      {/* Bottom fade line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}35, transparent)` }} />
    </motion.div>
  );
}

export default function AdminPortal() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { items: shortlist, remove: removeShortlist } = useShortlist();
  const [tab, setTab] = useState<"overview" | "enquiries" | "users" | "payments" | "saved">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [venueEnquiries, setVenueEnquiries] = useState<VenueEnquiry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [gstConfig, setGstConfig] = useState<GstConfig | null>(null);
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
      const [statsRes, enqRes, venueEnqRes, usersRes, payRes, gstRes] = await Promise.all([
        fetch(`${BASE}/api/admin/stats`, { credentials: "include" }),
        fetch(`${BASE}/api/enquiries`, { credentials: "include" }),
        fetch(`${BASE}/api/venues/enquiries`, { credentials: "include" }),
        fetch(`${BASE}/api/admin/users`, { credentials: "include" }),
        fetch(`${BASE}/api/admin/payments`, { credentials: "include" }),
        fetch(`${BASE}/api/gst/config`, { credentials: "include" }),
      ]);
      if (statsRes.ok)    setStats(await statsRes.json() as Stats);
      if (enqRes.ok)      setEnquiries((await enqRes.json() as { enquiries: Enquiry[] }).enquiries);
      if (venueEnqRes.ok) setVenueEnquiries((await venueEnqRes.json() as { enquiries: VenueEnquiry[] }).enquiries);
      if (usersRes.ok)    setUsers((await usersRes.json() as { users: User[] }).users);
      if (payRes.ok)      setPaymentStats(await payRes.json() as PaymentStats);
      if (gstRes.ok)      setGstConfig(await gstRes.json() as GstConfig);
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
    { key: "overview",  label: "Overview",                          icon: LayoutDashboard },
    { key: "enquiries", label: `Enquiries (${allEnquiries.length})`, icon: MessageSquare },
    { key: "users",     label: `Users (${users.length})`,            icon: Users },
    { key: "payments",  label: "Payments",                           icon: CreditCard },
    { key: "saved",     label: `Saved (${shortlist.length})`,        icon: Heart },
  ] as const;

  if (loading) return (
    <div className="min-h-screen bg-[#080604] flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
        <p className="font-cinzel text-xs tracking-[0.3em] text-white/60 uppercase">Loading portal…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080604]/98 backdrop-blur-xl border-b border-white/12 flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-cormorant text-xl font-semibold">
            <span className="text-primary italic">Book</span> My Squad
          </Link>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span className="font-cinzel text-[10px] tracking-[0.2em] text-red-400 uppercase">Admin Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hidden md:flex items-center gap-1.5 font-cinzel text-[10px] tracking-[0.2em] text-white/50 hover:text-primary uppercase transition-colors">
            <ExternalLink className="w-3 h-3" /> Back to Site
          </Link>
          <div className="w-px h-4 bg-white/20 hidden md:block" />
          <span className="font-cinzel text-[11px] text-white/75 hidden md:block">{user?.name}</span>
          <button onClick={async () => { await logout(); navigate("/"); }}
            className="flex items-center gap-1.5 font-cinzel text-[10px] tracking-[0.15em] uppercase text-white/50 hover:text-red-400 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="pt-14">
        {/* Tab bar */}
        <div className="bg-[#0c0906] border-b border-white/10 px-6 flex gap-0">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key as typeof tab)}
              className={`flex items-center gap-2 px-5 py-4 font-cinzel text-[11px] tracking-[0.18em] uppercase border-b-2 transition-all ${
                tab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-white/50 hover:text-white/80 hover:border-white/20"
              }`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* ────────────────────────── OVERVIEW TAB ────────────────────────── */}
          {tab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-10">
                <p className="font-cinzel text-[11px] tracking-[0.4em] text-primary/90 uppercase mb-2">✦ Platform Overview ✦</p>
                <h2 className="font-cormorant text-5xl font-light text-white"
                  style={{ textShadow: "0 0 40px rgba(212,175,55,0.15)" }}>
                  Admin <span className="text-primary italic font-semibold">Dashboard</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Registered Users" value={stats?.totalUsers ?? "—"} sub={`${stats?.breakdown.vendors ?? 0} vendors · ${stats?.breakdown.venues ?? 0} venues`} accent="#d4af37" />
                <StatCard label="Total Venues" value={stats?.totalVenues ?? 436} sub="Across India" accent="#4a90e2" />
                <StatCard label="Total Vendors" value={stats?.totalVendors ?? 255} accent="#50e3c2" />
                <StatCard label="All Enquiries" value={allEnquiries.length} sub="Lifetime" accent="#e8a4c8" />
              </div>

              {/* ── GST Integration Status ──────────────────────────────────── */}
              {gstConfig && (
                <div className={`relative overflow-hidden mb-8 border rounded-sm ${
                  gstConfig.mode === "live"
                    ? "border-green-500/30 bg-green-500/6"
                    : "border-primary/25 bg-primary/6"
                }`}>
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${
                    gstConfig.mode === "live" ? "via-green-400/70" : "via-primary/70"
                  } to-transparent`} />

                  {gstConfig.mode === "live" ? (
                    <div className="px-6 py-4 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-500/15 border border-green-500/35 flex items-center justify-center shrink-0">
                        <BadgeCheck className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-green-400/90 mb-0.5">GST Verification — Live Mode</p>
                        <p className="font-manrope text-sm text-white/75">
                          Masters India API connected. Live Active / Suspended / Cancelled status checks are enabled for all vendor registrations.
                        </p>
                      </div>
                      <span className="shrink-0 font-cinzel text-[9px] tracking-[0.2em] uppercase text-green-400/90 border border-green-500/35 bg-green-500/12 px-3 py-1.5 rounded-sm">
                        Connected ✓
                      </span>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/35 flex items-center justify-center shrink-0">
                            <Zap className="w-5 h-5 text-primary/90" />
                          </div>
                          <div>
                            <p className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-primary/80 mb-0.5">GST Integration · Action Required</p>
                            <p className="font-cormorant text-2xl text-white font-semibold leading-tight">
                              Upgrade to Live Status Verification
                            </p>
                          </div>
                        </div>
                        <span className="font-cinzel text-[9px] tracking-[0.15em] uppercase text-yellow-400/90 border border-yellow-500/40 bg-yellow-500/12 px-3 py-1.5 rounded-sm shrink-0">
                          Format-Only Mode
                        </span>
                      </div>

                      <p className="font-manrope text-sm text-white/60 leading-relaxed mb-6">
                        Vendor GSTINs are currently verified by structural format only — state and entity type are extracted,
                        but live <strong className="text-white/80">Active / Suspended / Cancelled</strong> status from the government
                        database requires a Masters India API key. Set it up in 4 steps:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                        {[
                          { n: "1", title: "Create Account",   body: "Sign up free at mastersindia.co/developer — includes 100 free API calls per month." },
                          { n: "2", title: "Copy API Key",     body: "In the developer dashboard, copy your Bearer token (API key) from the credentials section." },
                          { n: "3", title: "Add to Secrets",   body: `In Replit → Secrets tab, add: MASTERS_INDIA_API_KEY = your Bearer token.` },
                          { n: "4", title: "Restart Server",   body: "Restart the API Server workflow. This card will turn green once the key is detected." },
                        ].map(({ n, title, body }) => (
                          <div key={n} className="p-4 bg-black/30 border border-white/8 rounded-sm">
                            <div className="font-cormorant text-4xl font-bold mb-2 leading-none" style={{ color: "#d4af3740" }}>{n}</div>
                            <p className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-white/70 mb-1.5">{title}</p>
                            <p className="font-manrope text-xs text-white/45 leading-snug">{body}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 flex-wrap">
                        <a href="https://mastersindia.co/developer" target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-[#080604] font-cinzel text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-primary/90 transition-colors">
                          <ExternalLink className="w-3 h-3" />
                          Get Free API Key
                        </a>
                        <div className="flex items-center gap-2 font-mono text-xs text-primary/70 bg-primary/8 border border-primary/20 px-3 py-2 rounded-sm">
                          <span className="text-white/30">secret:</span>
                          <span className="text-primary select-all">{gstConfig.envKey}</span>
                        </div>
                        <span className="font-manrope text-xs text-white/40">
                          Optional: <span className="text-white/55 font-mono">{gstConfig.optionalEnvKey}</span> (Client ID)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Breakdown */}
                <div className="bg-[#1e1a0e] border border-white/10 p-6">
                  <p className="font-cinzel text-[11px] tracking-[0.3em] text-primary/90 uppercase mb-6">User Breakdown</p>
                  <div className="space-y-5">
                    {stats && Object.entries(stats.breakdown).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`font-cinzel text-[10px] uppercase tracking-wider px-2.5 py-1 border rounded-sm ${ROLE_COLOR[role] ?? "text-white/55"}`}>{role}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-36 h-2 bg-white/12 rounded-full overflow-hidden">
                            <div className="h-full bg-primary/70 rounded-full" style={{ width: `${stats.totalUsers ? (count / stats.totalUsers) * 100 : 0}%` }} />
                          </div>
                          <span className="font-cormorant text-xl text-white font-semibold w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Enquiries */}
                <div className="bg-[#1e1a0e] border border-white/10 p-6">
                  <p className="font-cinzel text-[11px] tracking-[0.3em] text-primary/90 uppercase mb-6">Recent Enquiries</p>
                  {allEnquiries.length === 0 ? (
                    <p className="font-manrope text-sm text-white/50 text-center py-6">No enquiries yet</p>
                  ) : (
                    <div className="space-y-2">
                      {allEnquiries.slice(0, 5).map(e => (
                        <div key={`${e.source}-${e.id}`} className="flex items-center justify-between py-2.5 border-b border-white/8">
                          <div>
                            <p className="font-manrope text-sm text-white/92 font-medium">{e.name}</p>
                            <p className="font-cinzel text-[9px] text-primary/80 uppercase tracking-wider mt-0.5">{e.type}</p>
                          </div>
                          <span className="font-manrope text-xs text-white/55">{fmt(e.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setTab("enquiries")} className="mt-5 font-cinzel text-[10px] tracking-[0.2em] text-primary/80 uppercase hover:text-primary transition-colors">
                    View All →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ────────────────────────── ENQUIRIES TAB ────────────────────────── */}
          {tab === "enquiries" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-cinzel text-[11px] tracking-[0.4em] text-primary/90 uppercase mb-2">✦ All Enquiries ✦</p>
                  <h2 className="font-cormorant text-4xl font-light text-white"
                    style={{ textShadow: "0 0 30px rgba(212,175,55,0.12)" }}>
                    Enquiry <span className="text-primary italic font-semibold">Inbox</span>
                  </h2>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["all", "venue", "vendor", "contact", "listing"].map(f => (
                    <button key={f} onClick={() => setEnquiryFilter(f)}
                      className={`px-4 py-1.5 font-cinzel text-[10px] tracking-[0.15em] uppercase border rounded-sm transition-all ${
                        enquiryFilter === f
                          ? "border-primary bg-primary/12 text-primary"
                          : "border-white/15 text-white/55 hover:border-primary/40 hover:text-white/80"
                      }`}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="bg-[#1e1a0e] border border-white/10 overflow-hidden">
                {filteredEnquiries.length === 0 ? (
                  <div className="text-center py-16">
                    <MessageSquare className="w-10 h-10 text-white/25 mx-auto mb-3" />
                    <p className="font-manrope text-base text-white/50">No enquiries found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-black/20">
                          {["#", "Type", "Name", "Email", "Phone", "Date", "Detail"].map(h => (
                            <th key={h} className="py-4 px-5 font-cinzel text-[10px] tracking-[0.2em] text-white/65 uppercase text-left whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEnquiries.map((e, i) => (
                          <tr key={`${e.source ?? ""}-${e.id}`} className={`border-b border-white/6 hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}>
                            <td className="py-3.5 px-5 font-mono text-xs text-white/45">{e.id}</td>
                            <td className="py-3.5 px-5">
                              <span className={`font-cinzel text-[9px] uppercase tracking-wider px-2.5 py-1 border rounded-sm ${
                                e.type === "venue"   ? "text-blue-400 border-blue-400/40 bg-blue-400/12" :
                                e.type === "vendor"  ? "text-primary border-primary/40 bg-primary/12" :
                                e.type === "listing" ? "text-purple-400 border-purple-400/40 bg-purple-400/12" :
                                "text-white/60 border-white/20 bg-white/6"
                              }`}>{e.type}</span>
                            </td>
                            <td className="py-3.5 px-5 font-manrope text-sm text-white/92 font-medium max-w-[140px] truncate">{e.name}</td>
                            <td className="py-3.5 px-5 font-manrope text-sm text-white/65 max-w-[170px] truncate">{e.email}</td>
                            <td className="py-3.5 px-5 font-mono text-sm text-white/65">{e.phone}</td>
                            <td className="py-3.5 px-5 font-manrope text-xs text-white/60 whitespace-nowrap">{fmt(e.createdAt)}</td>
                            <td className="py-3.5 px-5 font-manrope text-sm text-white/55 max-w-[200px] truncate" title={e.message}>{e.category || e.businessName || e.message.slice(0, 40) || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ────────────────────────── USERS TAB ────────────────────────── */}
          {tab === "users" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-8">
                <p className="font-cinzel text-[11px] tracking-[0.4em] text-primary/90 uppercase mb-2">✦ Registered Accounts ✦</p>
                <h2 className="font-cormorant text-4xl font-light text-white"
                  style={{ textShadow: "0 0 30px rgba(212,175,55,0.12)" }}>
                  User <span className="text-primary italic font-semibold">Management</span>
                </h2>
              </div>

              <div className="bg-[#1e1a0e] border border-white/10 overflow-hidden">
                {users.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="w-10 h-10 text-white/25 mx-auto mb-3" />
                    <p className="font-manrope text-base text-white/50">No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-black/20">
                          {["ID", "Name", "Email", "Role", "Joined"].map(h => (
                            <th key={h} className="py-4 px-5 font-cinzel text-[10px] tracking-[0.2em] text-white/65 uppercase text-left">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={u.id} className={`border-b border-white/6 hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}>
                            <td className="py-3.5 px-5 font-mono text-xs text-white/45">{u.id}</td>
                            <td className="py-3.5 px-5 font-manrope text-sm text-white/92 font-medium">{u.name}</td>
                            <td className="py-3.5 px-5 font-manrope text-sm text-white/65">{u.email}</td>
                            <td className="py-3.5 px-5">
                              <span className={`font-cinzel text-[9px] uppercase tracking-wider px-2.5 py-1 border rounded-sm ${ROLE_COLOR[u.role] ?? "text-white/55 border-white/20"}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 font-manrope text-sm text-white/60">{fmt(u.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ────────────────────────── PAYMENTS TAB ────────────────────────── */}
          {tab === "payments" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-10">
                <p className="font-cinzel text-[11px] tracking-[0.4em] text-primary/90 uppercase mb-2">✦ Revenue Overview ✦</p>
                <h2 className="font-cormorant text-5xl font-light text-white"
                  style={{ textShadow: "0 0 40px rgba(212,175,55,0.15)" }}>
                  Platform <span className="text-primary italic font-semibold">Payments</span>
                </h2>
                <p className="font-manrope text-sm text-white/65 mt-3">Live subscription and billing summary across all accounts.</p>
              </div>

              {/* Revenue stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                  { label: "Monthly Recurring Revenue", value: paymentStats ? `₹${(paymentStats.mrr).toLocaleString("en-IN")}` : "—", accent: "#d4af37", sub: "MRR", icon: TrendingUp },
                  { label: "Annual Run Rate",            value: paymentStats ? `₹${(paymentStats.arr).toLocaleString("en-IN")}` : "—", accent: "#50e3c2", sub: "ARR",  icon: CreditCard },
                  { label: "Active Subscribers",         value: paymentStats?.totalSubscribers ?? "—", accent: "#9b8ae0", sub: "Paid plans", icon: BadgeCheck },
                  { label: "Conversion Rate",            value: paymentStats ? `${paymentStats.conversionRate}%` : "—", accent: "#f5a623", sub: "Free → Paid", icon: Crown },
                ].map(c => {
                  const Icon = c.icon;
                  return (
                    <div key={c.label} className="relative overflow-hidden border transition-all group hover:-translate-y-1"
                      style={{
                        background: "linear-gradient(145deg, #211a0a 0%, #100d04 100%)",
                        borderColor: `${c.accent}30`,
                        boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 ${c.accent}15`,
                      }}>
                      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)` }} />
                      {/* Glow on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `radial-gradient(ellipse at top right, ${c.accent}0a 0%, transparent 70%)` }} />
                      <div className="p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-cinzel text-[10px] tracking-[0.25em] uppercase leading-tight" style={{ color: `${c.accent}dd` }}>{c.label}</span>
                          <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
                            style={{ background: `${c.accent}12`, border: `1px solid ${c.accent}25` }}>
                            <Icon className="w-4 h-4" style={{ color: `${c.accent}cc` }} />
                          </div>
                        </div>
                        <div className="font-cormorant text-5xl font-bold leading-none mb-2"
                          style={{
                            color: c.accent,
                            filter: `drop-shadow(0 2px 12px ${c.accent}50)`,
                          }}>{c.value}</div>
                        <div className="font-manrope text-xs font-medium" style={{ color: `${c.accent}70` }}>{c.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {/* Plan breakdown */}
                <div className="bg-[#1e1a0e] border border-white/10 p-6">
                  <p className="font-cinzel text-[11px] tracking-[0.3em] text-primary/90 uppercase mb-6">Subscription Breakdown</p>
                  <div className="space-y-5">
                    {paymentStats && [
                      { label: "Premium",   count: paymentStats.breakdown.premium,   icon: Crown,      color: "#c0a0ff" },
                      { label: "Essential", count: paymentStats.breakdown.essential, icon: BadgeCheck,  color: "#d4af37" },
                      { label: "Member",    count: paymentStats.breakdown.member,    icon: Zap,         color: "#50e3c2" },
                      { label: "Free",      count: paymentStats.breakdown.free,      icon: Users,       color: "#ffffff50" },
                    ].map(row => {
                      const total = Object.values(paymentStats.breakdown).reduce((a, b) => a + b, 0);
                      const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
                      const Icon = row.icon;
                      return (
                        <div key={row.label} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
                            style={{ background: `${row.color}12`, border: `1px solid ${row.color}28` }}>
                            <Icon className="w-3.5 h-3.5" style={{ color: row.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-cinzel text-[10px] tracking-wider uppercase font-medium" style={{ color: row.color }}>{row.label}</span>
                              <span className="font-cormorant text-base font-bold" style={{ color: row.color }}>{row.count}</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: row.color }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Revenue summary */}
                <div className="lg:col-span-2 bg-[#1e1a0e] border border-white/10 p-6">
                  <p className="font-cinzel text-[11px] tracking-[0.3em] text-primary/90 uppercase mb-6">Revenue by Plan Type</p>
                  <div className="space-y-1">
                    {[
                      { plan: "Premium Annual",    count: 2, amount: 119998, color: "#c0a0ff" },
                      { plan: "Premium Monthly",   count: 1, amount: 5999,   color: "#9b8ae0" },
                      { plan: "Essential Monthly", count: 3, amount: 8997,   color: "#d4af37" },
                      { plan: "Member Monthly",    count: 2, amount: 998,    color: "#50e3c2" },
                    ].map(row => (
                      <div key={row.plan} className="flex items-center justify-between py-3.5 border-b border-white/8">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                          <span className="font-manrope text-sm text-white/85 font-medium">{row.plan}</span>
                          <span className="font-cinzel text-[9px] tracking-wider text-white/40 uppercase">{row.count} subscriber{row.count !== 1 ? "s" : ""}</span>
                        </div>
                        <span className="font-cormorant text-xl font-bold" style={{ color: row.color }}>
                          ₹{row.amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between py-4">
                      <span className="font-cinzel text-[11px] tracking-[0.2em] uppercase text-primary font-medium">Total Revenue (Month)</span>
                      <span className="font-cormorant text-3xl font-bold text-primary" style={{ filter: "drop-shadow(0 2px 12px rgba(212,175,55,0.4))" }}>₹1,35,992</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent transactions */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: "#d4af3715", border: "1px solid #d4af3730" }}>
                    <CreditCard className="w-4 h-4 text-primary/80" />
                  </div>
                  <p className="font-cinzel text-[11px] tracking-[0.3em] text-primary/90 uppercase">Recent Transactions</p>
                </div>
                <div className="bg-[#1e1a0e] border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-black/20">
                          {["Transaction ID", "Customer", "Plan", "Amount", "Method", "Date", "Status"].map(h => (
                            <th key={h} className="py-4 px-5 font-cinzel text-[10px] tracking-[0.2em] text-white/65 uppercase text-left whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(paymentStats?.recentTransactions ?? []).map((t, i) => (
                          <tr key={t.id} className={`border-b border-white/6 hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}>
                            <td className="py-4 px-5 font-mono text-sm text-primary/80 font-medium">{t.id}</td>
                            <td className="py-4 px-5 font-manrope text-sm text-white/92 font-medium">{t.name}</td>
                            <td className="py-4 px-5 font-manrope text-sm text-white/70">{t.plan}</td>
                            <td className="py-4 px-5 font-cormorant text-lg text-white font-bold">₹{t.amount.toLocaleString("en-IN")}</td>
                            <td className="py-4 px-5 font-manrope text-sm text-white/60">{t.method}</td>
                            <td className="py-4 px-5 font-manrope text-sm text-white/60 whitespace-nowrap">{t.date}</td>
                            <td className="py-4 px-5">
                              <span className={`font-cinzel text-[9px] uppercase tracking-wider px-2.5 py-1 border rounded-sm font-medium ${
                                t.status === "success"  ? "text-green-400 border-green-400/40 bg-green-400/12" :
                                t.status === "pending"  ? "text-yellow-400 border-yellow-400/40 bg-yellow-400/12" :
                                t.status === "failed"   ? "text-red-400 border-red-400/40 bg-red-400/12" :
                                t.status === "refunded" ? "text-blue-400 border-blue-400/40 bg-blue-400/12" :
                                "text-white/55 border-white/20 bg-white/6"
                              }`}>
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ────────────────────────── SAVED TAB ────────────────────────── */}
          {tab === "saved" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-cinzel text-[11px] tracking-[0.4em] text-primary/90 uppercase mb-2">✦ Your Collection ✦</p>
                  <h2 className="font-cormorant text-4xl font-light text-white"
                    style={{ textShadow: "0 0 30px rgba(212,175,55,0.12)" }}>
                    Saved <span className="text-primary italic font-semibold">Favourites</span>
                  </h2>
                </div>
                <Link href="/portal/saved">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-white/15 hover:border-primary/40 font-cinzel text-[10px] tracking-[0.2em] uppercase text-white/55 hover:text-primary transition-all">
                    Full View →
                  </button>
                </Link>
              </div>

              {shortlist.length === 0 ? (
                <div className="text-center py-20 bg-[#1e1a0e] border border-white/10">
                  <Heart className="w-12 h-12 text-white/15 mx-auto mb-4" />
                  <p className="font-cormorant text-2xl text-white/55 mb-2">No Saved Items</p>
                  <p className="font-manrope text-sm text-white/40 mb-6">Browse vendors and venues and tap the heart icon to save them here.</p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/vendors"><button className="px-5 py-2.5 bg-primary text-black font-cinzel text-[9px] tracking-widest uppercase font-bold hover:bg-primary/90 transition-all">Browse Vendors</button></Link>
                    <Link href="/venues"><button className="px-5 py-2.5 border border-primary/40 text-primary font-cinzel text-[9px] tracking-widest uppercase font-bold hover:bg-primary/10 transition-all">Browse Venues</button></Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shortlist.map(item => {
                    const Icon = item.type === "venue" ? Building2 : Briefcase;
                    const accent = item.type === "venue" ? "#9b8ae0" : "#d4af37";
                    return (
                      <div key={item.id} className="group relative bg-[#1e1a0e] border border-white/10 hover:border-primary/30 transition-all p-5">
                        <div className="absolute top-0 left-0 right-0 h-[2px]"
                          style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }} />
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-sm flex items-center justify-center"
                            style={{ background: `${accent}12`, border: `1px solid ${accent}28` }}>
                            <Icon className="w-4 h-4" style={{ color: accent }} />
                          </div>
                          <button onClick={() => removeShortlist(item.id)}
                            className="p-1.5 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h3 className="font-cormorant text-lg text-white/95 font-semibold leading-snug mb-1">{item.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-cinzel text-[9px] tracking-widest uppercase px-2 py-0.5 border rounded-sm"
                            style={{ color: accent, borderColor: `${accent}35`, background: `${accent}12` }}>{item.type}</span>
                          {item.category && <span className="font-manrope text-xs text-white/50">{item.category}</span>}
                        </div>
                        {item.city && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-primary/50 shrink-0" />
                            <span className="font-manrope text-xs text-white/55">{item.city}</span>
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
