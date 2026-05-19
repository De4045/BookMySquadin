import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useShortlist } from "@/context/ShortlistContext";
import {
  LayoutDashboard, MessageSquare, User, LogOut, ExternalLink, Briefcase, Star,
  RefreshCw, ChevronRight, CheckCircle2, Heart, MapPin, Trash2, Building2,
  CreditCard, CalendarDays, Edit2, Save, X as XIcon, Image, ShieldCheck,
  ChevronLeft, Plus, AlertCircle, Clock, BadgeCheck, FileText, ArrowRight,
} from "lucide-react";
import { PaymentTab } from "./PaymentTab";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

interface Enquiry {
  id: number; type: string; name: string; email: string;
  phone: string; category?: string; city?: string; message: string;
  createdAt: string; status?: string;
}

interface Booking {
  id: number; vendorName: string; vendorCategory: string; city: string;
  packageName: string; packagePrice: number; eventDate: string; eventType: string;
  guestCount: number; name: string; email: string; phone: string;
  advancePaid: boolean; advanceAmount: number; status: string; createdAt: string;
}

interface PortfolioPhoto {
  id: number; url: string; caption: string; addedAt: string;
}

interface BlockedDate {
  date: string; reason: string;
}

interface KycDoc {
  id: number; docType: string; value: string; note: string;
  status: string; uploadedAt: string; reviewedAt?: string;
}

type Tab = "dashboard" | "leads" | "bookings" | "portfolio" | "availability" | "kyc" | "profile" | "saved" | "payment";

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

const LEAD_STATUS_CYCLE: Record<string, string> = { new: "replied", replied: "converted", converted: "new" };
const LEAD_STATUS_COLOR: Record<string, string> = {
  new: "#d4af37", replied: "#50e3c2", converted: "#4ade80",
};
const LEAD_STATUS_LABEL: Record<string, string> = {
  new: "New", replied: "Replied", converted: "Converted",
};

const KYC_LABELS: Record<string, string> = {
  gst: "GST Number", aadhaar: "Aadhaar Number", pan: "PAN Number", portfolio_certificate: "Portfolio Certificate URL",
};
const KYC_PLACEHOLDERS: Record<string, string> = {
  gst: "27AAPFU0939F1ZV", aadhaar: "XXXX XXXX 1234 (last 4 digits)", pan: "ABCDE1234F",
  portfolio_certificate: "https://drive.google.com/your-portfolio.pdf",
};
const KYC_STATUS_COLOR: Record<string, string> = {
  pending: "#f59e0b", under_review: "#60a5fa", approved: "#4ade80", rejected: "#f87171",
};

