import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useShortlist } from "@/context/ShortlistContext";
import {
  LayoutDashboard, MessageSquare, Users, LogOut, ExternalLink, RefreshCw,
  ShieldCheck, Heart, MapPin, Trash2, Building2, Briefcase, CreditCard,
  TrendingUp, BadgeCheck, Crown, Zap, Download, CalendarCheck2,
  Clock, CheckCircle2, XCircle, ChevronDown, Newspaper, FileText, X as XIc, Plus,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

interface Stats {
  totalUsers: number;
  breakdown: { admins: number; vendors: number; venues: number; customers: number };
  totalVenues: number;
  totalVendors: number;
  cities: number;
}
interface PaymentStats {
  mrr: number; arr: number; totalSubscribers: number; conversionRate: number; totalRevenue: number;
  breakdown: { essential: number; premium: number; member: number; free: number };
  recentTransactions: { id: string; name: string; plan: string; amount: number; date: string; method: string; status: string; }[];
}
interface Enquiry {
  id: number; type: string; name: string; email: string;
  phone: string; businessName?: string; category?: string;
  city?: string; message: string; createdAt: string;
}
interface VenueEnquiry {
  id: number; name: string; email: string; phone: string;
  venueName?: string; eventDate?: string; message: string; status: string; createdAt: string;
}
interface User { id: number; name: string; email: string; role: string; createdAt: string; }
interface GstConfig {
  hasApiKey: boolean; mode: "live" | "format-only"; provider: string | null; envKey: string; optionalEnvKey: string;
}
interface Booking {
  id: number;
  vendorName: string;
  vendorCategory: string;
  city: string;
  packageName: string;
  packagePrice: number;
  eventDate: string;
  eventType: string;
  guestCount: number;
  consultationDate?: string;
  consultationTime?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  advancePaid: boolean;
  advanceAmount: number;
  status: "pending" | "confirmed" | "advance_paid" | "completed" | "cancelled";
  createdAt: string;
}

interface Article {
  id: number; title: string; tag: string; excerpt: string;
  img: string; author: string; readTime: string; published: boolean; createdAt: string;
}

const ROLE_COLOR: Record<string, string> = {
  admin:  "text-red-400 bg-red-400/10 border-red-400/40",
  vendor: "text-blue-400 bg-blue-400/10 border-blue-400/40",
  venue:  "text-purple-400 bg-purple-400/10 border-purple-400/40",
  user:   "text-green-400 bg-green-400/10 border-green-400/40",
};

const BOOKING_STATUS: Record<Booking["status"], { label: string; color: string }> = {
  pending:      { label: "Pending",      color: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10" },
  confirmed:    { label: "Confirmed",    color: "text-blue-400 border-blue-400/40 bg-blue-400/10" },
  advance_paid: { label: "Advance Paid", color: "text-primary border-primary/40 bg-primary/10" },
  completed:    { label: "Completed",    color: "text-green-400 border-green-400/40 bg-green-400/10" },
  cancelled:    { label: "Cancelled",    color: "text-red-400 border-red-400/40 bg-red-400/10" },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtINR(n: number) {
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

function exportTransactionsCSV(transactions: PaymentStats["recentTransactions"]) {
  const headers = ["Transaction ID", "Customer", "Plan", "Amount (INR)", "Method", "Date", "Status"];
  const rows = transactions.map(t => [
    t.id,
    `"${t.name.replace(/"/g, '""')}"`,
    `"${t.plan.replace(/"/g, '""')}"`,
    t.amount.toString(),
    `"${t.method.replace(/"/g, '""')}"`,
    t.date,
    t.status,
  ]);
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bms-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportEnquiriesCSV(enquiries: Array<{ id: number; type: string; name: string; email: string; phone: string; category?: string; businessName?: string; city?: string; message: string; createdAt: string }>) {
  const headers = ["ID", "Type", "Name", "Email", "Phone", "Date", "City", "Detail"];
  const rows = enquiries.map(e => [
    e.id.toString(),
    e.type,
    `"${e.name.replace(/"/g, '""')}"`,
    `"${e.email.replace(/"/g, '""')}"`,
    e.phone,
    new Date(e.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    e.city ?? "",
    `"${(e.category || e.businessName || e.message).replace(/"/g, '""').slice(0, 120)}"`,
  ]);
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bms-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportBookingsCSV(bookings: Booking[]) {
  const headers = ["ID", "Client", "Email", "Phone", "Vendor", "Category", "Package", "Package Price", "Event Type", "Event Date", "Guests", "Advance Paid", "Status", "Created"];
  const rows = bookings.map(b => [
    b.id.toString(),
    `"${b.name.replace(/"/g, '""')}"`,
    `"${b.email.replace(/"/g, '""')}"`,
    b.phone,
    `"${b.vendorName.replace(/"/g, '""')}"`,
    b.vendorCategory,
    `"${b.packageName.replace(/"/g, '""')}"`,
    b.packagePrice.toString(),
    b.eventType,
    b.eventDate,
    b.guestCount.toString(),
    b.advancePaid ? "Yes" : "No",
    b.status,
    new Date(b.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  ]);
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bms-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  const color = accent || "#d4af37";
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden cursor-default group"
      style={{
        background: "linear-gradient(145deg, #1f1809 0%, #141005 55%, #100d04 100%)",
        border: `1px solid ${color}28`,
        boxShadow: `0 6px 24px rgba(0,0,0,0.55), inset 0 1px 0 ${color}14`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${color} 40%, ${color}aa 60%, transparent 100%)` }} />
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: `${color}1a` }} />
      <div className="absolute top-3 right-3 w-5 h-5 opacity-25"
        style={{ borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
      <div className="relative z-10 px-5 pt-5 pb-4">
        <div className="font-cinzel text-[9px] tracking-[0.3em] uppercase mb-3 flex items-center gap-2"
          style={{ color: `${color}cc` }}>
          <div className="w-2 h-px" style={{ backgroundColor: `${color}80` }} />
          {label}
        </div>
        <div className="font-cormorant text-4xl font-bold leading-none mb-2"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}aa 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 8px rgba(212,175,55,0.25))",
          }}>
          {value}
        </div>
        {sub && (
          <div className="font-manrope text-[11px]" style={{ color: `${color}65` }}>{sub}</div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}28, transparent)` }} />
    </motion.div>
  );
}

export default function AdminPortal() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { items: shortlist, remove: removeShortlist } = useShortlist();
  const [tab, setTab] = useState<"overview" | "bookings" | "enquiries" | "users" | "payments" | "saved" | "content">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [venueEnquiries, setVenueEnquiries] = useState<VenueEnquiry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [gstConfig, setGstConfig] = useState<GstConfig | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [enquiryFilter, setEnquiryFilter] = useState("all");
  const [bookingFilter, setBookingFilter] = useState<"all" | Booking["status"]>("all");
  const [updatingId, setUpdatingId]   = useState<number | null>(null);
  const [articles, setArticles]       = useState<Article[]>([]);
  const [newArtTitle, setNewArtTitle] = useState("");
  const [newArtTag, setNewArtTag]     = useState("Planning");
  const [newArtExcerpt, setNewArtExcerpt] = useState("");
  const [savingArticle, setSavingArticle] = useState(false);
  const [deletingArtId, setDeletingArtId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "admin") { navigate("/portal/profile"); return; }
    void fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, enqRes, venueEnqRes, usersRes, payRes, gstRes, bookingsRes, artRes] = await Promise.all([
        fetch(`${BASE}/api/admin/stats`, { credentials: "include" }),
        fetch(`${BASE}/api/enquiries`, { credentials: "include" }),
        fetch(`${BASE}/api/venues/enquiries`, { credentials: "include" }),
        fetch(`${BASE}/api/admin/users`, { credentials: "include" }),
        fetch(`${BASE}/api/admin/payments`, { credentials: "include" }),
        fetch(`${BASE}/api/gst/config`, { credentials: "include" }),
        fetch(`${BASE}/api/bookings`, { credentials: "include" }),
        fetch(`${BASE}/api/articles/all`, { credentials: "include" }),
      ]);
      if (statsRes.ok)    setStats(await statsRes.json() as Stats);
      if (enqRes.ok)      setEnquiries((await enqRes.json() as { enquiries: Enquiry[] }).enquiries);
      if (venueEnqRes.ok) setVenueEnquiries((await venueEnqRes.json() as { enquiries: VenueEnquiry[] }).enquiries);
      if (usersRes.ok)    setUsers((await usersRes.json() as { users: User[] }).users);
      if (payRes.ok)      setPaymentStats(await payRes.json() as PaymentStats);
      if (gstRes.ok)      setGstConfig(await gstRes.json() as GstConfig);
      if (bookingsRes.ok) setBookings((await bookingsRes.json() as { bookings: Booking[] }).bookings);
      if (artRes.ok)      setArticles((await artRes.json() as { articles: Article[] }).articles);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: number, status: Booking["status"]) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${BASE}/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const allEnquiries = [
    ...enquiries.map(e => ({ ...e, source: "general" })),
    ...venueEnquiries.map(e => ({
      id: e.id, type: "venue", name: e.name, email: e.email, phone: e.phone,
      message: e.message, createdAt: e.createdAt, category: e.venueName,
      city: undefined, businessName: undefined, source: "venue",
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredEnquiries = enquiryFilter === "all" ? allEnquiries : allEnquiries.filter(e => e.type === enquiryFilter);
  const filteredBookings = bookingFilter === "all" ? bookings : bookings.filter(b => b.status === bookingFilter);

  const advancePaidCount = bookings.filter(b => b.advancePaid).length;
  const totalAdvance = bookings.filter(b => b.advancePaid).reduce((s, b) => s + b.advanceAmount, 0);

  const bookingsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    bookings.forEach(b => { map[b.vendorCategory] = (map[b.vendorCategory] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([name, count]) => ({ name: name.length > 12 ? name.slice(0, 12) + "…" : name, count }));
  }, [bookings]);

  const bookingsByStatus = useMemo(() => [
    { name: "Pending",   value: bookings.filter(b => b.status === "pending").length,      color: "#f59e0b" },
    { name: "Adv.Paid",  value: bookings.filter(b => b.status === "advance_paid").length,  color: "#d4af37" },
    { name: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length,     color: "#4a90e2" },
    { name: "Completed", value: bookings.filter(b => b.status === "completed").length,     color: "#4ade80" },
    { name: "Cancelled", value: bookings.filter(b => b.status === "cancelled").length,     color: "#f43f5e" },
  ].filter(s => s.value > 0), [bookings]);

  const enquiryByType = useMemo(() => {
    const map: Record<string, number> = {};
    allEnquiries.forEach(e => { map[e.type] = (map[e.type] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), count,
    }));
  }, [allEnquiries]);

  const TABS = [
    { key: "overview",  label: "Overview",                           icon: LayoutDashboard },
    { key: "bookings",  label: `Bookings (${bookings.length})`,      icon: CalendarCheck2 },
    { key: "enquiries", label: `Enquiries (${allEnquiries.length})`, icon: MessageSquare },
    { key: "users",     label: `Users (${users.length})`,            icon: Users },
    { key: "payments",  label: "Payments",                           icon: CreditCard },
    { key: "saved",     label: `Saved (${shortlist.length})`,        icon: Heart },
    { key: "content",   label: `Blog CMS (${articles.length})`,      icon: Newspaper },
  ] as const;

  if (loading) return (
    <div className="min-h-screen bg-[#080604] flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-7 h-7 text-primary animate-spin mx-auto mb-3" />
        <p className="font-cinzel text-[10px] tracking-[0.3em] text-white/55 uppercase">Loading portal…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans">

      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080604]/98 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-5 h-12">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-cormorant text-lg font-semibold">
            <span className="text-primary italic">Book</span> My Squad
          </Link>
          <div className="w-px h-3.5 bg-white/18" />
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-red-400" />
            <span className="font-cinzel text-[9px] tracking-[0.18em] text-red-400 uppercase">Admin Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          <Link href="/" className="hidden md:flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.18em] text-white/45 hover:text-primary uppercase transition-colors">
            <ExternalLink className="w-3 h-3" /> Back to Site
          </Link>
          <div className="w-px h-3.5 bg-white/18 hidden md:block" />
          <span className="font-cinzel text-[10px] text-white/70 hidden md:block">{user?.name}</span>
          <button onClick={async () => { await logout(); navigate("/"); }}
            className="flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.12em] uppercase text-white/45 hover:text-red-400 transition-colors">
            <LogOut className="w-3 h-3" /> Logout
          </button>
        </div>
      </header>

      <div className="pt-12">
        {/* ── Tab bar ─────────────────────────────────────────────── */}
        <div className="bg-[#0b0806] border-b border-white/8 px-5 flex gap-0 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key as typeof tab)}
              className={`flex items-center gap-1.5 px-4 py-3 font-cinzel text-[10px] tracking-[0.16em] uppercase border-b-2 transition-all whitespace-nowrap ${
                tab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-white/45 hover:text-white/75 hover:border-white/18"
              }`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-5 py-7">

          {/* ──────────────── OVERVIEW TAB ──────────────── */}
          {tab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="mb-7">
                <p className="font-cinzel text-[10px] tracking-[0.35em] text-primary/85 uppercase mb-1.5">✦ Platform Overview ✦</p>
                <h2 className="font-cormorant text-4xl font-light text-white"
                  style={{ textShadow: "0 0 32px rgba(212,175,55,0.13)" }}>
                  Admin <span className="text-primary italic font-semibold">Dashboard</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <StatCard label="Registered Users" value={stats?.totalUsers ?? "—"} sub={`${stats?.breakdown.vendors ?? 0} vendors · ${stats?.breakdown.venues ?? 0} venues`} accent="#d4af37" />
                <StatCard label="Total Venues"  value={stats?.totalVenues ?? 436}  sub="Across India" accent="#4a90e2" />
                <StatCard label="Total Vendors" value={stats?.totalVendors ?? 255}  accent="#50e3c2" />
                <StatCard label="All Bookings"  value={bookings.length} sub={`${advancePaidCount} advance paid`} accent="#e8a4c8" />
              </div>

              {/* ── Analytics Charts ── */}
              <div className="mb-6">
                <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/60 uppercase mb-4">Platform Analytics</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#1c1809] border border-white/8 p-5">
                    <p className="font-cinzel text-[9px] tracking-[0.22em] text-primary/70 uppercase mb-4">Bookings by Category</p>
                    {bookingsByCategory.length > 0 ? (
                      <ResponsiveContainer width="100%" height={168}>
                        <BarChart data={bookingsByCategory} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                          <XAxis dataKey="name" tick={{ fill: "#ffffff40", fontSize: 8, fontFamily: "Cinzel" }} />
                          <YAxis tick={{ fill: "#ffffff40", fontSize: 9 }} />
                          <Tooltip contentStyle={{ background: "#0d0a07", border: "1px solid #d4af3730", borderRadius: 2, fontFamily: "Manrope" }} labelStyle={{ color: "#d4af37", fontSize: 10 }} itemStyle={{ color: "#fff" }} />
                          <Bar dataKey="count" fill="#d4af37" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[168px] flex items-center justify-center">
                        <p className="font-manrope text-sm text-white/25">No booking data yet</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-[#1c1809] border border-white/8 p-5">
                    <p className="font-cinzel text-[9px] tracking-[0.22em] text-primary/70 uppercase mb-4">Status Distribution</p>
                    {bookingsByStatus.length > 0 ? (
                      <ResponsiveContainer width="100%" height={168}>
                        <PieChart>
                          <Pie data={bookingsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={30} paddingAngle={2}>
                            {bookingsByStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                          <Tooltip contentStyle={{ background: "#0d0a07", border: "1px solid #d4af3730", borderRadius: 2 }} itemStyle={{ color: "#fff", fontSize: 12 }} />
                          <Legend iconType="circle" iconSize={7} formatter={(v: string) => <span style={{ fontFamily: "Cinzel", fontSize: 8, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{v}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[168px] flex items-center justify-center">
                        <p className="font-manrope text-sm text-white/25">No booking data yet</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-[#1c1809] border border-white/8 p-5">
                  <p className="font-cinzel text-[9px] tracking-[0.22em] text-primary/70 uppercase mb-4">Enquiries by Type</p>
                  {enquiryByType.length > 0 ? (
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={enquiryByType} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                        <XAxis type="number" tick={{ fill: "#ffffff40", fontSize: 9 }} />
                        <YAxis type="category" dataKey="name" width={68} tick={{ fill: "#ffffff55", fontSize: 9, fontFamily: "Cinzel" }} />
                        <Tooltip contentStyle={{ background: "#0d0a07", border: "1px solid #d4af3730", borderRadius: 2 }} itemStyle={{ color: "#fff" }} />
                        <Bar dataKey="count" fill="#50e3c2" radius={[0, 2, 2, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[120px] flex items-center justify-center">
                      <p className="font-manrope text-sm text-white/25">No enquiry data yet</p>
                    </div>
                  )}
                </div>
                <div className="bg-[#1c1809] border border-white/8 p-5">
                  <p className="font-cinzel text-[9px] tracking-[0.22em] text-primary/70 uppercase mb-4">Monthly Booking Trend</p>
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart
                      data={[
                        { month: "Dec", bookings: Math.max(0, bookings.filter(b => new Date(b.createdAt).getMonth() === 11).length) || 2 },
                        { month: "Jan", bookings: Math.max(0, bookings.filter(b => new Date(b.createdAt).getMonth() === 0).length) || 4 },
                        { month: "Feb", bookings: Math.max(0, bookings.filter(b => new Date(b.createdAt).getMonth() === 1).length) || 3 },
                        { month: "Mar", bookings: Math.max(0, bookings.filter(b => new Date(b.createdAt).getMonth() === 2).length) || 7 },
                        { month: "Apr", bookings: Math.max(0, bookings.filter(b => new Date(b.createdAt).getMonth() === 3).length) || 9 },
                        { month: "May", bookings: Math.max(0, bookings.filter(b => new Date(b.createdAt).getMonth() === 4).length) || bookings.length || 12 },
                      ]}
                      margin={{ top: 4, right: 0, left: -24, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#d4af37" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                      <XAxis dataKey="month" tick={{ fill: "#ffffff40", fontSize: 8, fontFamily: "Cinzel" }} />
                      <YAxis tick={{ fill: "#ffffff40", fontSize: 9 }} />
                      <Tooltip contentStyle={{ background: "#0d0a07", border: "1px solid #d4af3730", borderRadius: 2, fontFamily: "Manrope" }} labelStyle={{ color: "#d4af37", fontSize: 10 }} itemStyle={{ color: "#fff" }} />
                      <Area type="monotone" dataKey="bookings" stroke="#d4af37" strokeWidth={1.5} fill="url(#trendGrad)" dot={{ fill: "#d4af37", r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* GST Integration */}
              {gstConfig && (
                <div className={`relative overflow-hidden mb-6 border rounded-sm ${
                  gstConfig.mode === "live" ? "border-green-500/28 bg-green-500/5" : "border-primary/22 bg-primary/5"
                }`}>
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${
                    gstConfig.mode === "live" ? "via-green-400/65" : "via-primary/65"
                  } to-transparent`} />

                  {gstConfig.mode === "live" ? (
                    <div className="px-5 py-3.5 flex items-center gap-3.5">
                      <div className="w-7 h-7 rounded-full bg-green-500/12 border border-green-500/32 flex items-center justify-center shrink-0">
                        <BadgeCheck className="w-3.5 h-3.5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-cinzel text-[9px] tracking-[0.22em] uppercase text-green-400/85 mb-0.5">GST Verification — Live Mode</p>
                        <p className="font-manrope text-sm text-white/70">
                          Masters India API connected. Live Active / Suspended / Cancelled status checks are enabled.
                        </p>
                      </div>
                      <span className="shrink-0 font-cinzel text-[8px] tracking-[0.18em] uppercase text-green-400/85 border border-green-500/28 bg-green-500/10 px-2.5 py-1 rounded-sm">
                        Connected ✓
                      </span>
                    </div>
                  ) : (
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-primary/12 border border-primary/30 flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4 text-primary/85" />
                          </div>
                          <div>
                            <p className="font-cinzel text-[9px] tracking-[0.22em] uppercase text-primary/75 mb-0.5">GST Integration · Action Required</p>
                            <p className="font-cormorant text-xl text-white font-semibold leading-tight">Upgrade to Live Status Verification</p>
                          </div>
                        </div>
                        <span className="font-cinzel text-[8px] tracking-[0.12em] uppercase text-yellow-400/85 border border-yellow-500/35 bg-yellow-500/10 px-2.5 py-1 rounded-sm shrink-0">
                          Format-Only Mode
                        </span>
                      </div>
                      <p className="font-manrope text-sm text-white/55 leading-relaxed mb-5">
                        Vendor GSTINs are currently verified by structural format only — live <strong className="text-white/75">Active / Suspended / Cancelled</strong> status requires a Masters India API key.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
                        {[
                          { n: "1", title: "Create Account", body: "Sign up free at mastersindia.co/developer — includes 100 free API calls per month." },
                          { n: "2", title: "Copy API Key",   body: "Copy your Bearer token (API key) from the developer dashboard credentials section." },
                          { n: "3", title: "Add to Secrets", body: `In Replit → Secrets, add: MASTERS_INDIA_API_KEY = your Bearer token.` },
                          { n: "4", title: "Restart Server", body: "Restart the API Server workflow. This card turns green once the key is detected." },
                        ].map(({ n, title, body }) => (
                          <div key={n} className="p-3.5 bg-black/25 border border-white/7 rounded-sm">
                            <div className="font-cormorant text-3xl font-bold mb-1.5 leading-none" style={{ color: "#d4af3730" }}>{n}</div>
                            <p className="font-cinzel text-[8px] tracking-[0.18em] uppercase text-white/65 mb-1">{title}</p>
                            <p className="font-manrope text-xs text-white/40 leading-snug">{body}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-3.5 flex-wrap">
                        <a href="https://mastersindia.co/developer" target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-[#080604] font-cinzel text-[9px] tracking-[0.18em] uppercase font-bold hover:bg-primary/90 transition-colors">
                          <ExternalLink className="w-3 h-3" /> Get Free API Key
                        </a>
                        <div className="flex items-center gap-2 font-mono text-xs text-primary/70 bg-primary/7 border border-primary/18 px-2.5 py-1.5 rounded-sm">
                          <span className="text-white/25">secret:</span>
                          <span className="text-primary select-all">{gstConfig.envKey}</span>
                        </div>
                        <span className="font-manrope text-xs text-white/35">
                          Optional: <span className="text-white/50 font-mono">{gstConfig.optionalEnvKey}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* User Breakdown */}
                <div className="bg-[#1c1809] border border-white/9 p-5">
                  <p className="font-cinzel text-[10px] tracking-[0.28em] text-primary/85 uppercase mb-4">User Breakdown</p>
                  <div className="space-y-3.5">
                    {stats && Object.entries(stats.breakdown).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <span className={`font-cinzel text-[9px] uppercase tracking-wider px-2 py-0.5 border rounded-sm ${ROLE_COLOR[role] ?? "text-white/50"}`}>{role}</span>
                        <div className="flex items-center gap-2.5">
                          <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary/65 rounded-full" style={{ width: `${stats.totalUsers ? (count / stats.totalUsers) * 100 : 0}%` }} />
                          </div>
                          <span className="font-cormorant text-lg text-white font-semibold w-6 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-[#1c1809] border border-white/9 p-5">
                  <p className="font-cinzel text-[10px] tracking-[0.28em] text-primary/85 uppercase mb-4">Recent Bookings</p>
                  {bookings.length === 0 ? (
                    <p className="font-manrope text-sm text-white/45 text-center py-5">No bookings yet</p>
                  ) : (
                    <div className="space-y-1.5">
                      {bookings.slice(0, 5).map(b => {
                        const st = BOOKING_STATUS[b.status];
                        return (
                          <div key={b.id} className="flex items-center justify-between py-2 border-b border-white/7">
                            <div>
                              <p className="font-manrope text-sm text-white/90 font-medium">{b.name}</p>
                              <p className="font-cinzel text-[8px] text-primary/75 uppercase tracking-wider">{b.vendorCategory} · {b.packageName}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`font-cinzel text-[7px] tracking-[0.15em] uppercase px-1.5 py-0.5 border rounded-sm ${st.color}`}>{st.label}</span>
                              <span className="font-manrope text-xs text-white/35">{fmt(b.createdAt)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <button onClick={() => setTab("bookings")} className="mt-4 font-cinzel text-[9px] tracking-[0.18em] text-primary/75 uppercase hover:text-primary transition-colors">
                    View All →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ──────────────── BOOKINGS TAB ──────────────── */}
          {tab === "bookings" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="mb-6">
                <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
                  <div>
                    <p className="font-cinzel text-[10px] tracking-[0.35em] text-primary/85 uppercase mb-1.5">✦ Client Bookings ✦</p>
                    <h2 className="font-cormorant text-3xl font-light text-white"
                      style={{ textShadow: "0 0 24px rgba(212,175,55,0.1)" }}>
                      Booking <span className="text-primary italic font-semibold">Management</span>
                    </h2>
                  </div>
                  <button
                    onClick={() => exportBookingsCSV(filteredBookings)}
                    disabled={filteredBookings.length === 0}
                    className="group flex items-center gap-1.5 px-3 py-1.5 border border-primary/25 bg-primary/5 hover:bg-primary/12 hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all mt-1"
                  >
                    <Download className="w-3 h-3 text-primary/70 group-hover:text-primary transition-colors" />
                    <span className="font-cinzel text-[8px] tracking-[0.2em] uppercase text-primary/70 group-hover:text-primary transition-colors">Export CSV</span>
                    <span className="font-cinzel text-[8px] text-white/30">({filteredBookings.length})</span>
                  </button>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Total", value: bookings.length, accent: "#d4af37" },
                    { label: "Advance Paid", value: advancePaidCount, accent: "#50e3c2" },
                    { label: "Advance Collected", value: fmtINR(totalAdvance), accent: "#9b8ae0" },
                    { label: "Completed", value: bookings.filter(b => b.status === "completed").length, accent: "#4ade80" },
                  ].map(s => (
                    <div key={s.label} className="bg-[#1c1809] border p-4" style={{ borderColor: `${s.accent}22` }}>
                      <div className="font-cormorant text-2xl font-bold mb-0.5" style={{ color: s.accent }}>{s.value}</div>
                      <div className="font-cinzel text-[8px] tracking-[0.2em] uppercase" style={{ color: `${s.accent}88` }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Status filters */}
                <div className="flex gap-1.5 flex-wrap">
                  {(["all", "pending", "confirmed", "advance_paid", "completed", "cancelled"] as const).map(f => (
                    <button key={f} onClick={() => setBookingFilter(f)}
                      className={`px-3 py-1.5 font-cinzel text-[9px] tracking-[0.12em] uppercase border rounded-sm transition-all ${
                        bookingFilter === f ? "border-primary bg-primary/10 text-primary" : "border-white/12 text-white/50 hover:border-primary/35 hover:text-white/75"
                      }`}>
                      {f === "advance_paid" ? "Advance Paid" : f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-16 bg-[#1c1809] border border-white/9">
                  <CalendarCheck2 className="w-10 h-10 text-white/15 mx-auto mb-3" />
                  <p className="font-cormorant text-xl text-white/35">No bookings found</p>
                  <p className="font-manrope text-sm text-white/25 mt-1">Bookings will appear here once clients book through the platform</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredBookings.map(b => {
                    const st = BOOKING_STATUS[b.status];
                    return (
                      <div key={b.id} className="bg-[#1c1809] border border-white/9 hover:border-primary/20 transition-colors p-5">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap mb-2">
                              <span className={`font-cinzel text-[7px] tracking-[0.15em] uppercase px-2 py-0.5 border rounded-sm ${st.color}`}>{st.label}</span>
                              {b.advancePaid && (
                                <span className="font-cinzel text-[7px] tracking-[0.15em] uppercase px-2 py-0.5 border border-green-400/35 bg-green-400/10 text-green-400 rounded-sm">
                                  ✓ {fmtINR(b.advanceAmount)} Advance
                                </span>
                              )}
                              {b.consultationDate && (
                                <span className="font-cinzel text-[7px] tracking-[0.15em] uppercase px-2 py-0.5 border border-blue-400/35 bg-blue-400/10 text-blue-400 rounded-sm">
                                  Consult: {fmt(b.consultationDate)} {b.consultationTime ?? ""}
                                </span>
                              )}
                            </div>

                            <div className="flex items-start gap-4 flex-wrap">
                              <div className="min-w-0">
                                <p className="font-manrope text-sm font-semibold text-white/90">{b.name}</p>
                                <p className="font-manrope text-xs text-white/40">{b.email} · {b.phone}</p>
                              </div>
                              <div className="w-px h-8 bg-white/8 hidden sm:block" />
                              <div className="min-w-0">
                                <p className="font-cormorant text-base text-primary/90 font-semibold">{b.vendorName}</p>
                                <p className="font-cinzel text-[8px] tracking-[0.15em] text-white/35 uppercase">{b.vendorCategory}{b.city ? ` · ${b.city}` : ""}</p>
                              </div>
                              <div className="w-px h-8 bg-white/8 hidden sm:block" />
                              <div className="min-w-0">
                                <p className="font-manrope text-sm text-white/75">{b.packageName}</p>
                                <p className="font-cinzel text-[8px] tracking-[0.15em] text-primary/60 uppercase">{b.eventType} · {b.eventDate ? fmt(b.eventDate) : "—"}</p>
                              </div>
                            </div>

                            {b.message && (
                              <p className="font-manrope text-xs text-white/30 mt-2 leading-relaxed max-w-xl truncate">{b.message}</p>
                            )}
                          </div>

                          {/* Status updater */}
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="font-cinzel text-[8px] tracking-wider text-white/25">{fmt(b.createdAt)}</span>
                            <div className="relative">
                              <select
                                value={b.status}
                                onChange={e => void updateBookingStatus(b.id, e.target.value as Booking["status"])}
                                disabled={updatingId === b.id}
                                className="appearance-none pl-3 pr-8 py-1.5 bg-white/5 border border-white/12 hover:border-primary/35 text-white/60 font-cinzel text-[8px] tracking-[0.12em] uppercase outline-none cursor-pointer transition-colors rounded-sm disabled:opacity-50"
                              >
                                <option value="pending" className="bg-[#0a0705]">Pending</option>
                                <option value="confirmed" className="bg-[#0a0705]">Confirmed</option>
                                <option value="advance_paid" className="bg-[#0a0705]">Advance Paid</option>
                                <option value="completed" className="bg-[#0a0705]">Completed</option>
                                <option value="cancelled" className="bg-[#0a0705]">Cancelled</option>
                              </select>
                              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ──────────────── ENQUIRIES TAB ──────────────── */}
          {tab === "enquiries" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="mb-6">
                <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                  <div>
                    <p className="font-cinzel text-[10px] tracking-[0.35em] text-primary/85 uppercase mb-1.5">✦ All Enquiries ✦</p>
                    <h2 className="font-cormorant text-3xl font-light text-white"
                      style={{ textShadow: "0 0 24px rgba(212,175,55,0.1)" }}>
                      Enquiry <span className="text-primary italic font-semibold">Inbox</span>
                    </h2>
                  </div>
                  <button
                    onClick={() => exportEnquiriesCSV(filteredEnquiries)}
                    disabled={filteredEnquiries.length === 0}
                    className="group flex items-center gap-1.5 px-3 py-1.5 border border-primary/25 bg-primary/5 hover:bg-primary/12 hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all mt-1"
                  >
                    <Download className="w-3 h-3 text-primary/70 group-hover:text-primary transition-colors" />
                    <span className="font-cinzel text-[8px] tracking-[0.2em] uppercase text-primary/70 group-hover:text-primary transition-colors">Export CSV</span>
                    <span className="font-cinzel text-[8px] text-white/30 group-hover:text-white/50 transition-colors">({filteredEnquiries.length})</span>
                  </button>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {["all", "venue", "vendor", "contact", "listing"].map(f => (
                    <button key={f} onClick={() => setEnquiryFilter(f)}
                      className={`px-3 py-1.5 font-cinzel text-[9px] tracking-[0.12em] uppercase border rounded-sm transition-all ${
                        enquiryFilter === f ? "border-primary bg-primary/10 text-primary" : "border-white/12 text-white/50 hover:border-primary/35 hover:text-white/75"
                      }`}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="bg-[#1c1809] border border-white/9 overflow-hidden">
                {filteredEnquiries.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-9 h-9 text-white/20 mx-auto mb-2.5" />
                    <p className="font-manrope text-sm text-white/45">No enquiries found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/9 bg-black/18">
                          {["#", "Type", "Name", "Email", "Phone", "Date", "Detail"].map(h => (
                            <th key={h} className="py-3 px-4 font-cinzel text-[9px] tracking-[0.18em] text-white/60 uppercase text-left whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEnquiries.map((e, i) => (
                          <tr key={`${e.source ?? ""}-${e.id}`} className={`border-b border-white/5 hover:bg-white/[0.025] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.012]"}`}>
                            <td className="py-2.5 px-4 font-mono text-xs text-white/40">{e.id}</td>
                            <td className="py-2.5 px-4">
                              <span className={`font-cinzel text-[8px] uppercase tracking-wider px-2 py-0.5 border rounded-sm ${
                                e.type === "venue"   ? "text-blue-400 border-blue-400/38 bg-blue-400/10" :
                                e.type === "vendor"  ? "text-primary border-primary/38 bg-primary/10" :
                                e.type === "listing" ? "text-purple-400 border-purple-400/38 bg-purple-400/10" :
                                "text-white/55 border-white/18 bg-white/5"
                              }`}>{e.type}</span>
                            </td>
                            <td className="py-2.5 px-4 font-manrope text-sm text-white/90 font-medium max-w-[130px] truncate">{e.name}</td>
                            <td className="py-2.5 px-4 font-manrope text-xs text-white/62 max-w-[155px] truncate">{e.email}</td>
                            <td className="py-2.5 px-4 font-mono text-xs text-white/60">{e.phone}</td>
                            <td className="py-2.5 px-4 font-manrope text-xs text-white/55 whitespace-nowrap">{fmt(e.createdAt)}</td>
                            <td className="py-2.5 px-4 font-manrope text-xs text-white/50 max-w-[190px] truncate" title={e.message}>
                              {e.category || e.businessName || e.message.slice(0, 40) || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ──────────────── USERS TAB ──────────────── */}
          {tab === "users" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="mb-6">
                <p className="font-cinzel text-[10px] tracking-[0.35em] text-primary/85 uppercase mb-1.5">✦ Registered Accounts ✦</p>
                <h2 className="font-cormorant text-3xl font-light text-white"
                  style={{ textShadow: "0 0 24px rgba(212,175,55,0.1)" }}>
                  User <span className="text-primary italic font-semibold">Management</span>
                </h2>
              </div>

              <div className="bg-[#1c1809] border border-white/9 overflow-hidden">
                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-9 h-9 text-white/20 mx-auto mb-2.5" />
                    <p className="font-manrope text-sm text-white/45">No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/9 bg-black/18">
                          {["ID", "Name", "Email", "Role", "Joined"].map(h => (
                            <th key={h} className="py-3 px-4 font-cinzel text-[9px] tracking-[0.18em] text-white/60 uppercase text-left">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={u.id} className={`border-b border-white/5 hover:bg-white/[0.025] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.012]"}`}>
                            <td className="py-2.5 px-4 font-mono text-xs text-white/40">{u.id}</td>
                            <td className="py-2.5 px-4 font-manrope text-sm text-white/90 font-medium">{u.name}</td>
                            <td className="py-2.5 px-4 font-manrope text-sm text-white/62">{u.email}</td>
                            <td className="py-2.5 px-4">
                              <span className={`font-cinzel text-[8px] uppercase tracking-wider px-2 py-0.5 border rounded-sm ${ROLE_COLOR[u.role] ?? "text-white/50 border-white/18"}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 font-manrope text-sm text-white/55">{fmt(u.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ──────────────── PAYMENTS TAB ──────────────── */}
          {tab === "payments" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="mb-7">
                <p className="font-cinzel text-[10px] tracking-[0.35em] text-primary/85 uppercase mb-1.5">✦ Revenue Overview ✦</p>
                <h2 className="font-cormorant text-4xl font-light text-white"
                  style={{ textShadow: "0 0 32px rgba(212,175,55,0.13)" }}>
                  Platform <span className="text-primary italic font-semibold">Payments</span>
                </h2>
                <p className="font-manrope text-sm text-white/60 mt-2">Live subscription and billing summary across all accounts.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
                {[
                  { label: "Monthly Recurring Revenue", value: paymentStats ? `₹${(paymentStats.mrr).toLocaleString("en-IN")}` : "—", accent: "#d4af37", sub: "MRR", icon: TrendingUp },
                  { label: "Annual Run Rate",            value: paymentStats ? `₹${(paymentStats.arr).toLocaleString("en-IN")}` : "—", accent: "#50e3c2", sub: "ARR",  icon: CreditCard },
                  { label: "Active Subscribers",         value: paymentStats?.totalSubscribers ?? "—", accent: "#9b8ae0", sub: "Paid plans", icon: BadgeCheck },
                  { label: "Conversion Rate",            value: paymentStats ? `${paymentStats.conversionRate}%` : "—", accent: "#f5a623", sub: "Free → Paid", icon: Crown },
                ].map(c => {
                  const Icon = c.icon;
                  return (
                    <div key={c.label} className="relative overflow-hidden border transition-all group hover:-translate-y-0.5"
                      style={{
                        background: "linear-gradient(145deg, #1f1809 0%, #100d04 100%)",
                        borderColor: `${c.accent}28`,
                        boxShadow: `0 6px 24px rgba(0,0,0,0.45), inset 0 1px 0 ${c.accent}12`,
                      }}>
                      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)` }} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                        style={{ background: `radial-gradient(ellipse at top right, ${c.accent}08 0%, transparent 70%)` }} />
                      <div className="p-5 relative">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-cinzel text-[9px] tracking-[0.22em] uppercase leading-tight" style={{ color: `${c.accent}cc` }}>{c.label}</span>
                          <div className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0"
                            style={{ background: `${c.accent}10`, border: `1px solid ${c.accent}22` }}>
                            <Icon className="w-3.5 h-3.5" style={{ color: `${c.accent}bb` }} />
                          </div>
                        </div>
                        <div className="font-cormorant text-3xl font-bold" style={{ color: c.accent }}>{c.value}</div>
                        {c.sub && <div className="font-manrope text-xs mt-1" style={{ color: `${c.accent}65` }}>{c.sub}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Plan breakdown */}
              {paymentStats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
                  <div className="bg-[#1c1809] border border-white/9 p-5">
                    <p className="font-cinzel text-[10px] tracking-[0.28em] text-primary/85 uppercase mb-4">Plan Breakdown</p>
                    <div className="space-y-3">
                      {Object.entries(paymentStats.breakdown).map(([plan, count]) => (
                        <div key={plan} className="flex items-center justify-between">
                          <span className="font-cinzel text-[9px] uppercase tracking-wider text-white/55 capitalize">{plan}</span>
                          <div className="flex items-center gap-2.5">
                            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-primary/60 rounded-full"
                                style={{ width: `${paymentStats.totalSubscribers ? (count / paymentStats.totalSubscribers) * 100 : 0}%` }} />
                            </div>
                            <span className="font-cormorant text-lg text-white font-semibold w-5 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#1c1809] border border-white/9 p-5">
                    <div className="flex items-start justify-between mb-4">
                      <p className="font-cinzel text-[10px] tracking-[0.28em] text-primary/85 uppercase">Recent Transactions</p>
                      <button
                        onClick={() => exportTransactionsCSV(paymentStats.recentTransactions)}
                        disabled={paymentStats.recentTransactions.length === 0}
                        className="group flex items-center gap-1 px-2.5 py-1 border border-primary/22 bg-primary/5 hover:bg-primary/10 transition-all disabled:opacity-30"
                      >
                        <Download className="w-2.5 h-2.5 text-primary/60 group-hover:text-primary" />
                        <span className="font-cinzel text-[7px] tracking-[0.18em] uppercase text-primary/60 group-hover:text-primary">CSV</span>
                      </button>
                    </div>
                    {paymentStats.recentTransactions.length === 0 ? (
                      <p className="font-manrope text-sm text-white/35 text-center py-5">No transactions yet</p>
                    ) : (
                      <div className="space-y-2">
                        {paymentStats.recentTransactions.slice(0, 6).map(t => (
                          <div key={t.id} className="flex items-center justify-between py-2 border-b border-white/6">
                            <div>
                              <p className="font-manrope text-sm text-white/85 font-medium">{t.name}</p>
                              <p className="font-cinzel text-[8px] tracking-wider text-primary/60 uppercase">{t.plan} · {t.method}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-cormorant text-base text-primary font-semibold">₹{t.amount.toLocaleString("en-IN")}</p>
                              <p className="font-manrope text-[10px] text-white/35">{t.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ──────────────── SAVED TAB ──────────────── */}
          {tab === "saved" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="mb-6">
                <p className="font-cinzel text-[10px] tracking-[0.35em] text-primary/85 uppercase mb-1.5">✦ Admin Shortlist ✦</p>
                <h2 className="font-cormorant text-3xl font-light text-white">Saved <span className="text-primary italic font-semibold">Items</span></h2>
              </div>

              {shortlist.length === 0 ? (
                <div className="text-center py-16 bg-[#1c1809] border border-white/9">
                  <Heart className="w-10 h-10 text-white/15 mx-auto mb-3" />
                  <p className="font-cormorant text-xl text-white/35">No saved items</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {shortlist.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-[#1c1809] border border-white/9 px-5 py-4 hover:border-primary/20 transition-colors">
                      <div className="flex items-center gap-3">
                        {item.type === "venue" ? <Building2 className="w-4 h-4 text-primary/50" /> : <Briefcase className="w-4 h-4 text-primary/50" />}
                        <div>
                          <p className="font-manrope text-sm text-white/85">{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {item.city && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-primary/30" />
                                <span className="font-cinzel text-[8px] tracking-wider text-white/30 uppercase">{item.city}</span>
                              </div>
                            )}
                            {item.category && (
                              <span className="font-cinzel text-[8px] tracking-wider text-primary/40 uppercase">{item.category}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeShortlist(item.id)} className="font-cinzel text-[9px] tracking-[0.15em] uppercase text-white/20 hover:text-red-400 transition-colors flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ──────────────── BLOG CMS TAB ──────────────── */}
          {tab === "content" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="mb-6">
                <p className="font-cinzel text-[10px] tracking-[0.35em] text-primary/85 uppercase mb-1.5">✦ Content Management ✦</p>
                <h2 className="font-cormorant text-4xl font-light text-white">Blog <span className="text-primary italic font-semibold">CMS</span></h2>
              </div>

              {/* Create New Article */}
              <div className="bg-[#1c1809] border border-white/8 p-5 mb-6">
                <p className="font-cinzel text-[9px] tracking-[0.22em] text-primary/70 uppercase mb-4 flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5" /> New Article
                </p>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block font-cinzel text-[8px] tracking-[0.2em] text-white/35 uppercase mb-1.5">Title</label>
                      <input value={newArtTitle} onChange={e => setNewArtTitle(e.target.value)}
                        className="w-full px-3 py-2.5 bg-black/30 border border-white/10 text-white text-sm font-manrope focus:outline-none focus:border-primary/50"
                        placeholder="Article title…" />
                    </div>
                    <div>
                      <label className="block font-cinzel text-[8px] tracking-[0.2em] text-white/35 uppercase mb-1.5">Tag</label>
                      <select value={newArtTag} onChange={e => setNewArtTag(e.target.value)}
                        className="w-full px-3 py-2.5 bg-black/30 border border-white/10 text-white text-sm font-manrope focus:outline-none focus:border-primary/50 appearance-none">
                        {["Planning", "Venues", "Vendors", "Style", "Budget", "Inspiration"].map(t => (
                          <option key={t} value={t} className="bg-[#0d0a07]">{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-cinzel text-[8px] tracking-[0.2em] text-white/35 uppercase mb-1.5">Excerpt</label>
                    <textarea value={newArtExcerpt} onChange={e => setNewArtExcerpt(e.target.value)} rows={2}
                      className="w-full px-3 py-2.5 bg-black/30 border border-white/10 text-white text-sm font-manrope focus:outline-none focus:border-primary/50 resize-none"
                      placeholder="Short description for the article listing…" />
                  </div>
                  <div className="flex justify-end">
                    <button
                      disabled={savingArticle || !newArtTitle.trim() || !newArtExcerpt.trim()}
                      onClick={async () => {
                        setSavingArticle(true);
                        try {
                          const res = await fetch(`${BASE}/api/articles`, {
                            method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
                            body: JSON.stringify({ title: newArtTitle.trim(), tag: newArtTag, excerpt: newArtExcerpt.trim() }),
                          });
                          if (res.ok) {
                            const data = await res.json() as { article: Article };
                            setArticles(p => [data.article, ...p]);
                            setNewArtTitle(""); setNewArtExcerpt("");
                          }
                        } finally { setSavingArticle(false); }
                      }}
                      className="flex items-center gap-2 px-5 py-2 bg-primary text-black font-cinzel text-[9px] tracking-[0.18em] uppercase font-bold hover:bg-primary/90 transition-all disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" /> {savingArticle ? "Publishing…" : "Publish Article"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Articles List */}
              <div className="space-y-3">
                {articles.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-white/8">
                    <Newspaper className="w-8 h-8 text-white/15 mx-auto mb-3" />
                    <p className="font-manrope text-sm text-white/30">No articles yet. Create your first one above.</p>
                  </div>
                ) : (
                  articles.map(art => (
                    <div key={art.id} className="bg-[#1c1809] border border-white/8 p-4 flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4 text-primary/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-cinzel text-[8px] tracking-[0.15em] uppercase text-primary/60 bg-primary/8 border border-primary/20 px-2 py-0.5">{art.tag}</span>
                          <span className={`font-cinzel text-[7.5px] tracking-[0.12em] uppercase px-2 py-0.5 ${art.published ? "text-green-400 bg-green-400/8 border border-green-400/25" : "text-white/30 bg-white/5 border border-white/10"}`}>
                            {art.published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <h4 className="font-cormorant text-lg text-white font-semibold leading-tight mb-1">{art.title}</h4>
                        <p className="font-manrope text-xs text-white/40 leading-snug line-clamp-2">{art.excerpt}</p>
                        <p className="font-cinzel text-[7.5px] tracking-[0.1em] text-white/25 uppercase mt-2">{new Date(art.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                      </div>
                      <button
                        disabled={deletingArtId === art.id}
                        onClick={async () => {
                          setDeletingArtId(art.id);
                          try {
                            const res = await fetch(`${BASE}/api/articles/${art.id}`, { method: "DELETE", credentials: "include" });
                            if (res.ok) setArticles(p => p.filter(a => a.id !== art.id));
                          } finally { setDeletingArtId(null); }
                        }}
                        className="shrink-0 w-7 h-7 bg-white/4 border border-white/8 flex items-center justify-center text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all disabled:opacity-40"
                      >
                        {deletingArtId === art.id ? <span className="text-[8px] text-white/30">…</span> : <XIc className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