function ProfileTab({
  user, fmt: fmtFn, initials,
}: {
  user: { id: number; name: string; email: string; role: string; createdAt: string; phone?: string; city?: string; bio?: string } | null;
  fmt: (iso: string) => string;
  initials: string;
}) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "", phone: user?.phone ?? "", city: user?.city ?? "", bio: user?.bio ?? "",
  });

  const handleSave = async () => {
    setSaving(true); setSaveError("");
    try {
      const res = await fetch(`${BASE}/api/auth/profile`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify(form),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) { setSaveError(data.error || "Failed to save."); return; }
      setSaved(true); setEditMode(false);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ Business Profile ✦</p>
          <h2 className="font-cormorant text-3xl font-light text-white">My <span className="text-primary italic font-semibold">Profile</span></h2>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="font-cinzel text-[8px] tracking-[0.15em] text-green-400 uppercase">Saved!</span>}
          {!editMode ? (
            <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 px-4 py-2 border border-white/15 text-white/60 font-cinzel text-[9px] tracking-[0.18em] uppercase hover:border-primary/40 hover:text-primary transition-all">
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-black font-cinzel text-[9px] tracking-[0.18em] uppercase font-bold hover:bg-primary/90 transition-all disabled:opacity-60">
                <Save className="w-3.5 h-3.5" /> {saving ? "Saving…" : "Save"}
              </button>
              <button onClick={() => { setEditMode(false); setSaveError(""); setForm({ name: user?.name ?? "", phone: user?.phone ?? "", city: user?.city ?? "", bio: user?.bio ?? "" }); }}
                className="flex items-center gap-1.5 px-3 py-2 border border-white/15 text-white/50 font-cinzel text-[9px] tracking-[0.15em] uppercase hover:border-white/30 transition-all">
                <XIcon className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      {saveError && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-manrope text-sm">{saveError}</div>}
      <div className="max-w-2xl space-y-4">
        <div className="bg-[#1a1510] border border-white/8 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-sm bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <span className="font-cinzel text-2xl text-primary font-bold">{initials}</span>
            </div>
            <div>
              <h3 className="font-cormorant text-2xl text-white font-semibold">{form.name || user?.name}</h3>
              <p className="font-manrope text-sm text-white/45">{user?.email}</p>
              <span className="font-cinzel text-[8px] tracking-[0.2em] uppercase text-blue-400 bg-blue-400/10 border border-blue-400/30 px-2 py-0.5 mt-1 inline-block">Vendor</span>
            </div>
          </div>
          {editMode ? (
            <div className="space-y-3">
              <div>
                <label className="block font-cinzel text-[8.5px] tracking-[0.2em] text-white/40 uppercase mb-1.5">Display Name</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-black/30 border border-white/12 text-white text-sm font-manrope focus:outline-none focus:border-primary/50" placeholder="Your full name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-cinzel text-[8.5px] tracking-[0.2em] text-white/40 uppercase mb-1.5">Phone</label>
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-black/30 border border-white/12 text-white text-sm font-manrope focus:outline-none focus:border-primary/50" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block font-cinzel text-[8.5px] tracking-[0.2em] text-white/40 uppercase mb-1.5">City</label>
                  <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-black/30 border border-white/12 text-white text-sm font-manrope focus:outline-none focus:border-primary/50" placeholder="Mumbai, Delhi…" />
                </div>
              </div>
              <div>
                <label className="block font-cinzel text-[8.5px] tracking-[0.2em] text-white/40 uppercase mb-1.5">Bio (max 500 chars)</label>
                <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} maxLength={500}
                  className="w-full px-3 py-2.5 bg-black/30 border border-white/12 text-white text-sm font-manrope focus:outline-none focus:border-primary/50 resize-none" placeholder="Tell couples about your services…" />
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {[
                { label: "Member Since", value: user ? fmtFn(user.createdAt) : "—" },
                { label: "Account Status", value: "Active & Verified" },
                { label: "Phone", value: user?.phone || "Not set" },
                { label: "City", value: user?.city || "Not set" },
                { label: "Bio", value: user?.bio || "Not set" },
              ].map(item => (
                <div key={item.label} className="flex items-start justify-between py-2.5 border-b border-white/5">
                  <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/35 uppercase">{item.label}</span>
                  <span className="font-manrope text-sm text-white/65 max-w-[60%] text-right leading-snug">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-[#1a1510] border border-white/8 p-6">
          <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/50 uppercase mb-4">List Your Business</p>
          <p className="font-manrope text-sm text-white/50 mb-4">Get discovered by thousands of couples planning their dream wedding.</p>
          <Link href="/list-your-business">
            <button className="w-full py-3 bg-primary text-black font-cinzel font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all gold-glow">Submit Your Listing →</button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function MiniCalendar({
  blockedDates, onBlock, onUnblock, loading,
}: {
  blockedDates: BlockedDate[];
  onBlock: (date: string, reason: string) => void;
  onUnblock: (date: string) => void;
  loading: boolean;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [pendingDate, setPendingDate] = useState<string | null>(null);
  const [reason, setReason] = useState("Booked");

  const blockedSet = new Set(blockedDates.map(d => d.date));

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);

  const toDateStr = (d: number) => `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handleCell = (day: number) => {
    const ds = toDateStr(day);
    if (blockedSet.has(ds)) {
      onUnblock(ds);
    } else {
      setPendingDate(ds);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => { const d = new Date(viewYear, viewMonth - 1, 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }}
          className="p-2 text-white/40 hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-cinzel text-xs tracking-[0.2em] text-white/70 uppercase">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button onClick={() => { const d = new Date(viewYear, viewMonth + 1, 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }}
          className="p-2 text-white/40 hover:text-primary transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center font-cinzel text-[9px] tracking-widest text-white/25 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const ds = toDateStr(day);
          const isBlocked = blockedSet.has(ds);
          const isPast = new Date(ds) < new Date(today.toDateString());
          return (
            <button
              key={ds}
              onClick={() => !isPast && handleCell(day)}
              disabled={isPast || loading}
              title={isBlocked ? `Blocked: ${blockedDates.find(b => b.date === ds)?.reason}` : "Click to block"}
              className={`h-9 rounded-sm font-manrope text-sm transition-all ${
                isPast
                  ? "text-white/15 cursor-not-allowed"
                  : isBlocked
                  ? "bg-red-500/25 border border-red-500/60 text-red-300 hover:bg-red-500/40"
                  : "bg-white/[0.04] border border-white/8 text-white/60 hover:border-primary/40 hover:text-primary hover:bg-primary/8"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {pendingDate && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="mt-4 p-4 bg-[#1a1510] border border-primary/20">
            <p className="font-cinzel text-[10px] tracking-[0.2em] text-primary/60 uppercase mb-3">Block {pendingDate}</p>
            <input
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Reason (e.g. Booked, Personal)"
              className="w-full px-3 py-2 bg-black/30 border border-white/12 text-white text-sm font-manrope focus:outline-none focus:border-primary/50 mb-3"
            />
            <div className="flex gap-2">
              <button onClick={() => { onBlock(pendingDate, reason || "Booked"); setPendingDate(null); setReason("Booked"); }}
                className="flex-1 py-2 bg-primary text-black font-cinzel text-[9px] tracking-[0.15em] uppercase font-bold hover:bg-primary/90 transition-all">
                Confirm Block
              </button>
              <button onClick={() => setPendingDate(null)}
                className="px-4 py-2 border border-white/15 text-white/50 font-cinzel text-[9px] tracking-[0.1em] uppercase hover:border-white/30 transition-all">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VendorPortal() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { items: shortlist, remove: removeShortlist } = useShortlist();
  const [tab, setTab] = useState<Tab>("dashboard");

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [photos, setPhotos] = useState<PortfolioPhoto[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [kycDocs, setKycDocs] = useState<KycDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoAdding, setPhotoAdding] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const [calLoading, setCalLoading] = useState(false);

  const [kycForm, setKycForm] = useState<Record<string, { value: string; note: string }>>({
    gst: { value: "", note: "" }, aadhaar: { value: "", note: "" },
    pan: { value: "", note: "" }, portfolio_certificate: { value: "", note: "" },
  });
  const [kycSaving, setKycSaving] = useState<Record<string, boolean>>({});
  const [kycSaved, setKycSaved] = useState<Record<string, boolean>>({});

  const [leadsFilter, setLeadsFilter] = useState<"all" | "new" | "replied" | "converted">("all");
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "vendor") { navigate("/portal/profile"); return; }
    void fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      const [eRes, bRes, pRes, aRes, kRes] = await Promise.all([
        fetch(`${BASE}/api/enquiries`, { credentials: "include" }),
        fetch(`${BASE}/api/bookings/portal`, { credentials: "include" }),
        fetch(`${BASE}/api/portfolio`, { credentials: "include" }),
        fetch(`${BASE}/api/availability`, { credentials: "include" }),
        fetch(`${BASE}/api/kyc`, { credentials: "include" }),
      ]);
      if (eRes.ok) { const d = await eRes.json() as { enquiries: Enquiry[] }; setEnquiries(d.enquiries.filter(e => e.type === "vendor")); }
      if (bRes.ok) { const d = await bRes.json() as { bookings: Booking[] }; setBookings(d.bookings ?? []); }
      if (pRes.ok) { const d = await pRes.json() as { photos: PortfolioPhoto[] }; setPhotos(d.photos ?? []); }
      if (aRes.ok) { const d = await aRes.json() as { blockedDates: BlockedDate[] }; setBlockedDates(d.blockedDates ?? []); }
      if (kRes.ok) { const d = await kRes.json() as { docs: KycDoc[] }; setKycDocs(d.docs ?? []); }
    } finally { setLoading(false); }
  };

  const handleAddPhoto = async () => {
    if (!photoUrl.trim()) return;
    setPhotoAdding(true); setPhotoError("");
    try {
      const res = await fetch(`${BASE}/api/portfolio`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ url: photoUrl.trim(), caption: photoCaption.trim() }),
      });
      const d = await res.json() as { photo?: PortfolioPhoto; error?: string };
      if (!res.ok) { setPhotoError(d.error || "Failed to add photo"); return; }
      setPhotos(p => [...p, d.photo!]);
      setPhotoUrl(""); setPhotoCaption("");
    } finally { setPhotoAdding(false); }
  };

  const handleDeletePhoto = async (id: number) => {
    const res = await fetch(`${BASE}/api/portfolio/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) setPhotos(p => p.filter(x => x.id !== id));
  };

  const handleBlock = async (date: string, reason: string) => {
    setCalLoading(true);
    try {
      const res = await fetch(`${BASE}/api/availability/block`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ date, reason }),
      });
      if (res.ok) setBlockedDates(d => [...d.filter(x => x.date !== date), { date, reason }]);
    } finally { setCalLoading(false); }
  };

  const handleUnblock = async (date: string) => {
    setCalLoading(true);
    try {
      const res = await fetch(`${BASE}/api/availability/block/${date}`, { method: "DELETE", credentials: "include" });
      if (res.ok) setBlockedDates(d => d.filter(x => x.date !== date));
    } finally { setCalLoading(false); }
  };

  const handleCycleStatus = async (enquiryId: number, currentStatus: string) => {
    const next = LEAD_STATUS_CYCLE[currentStatus] ?? "replied";
    setStatusUpdating(enquiryId);
    try {
      const res = await fetch(`${BASE}/api/enquiries/${enquiryId}/status`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ status: next }),
      });
      if (res.ok) setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status: next } : e));
    } finally { setStatusUpdating(null); }
  };

  const handleKycSubmit = async (docType: string) => {
    const { value, note } = kycForm[docType] ?? { value: "", note: "" };
    if (!value.trim()) return;
    setKycSaving(s => ({ ...s, [docType]: true }));
    try {
      const res = await fetch(`${BASE}/api/kyc`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ docType, value, note }),
      });
      const d = await res.json() as { doc?: KycDoc; error?: string };
      if (res.ok && d.doc) {
        setKycDocs(prev => [...prev.filter(x => x.docType !== docType), d.doc!]);
        setKycSaved(s => ({ ...s, [docType]: true }));
        setTimeout(() => setKycSaved(s => ({ ...s, [docType]: false })), 3000);
      }
    } finally { setKycSaving(s => ({ ...s, [docType]: false })); }
  };

  const initials = user ? user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() : "??";
  const filteredLeads = leadsFilter === "all" ? enquiries : enquiries.filter(e => (e.status || "new") === leadsFilter);
  const hasApprovedKyc = kycDocs.some(d => d.status === "approved");

  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "dashboard",   label: "Dashboard",                               icon: LayoutDashboard },
    { key: "leads",       label: `Leads (${enquiries.length})`,             icon: MessageSquare },
    { key: "bookings",    label: `Bookings (${bookings.length})`,           icon: CalendarDays },
    { key: "portfolio",   label: `Portfolio (${photos.length})`,            icon: Image },
    { key: "availability", label: "Availability",                           icon: CalendarDays },
    { key: "kyc",         label: hasApprovedKyc ? "✓ Verified" : "KYC & Verify", icon: ShieldCheck },
    { key: "profile",     label: "My Profile",                              icon: User },
    { key: "saved",       label: `Saved (${shortlist.length})`,             icon: Heart },
    { key: "payment",     label: "Subscription",                            icon: CreditCard },
  ];

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
        <div className="bg-[#0a0806] border-b border-white/8 px-6 flex gap-0 overflow-x-auto scrollbar-hide">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-4 font-cinzel text-[9px] tracking-[0.18em] uppercase border-b-2 transition-all whitespace-nowrap shrink-0 ${
                tab === key ? "border-primary text-primary" : "border-transparent text-white/35 hover:text-white/60"
              }`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-2">✦ Welcome Back ✦</p>
                  <h2 className="font-cormorant text-4xl font-light text-white">
                    Hello, <span className="text-primary italic font-semibold">{user?.name.split(" ")[0]}</span>
                  </h2>
                  <p className="font-manrope text-sm text-white/40 mt-2">Manage your vendor profile, portfolio, and leads from this dashboard.</p>
                </div>
                <div className="flex items-center gap-3">
                  {hasApprovedKyc && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-primary/8 border border-primary/25">
                      <BadgeCheck className="w-4 h-4 text-primary" />
                      <span className="font-cinzel text-[8px] tracking-[0.15em] text-primary uppercase">KYC Verified</span>
                    </div>
                  )}
                  <div className="w-16 h-16 rounded-sm bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <span className="font-cinzel text-2xl text-primary font-bold">{initials}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatCard label="Leads Received" value={enquiries.length} sub="Total lifetime" />
                <StatCard label="Portfolio Photos" value={photos.length} sub={`${20 - photos.length} slots remaining`} color="#50e3c2" />
                <StatCard label="Dates Blocked" value={blockedDates.length} sub="On your calendar" color="#e8a4c8" />
                <StatCard label="KYC Docs" value={kycDocs.length} sub={hasApprovedKyc ? "✓ Verified" : "Pending review"} color={hasApprovedKyc ? "#4ade80" : "#f59e0b"} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/50 uppercase mb-5">Getting Started</p>
                  <div className="space-y-4">
                    {[
                      { done: true,  text: "Account created" },
                      { done: true,  text: "Profile set up" },
                      { done: enquiries.length > 0, text: "First lead received" },
                      { done: photos.length > 0,  text: "Portfolio photos added" },
                      { done: kycDocs.length > 0,  text: "KYC documents submitted" },
                      { done: hasApprovedKyc,      text: "KYC approved — Verified badge earned" },
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
                      { label: "Add Portfolio Photos",  action: () => setTab("portfolio") },
                      { label: "Block Unavailable Dates", action: () => setTab("availability") },
                      { label: "View My Leads",          action: () => setTab("leads") },
                      { label: "Submit KYC Documents",   action: () => setTab("kyc") },
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

          {/* LEADS (enhanced enquiries with status) */}
          {tab === "leads" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
                <div>
                  <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ Lead Pipeline ✦</p>
                  <h2 className="font-cormorant text-3xl font-light text-white">Your <span className="text-primary italic font-semibold">Leads</span></h2>
                </div>
                <div className="flex gap-1">
                  {(["all", "new", "replied", "converted"] as const).map(f => (
                    <button key={f} onClick={() => setLeadsFilter(f)}
                      className={`px-3 py-1.5 font-cinzel text-[8px] tracking-[0.15em] uppercase border transition-all ${
                        leadsFilter === f ? "bg-primary text-black border-primary" : "border-white/12 text-white/40 hover:text-white/60 hover:border-white/25"
                      }`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "New",       value: enquiries.filter(e => (e.status || "new") === "new").length,       color: "#d4af37" },
                  { label: "Replied",   value: enquiries.filter(e => (e.status || "new") === "replied").length,   color: "#50e3c2" },
                  { label: "Converted", value: enquiries.filter(e => (e.status || "new") === "converted").length, color: "#4ade80" },
                ].map(s => (
                  <div key={s.label} className="bg-[#1a1510] border border-white/8 p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: s.color }} />
                    <div className="font-cormorant text-3xl font-semibold mb-1" style={{ color: s.color }}>{s.value}</div>
                    <div className="font-cinzel text-[9px] tracking-[0.2em] text-white/35 uppercase">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-[#1a1510] border border-white/8 overflow-hidden">
                {filteredLeads.length === 0 ? (
                  <div className="text-center py-20">
                    <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="font-cormorant text-2xl text-white/40 mb-2">No Leads Yet</p>
                    <p className="font-manrope text-sm text-white/25">When couples enquire about your services, leads will appear here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {filteredLeads.map(e => {
                      const st = e.status || "new";
                      const stColor = LEAD_STATUS_COLOR[st] ?? "#888";
                      return (
                        <div key={e.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4 hover:bg-white/[0.02] transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="font-cormorant text-base text-white font-semibold">{e.name}</span>
                              <span className="font-manrope text-[10px] text-white/30">{e.email}</span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-mono text-xs text-white/35">{e.phone}</span>
                              <span className="w-1 h-1 rounded-full bg-white/20" />
                              <span className="font-manrope text-xs text-white/40">{fmt(e.createdAt)}</span>
                            </div>
                            <p className="font-manrope text-xs text-white/35 mt-1 line-clamp-1">{e.message}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <button
                              onClick={() => handleCycleStatus(e.id, st)}
                              disabled={statusUpdating === e.id}
                              title="Click to advance status"
                              className="flex items-center gap-1.5 px-3 py-1.5 border rounded-sm font-cinzel text-[8px] tracking-[0.12em] uppercase font-bold transition-all hover:opacity-80 active:scale-95 disabled:opacity-50"
                              style={{ color: stColor, borderColor: stColor + "40", background: stColor + "12" }}>
                              {statusUpdating === e.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                              {LEAD_STATUS_LABEL[st]}
                              {statusUpdating !== e.id && <ArrowRight className="w-3 h-3 opacity-60" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <p className="font-manrope text-xs text-white/25 mt-3">Tip: Click a status pill to advance the lead through your pipeline.</p>
            </motion.div>
          )}

          {/* BOOKINGS */}
          {tab === "bookings" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-8">
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-2">Platform Overview</p>
                <h2 className="font-cormorant text-3xl text-white font-light">Booking <span className="text-primary italic">Requests</span></h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Bookings", value: bookings.length, color: "#d4af37" },
                  { label: "Pending",        value: bookings.filter(b => b.status === "pending").length, color: "#f59e0b" },
                  { label: "Advance Paid",   value: bookings.filter(b => b.status === "advance_paid").length, color: "#50e3c2" },
                  { label: "Confirmed",      value: bookings.filter(b => b.status === "confirmed").length, color: "#4ade80" },
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
                      const sc = ({ pending: "#f59e0b", confirmed: "#4ade80", advance_paid: "#d4af37", completed: "#60a5fa", cancelled: "#f87171" } as Record<string, string>)[b.status] ?? "#888";
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
                                <span className="font-cinzel text-[8px] tracking-[0.1em] text-emerald-400/80 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 uppercase">Advance Paid</span>
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
                            <div className="px-2.5 py-1 font-cinzel text-[8px] tracking-[0.15em] uppercase font-bold border"
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

          {/* PORTFOLIO */}
          {tab === "portfolio" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
                <div>
                  <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ Work Showcase ✦</p>
                  <h2 className="font-cormorant text-3xl font-light text-white">My <span className="text-primary italic font-semibold">Portfolio</span></h2>
                </div>
                <span className="font-cinzel text-[9px] tracking-[0.15em] text-white/30 uppercase">{photos.length} / 20 photos</span>
              </div>

              <div className="bg-[#1a1510] border border-white/8 p-6 mb-6">
                <p className="font-cinzel text-[9px] tracking-[0.25em] text-primary/50 uppercase mb-4">Add a Photo</p>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    value={photoUrl}
                    onChange={e => setPhotoUrl(e.target.value)}
                    placeholder="Image URL (https://…)"
                    className="flex-1 px-3 py-2.5 bg-black/30 border border-white/12 text-white text-sm font-manrope focus:outline-none focus:border-primary/50"
                  />
                  <input
                    value={photoCaption}
                    onChange={e => setPhotoCaption(e.target.value)}
                    placeholder="Caption (optional)"
                    className="w-full md:w-48 px-3 py-2.5 bg-black/30 border border-white/12 text-white text-sm font-manrope focus:outline-none focus:border-primary/50"
                  />
                  <button
                    onClick={handleAddPhoto}
                    disabled={photoAdding || !photoUrl.trim() || photos.length >= 20}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-cinzel text-[9px] tracking-[0.18em] uppercase font-bold hover:bg-primary/90 transition-all disabled:opacity-50 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> {photoAdding ? "Adding…" : "Add"}
                  </button>
                </div>
                {photoError && (
                  <div className="flex items-center gap-2 mt-3 text-red-400 font-manrope text-xs">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {photoError}
                  </div>
                )}
                <p className="font-manrope text-[11px] text-white/25 mt-3">Paste any publicly accessible image URL — Pexels, Google Drive (shared), or your own hosting.</p>
              </div>

              {photos.length === 0 ? (
                <div className="text-center py-20 bg-[#1a1510] border border-white/8">
                  <Image className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="font-cormorant text-2xl text-white/40 mb-2">No Photos Yet</p>
                  <p className="font-manrope text-sm text-white/25">Add image URLs above to build your portfolio showcase.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {photos.map((photo, idx) => (
                    <div key={photo.id} className="group relative aspect-square bg-[#1a1510] border border-white/8 overflow-hidden hover:border-primary/30 transition-all">
                      <img
                        src={photo.url}
                        alt={photo.caption || `Photo ${idx + 1}`}
                        className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                        onClick={() => setLightboxIdx(idx)}
                        onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.pexels.com/photos/3992080/pexels-photo-3992080.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="font-manrope text-xs text-white/90 line-clamp-2">{photo.caption}</p>
                        </div>
                      )}
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/70 border border-red-500/30 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* AVAILABILITY */}
          {tab === "availability" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6">
                <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ Manage Your Calendar ✦</p>
                <h2 className="font-cormorant text-3xl font-light text-white">Availability <span className="text-primary italic font-semibold">Calendar</span></h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <MiniCalendar blockedDates={blockedDates} onBlock={handleBlock} onUnblock={handleUnblock} loading={calLoading} />
                  <div className="flex items-center gap-6 mt-5 pt-4 border-t border-white/8">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500/25 border border-red-500/60 rounded-sm" />
                      <span className="font-manrope text-xs text-white/50">Blocked / Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white/[0.04] border border-white/8 rounded-sm" />
                      <span className="font-manrope text-xs text-white/50">Available</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1510] border border-white/8 p-6">
                  <p className="font-cinzel text-[9px] tracking-[0.25em] text-primary/50 uppercase mb-4">Blocked Dates ({blockedDates.length})</p>
                  {blockedDates.length === 0 ? (
                    <div className="text-center py-10">
                      <CalendarDays className="w-10 h-10 text-white/10 mx-auto mb-3" />
                      <p className="font-manrope text-sm text-white/30">No dates blocked yet. Click any future date on the calendar to mark it as unavailable.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {[...blockedDates].sort((a, b) => a.date.localeCompare(b.date)).map(bd => (
                        <div key={bd.date} className="flex items-center justify-between px-3 py-2.5 bg-red-500/8 border border-red-500/20">
                          <div>
                            <span className="font-mono text-sm text-red-300/80">{bd.date}</span>
                            <span className="font-manrope text-xs text-white/35 ml-3">{bd.reason}</span>
                          </div>
                          <button onClick={() => handleUnblock(bd.date)}
                            className="p-1.5 text-white/30 hover:text-red-400 transition-colors">
                            <XIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* KYC & VERIFY */}
          {tab === "kyc" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">✦ Identity Verification ✦</p>
                  <h2 className="font-cormorant text-3xl font-light text-white">KYC & <span className="text-primary italic font-semibold">Verification</span></h2>
                  <p className="font-manrope text-sm text-white/40 mt-2 max-w-lg">Submit your business documents to earn a Verified badge on your profile. Our team reviews within 48 hours.</p>
                </div>
                {hasApprovedKyc && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-primary/8 border border-primary/25">
                    <BadgeCheck className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-cinzel text-[9px] tracking-[0.15em] text-primary uppercase">Verified Vendor</p>
                      <p className="font-manrope text-xs text-white/40">Badge visible on your profile</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(["gst", "aadhaar", "pan", "portfolio_certificate"] as const).map(docType => {
                  const existing = kycDocs.find(d => d.docType === docType);
                  const stColor = existing ? KYC_STATUS_COLOR[existing.status] ?? "#888" : undefined;
                  return (
                    <div key={docType} className="bg-[#1a1510] border border-white/8 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary/50" />
                          <span className="font-cinzel text-[10px] tracking-[0.2em] text-white/70 uppercase">{KYC_LABELS[docType]}</span>
                        </div>
                        {existing && (
                          <div className="flex items-center gap-1.5 px-2 py-1 border rounded-sm font-cinzel text-[7.5px] tracking-[0.12em] uppercase"
                            style={{ color: stColor, borderColor: stColor + "40", background: stColor + "12" }}>
                            {existing.status === "approved" && <BadgeCheck className="w-3 h-3" />}
                            {existing.status === "pending" && <Clock className="w-3 h-3" />}
                            {existing.status.replace("_", " ")}
                          </div>
                        )}
                      </div>

                      {existing && (
                        <div className="mb-3 px-3 py-2 bg-white/[0.03] border border-white/8 font-mono text-xs text-white/50">{existing.value}</div>
                      )}

                      <input
                        value={kycForm[docType]?.value ?? ""}
                        onChange={e => setKycForm(f => ({ ...f, [docType]: { ...f[docType], value: e.target.value } }))}
                        placeholder={KYC_PLACEHOLDERS[docType]}
                        className="w-full px-3 py-2.5 bg-black/30 border border-white/12 text-white text-sm font-manrope focus:outline-none focus:border-primary/50 mb-2"
                      />
                      <input
                        value={kycForm[docType]?.note ?? ""}
                        onChange={e => setKycForm(f => ({ ...f, [docType]: { ...f[docType], note: e.target.value } }))}
                        placeholder="Additional note (optional)"
                        className="w-full px-3 py-2.5 bg-black/30 border border-white/12 text-white text-sm font-manrope focus:outline-none focus:border-primary/50 mb-3"
                      />
                      <button
                        onClick={() => handleKycSubmit(docType)}
                        disabled={!kycForm[docType]?.value?.trim() || kycSaving[docType]}
                        className="w-full py-2.5 bg-primary/10 border border-primary/30 text-primary font-cinzel text-[9px] tracking-[0.18em] uppercase font-bold hover:bg-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {kycSaving[docType] ? "Submitting…" : kycSaved[docType] ? "✓ Submitted!" : existing ? "Resubmit" : "Submit for Review"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-primary/5 border border-primary/15">
                <p className="font-cinzel text-[9px] tracking-[0.2em] text-primary/60 uppercase mb-2">How it works</p>
                <div className="space-y-2">
                  {["Submit your GST, Aadhaar, PAN, or portfolio certificate above.", "Our team reviews documents within 48 business hours.", "Once approved, a Verified badge appears on your public profile and vendor card."].map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-cinzel text-[9px] text-primary/50 shrink-0 mt-0.5">{i + 1}.</span>
                      <p className="font-manrope text-xs text-white/45">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === "profile" && <ProfileTab user={user} fmt={fmt} initials={initials} />}

          {tab === "payment" && <PaymentTab role="vendor" />}

          {/* SAVED */}
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
                        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accent}50, transparent)` }} />
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}>
                            <Icon className="w-4 h-4" style={{ color: accent }} />
                          </div>
                          <button onClick={() => removeShortlist(item.id)} className="p-1.5 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h3 className="font-cormorant text-lg text-white font-semibold leading-snug mb-1">{item.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-cinzel text-[8px] tracking-widest uppercase px-1.5 py-0.5 border rounded-sm" style={{ color: accent, borderColor: `${accent}30`, background: `${accent}10` }}>{item.type}</span>
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

      {/* Portfolio Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && photos[lightboxIdx] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxIdx(null)}>
            <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white border border-white/15 bg-black/50"
              onClick={() => setLightboxIdx(null)}>
              <XIcon className="w-5 h-5" />
            </button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white border border-white/15 bg-black/50 disabled:opacity-30"
              disabled={lightboxIdx === 0}
              onClick={e => { e.stopPropagation(); setLightboxIdx(i => Math.max(0, (i ?? 0) - 1)); }}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <motion.img
              key={lightboxIdx}
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              src={photos[lightboxIdx].url}
              alt={photos[lightboxIdx].caption}
              className="max-w-4xl w-full max-h-[80vh] object-contain"
              onClick={e => e.stopPropagation()}
            />
            <button className="absolute right-16 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white border border-white/15 bg-black/50 disabled:opacity-30"
              disabled={lightboxIdx === photos.length - 1}
              onClick={e => { e.stopPropagation(); setLightboxIdx(i => Math.min(photos.length - 1, (i ?? 0) + 1)); }}>
              <ChevronRight className="w-5 h-5" />
            </button>
            {photos[lightboxIdx].caption && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 border border-white/10">
                <p className="font-manrope text-sm text-white/80">{photos[lightboxIdx].caption}</p>
              </div>
            )}
            <div className="absolute bottom-4 right-4 font-cinzel text-[9px] tracking-widest text-white/30">{lightboxIdx + 1} / {photos.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
