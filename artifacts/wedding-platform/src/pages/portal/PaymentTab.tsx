import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, CreditCard, Zap, Crown, X, Smartphone,
  CheckCircle2, Star, BadgeCheck, ShieldCheck, Sparkles, Download,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/* ─── Plan definitions ─────────────────────────────────────────── */
const BUSINESS_PLANS = [
  {
    id: "basic",
    name: "Basic",
    icon: Zap,
    price: { monthly: 0, annual: 0 },
    badge: null as string | null,
    accent: "#ffffff40",
    features: [
      "Listed in the directory",
      "Receive enquiries from customers",
      "Basic profile page",
      "Email support",
    ],
    missing: ["Verified Partner badge", "Priority placement", "Analytics"],
  },
  {
    id: "essential",
    name: "Essential",
    icon: BadgeCheck,
    price: { monthly: 2999, annual: 29999 },
    badge: "Most Popular",
    accent: "#d4af37",
    features: [
      "Everything in Basic",
      "✦ Verified Partner badge",
      "Priority listing placement",
      "Contact details unlocked for members",
      "Performance analytics",
      "WhatsApp priority support",
    ],
    missing: ["Homepage featured slot", "Dedicated account manager"],
  },
  {
    id: "premium",
    name: "Premium",
    icon: Crown,
    price: { monthly: 5999, annual: 59999 },
    badge: "Best Value",
    accent: "#c0a0ff",
    features: [
      "Everything in Essential",
      "Homepage featured placement",
      "Dedicated account manager",
      "24 / 7 priority support",
      "Custom profile URL",
      "Lead quality guarantee",
    ],
    missing: [],
  },
];

const CUSTOMER_PLANS = [
  {
    id: "guest",
    name: "Guest",
    icon: Zap,
    price: { monthly: 0, annual: 0 },
    badge: null as string | null,
    accent: "#ffffff40",
    features: [
      "Browse all vendor & venue listings",
      "Send unlimited enquiries",
      "Save to shortlist",
    ],
    missing: ["View contact details", "Direct call / WhatsApp"],
  },
  {
    id: "member",
    name: "Member",
    icon: Star,
    price: { monthly: 499, annual: 4999 },
    badge: "Unlock Full Access",
    accent: "#d4af37",
    features: [
      "Everything in Guest",
      "✦ View all contact details",
      "Direct call & WhatsApp access",
      "Priority enquiry placement",
      "Exclusive member-only deals",
    ],
    missing: [],
  },
];

/* ─── Mock payment history ───────────────────────────────────────── */
const MOCK_HISTORY = [
  { id: "TXN-4821", date: "01 May 2026",  plan: "Essential Monthly",  amount: 2999, status: "success", method: "Card •••• 4242" },
  { id: "TXN-4720", date: "01 Apr 2026",  plan: "Essential Monthly",  amount: 2999, status: "success", method: "Card •••• 4242" },
  { id: "TXN-4598", date: "01 Mar 2026",  plan: "Essential Monthly",  amount: 2999, status: "success", method: "UPI · pay@bms" },
  { id: "TXN-4401", date: "01 Feb 2026",  plan: "Basic (Free)",       amount: 0,    status: "free",    method: "—" },
];

const CUSTOMER_HISTORY = [
  { id: "TXN-9012", date: "01 May 2026",  plan: "Member Monthly", amount: 499, status: "success", method: "UPI · user@okaxis" },
  { id: "TXN-8901", date: "01 Apr 2026",  plan: "Member Monthly", amount: 499, status: "success", method: "Card •••• 5678" },
];

/* ─── Helpers ────────────────────────────────────────────────────── */
function fmt(n: number) {
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}
function fmtCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function fmtExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

/* ─── Receipt generator ─────────────────────────────────────────── */
type TxnRow = { id: string; date: string; plan: string; amount: number; status: string; method: string };

function downloadReceipt(txn: TxnRow, userName: string, userEmail: string) {
  const gstRate = 0.18;
  const base   = Math.round(txn.amount / (1 + gstRate));
  const gst    = txn.amount - base;
  const fmtAmt = (n: number) =>
    n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Receipt ${txn.id} — Book My Squad</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #fff; color: #1a1a1a; padding: 48px; max-width: 720px; margin: 0 auto; }
  .logo-line { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
  .logo { font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; color: #1a1a1a; letter-spacing: 0.02em; }
  .logo span { color: #b8960c; font-style: italic; }
  .badge { font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #b8960c; border: 1px solid #b8960c40; padding: 4px 10px; }
  .gold-rule { height: 2px; background: linear-gradient(90deg, transparent, #d4af37, transparent); margin-bottom: 36px; }
  .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; }
  .invoice-title { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 400; color: #1a1a1a; }
  .invoice-meta { text-align: right; }
  .invoice-meta p { font-size: 12px; color: #555; margin-bottom: 4px; }
  .invoice-meta strong { color: #1a1a1a; font-weight: 600; }
  .status-badge { display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; padding: 3px 10px; border-radius: 2px; background: #16a34a15; color: #16a34a; border: 1px solid #16a34a30; margin-top: 6px; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 36px; }
  .section-label { font-size: 9px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: #999; margin-bottom: 8px; }
  .section-value { font-size: 14px; color: #1a1a1a; line-height: 1.6; }
  .section-value strong { font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  thead tr { background: #f5f0e8; }
  th { padding: 10px 14px; font-size: 9px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #777; text-align: left; }
  tbody td { padding: 14px 14px; font-size: 13px; border-bottom: 1px solid #f0ebe2; }
  .amount-col { text-align: right; font-weight: 600; font-size: 14px; }
  .subtotal-block { margin-top: 4px; border-top: 1px solid #e8e0d0; }
  .subtotal-row { display: flex; justify-content: space-between; padding: 8px 14px; font-size: 12px; color: #555; }
  .subtotal-row.total { font-size: 16px; font-weight: 700; color: #1a1a1a; background: #f5f0e8; padding: 12px 14px; }
  .subtotal-row.total span:last-child { color: #b8960c; }
  .method-row { display: flex; align-items: center; gap: 8px; margin-top: 24px; padding: 12px 14px; background: #f9f6ef; border: 1px solid #e8e0d0; }
  .method-row p { font-size: 11px; color: #666; }
  .method-row strong { color: #1a1a1a; font-weight: 600; }
  .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e8e0d0; display: flex; justify-content: space-between; align-items: flex-end; }
  .footer-brand { font-family: 'Playfair Display', Georgia, serif; font-size: 13px; color: #999; }
  .footer-brand span { color: #b8960c; font-style: italic; }
  .footer-note { font-size: 10px; color: #aaa; text-align: right; line-height: 1.6; }
  @media print {
    body { padding: 32px; }
    @page { margin: 0.6in; size: A4; }
  }
</style>
</head>
<body>
  <div class="logo-line">
    <div class="logo"><span>Book</span> My Squad</div>
    <div class="badge">Tax Invoice</div>
  </div>
  <div class="gold-rule"></div>

  <div class="invoice-header">
    <div>
      <div class="invoice-title">Invoice</div>
      <p style="font-size:13px;color:#555;margin-top:4px;">India's Finest Event Planning Platform</p>
    </div>
    <div class="invoice-meta">
      <p>Invoice No: <strong>${txn.id}</strong></p>
      <p>Date: <strong>${txn.date}</strong></p>
      <p>GSTIN: <strong>27AABCU9603R1ZX</strong></p>
      <span class="status-badge">${txn.status === "success" ? "Paid" : txn.status}</span>
    </div>
  </div>

  <div class="grid2">
    <div>
      <div class="section-label">Billed To</div>
      <div class="section-value">
        <strong>${userName}</strong><br/>
        ${userEmail}<br/>
        India
      </div>
    </div>
    <div>
      <div class="section-label">From</div>
      <div class="section-value">
        <strong>Book My Squad Pvt. Ltd.</strong><br/>
        Mumbai, Maharashtra 400001<br/>
        support@bookmysquad.in
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:50%">Description</th>
        <th>Period</th>
        <th class="amount-col">Amount (excl. GST)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${txn.plan}</strong><br/><span style="font-size:11px;color:#777">Book My Squad Platform Subscription</span></td>
        <td style="font-size:12px;color:#555">${txn.date}</td>
        <td class="amount-col">${fmtAmt(base)}</td>
      </tr>
    </tbody>
  </table>

  <div class="subtotal-block">
    <div class="subtotal-row"><span>Subtotal</span><span>${fmtAmt(base)}</span></div>
    <div class="subtotal-row"><span>GST @ 18% (SAC 998314)</span><span>${fmtAmt(gst)}</span></div>
    <div class="subtotal-row total"><span>Total Amount Payable</span><span>${fmtAmt(txn.amount)}</span></div>
  </div>

  <div class="method-row">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8960c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
    <p>Payment via: <strong>${txn.method}</strong></p>
  </div>

  <div class="footer">
    <div class="footer-brand"><span>Book</span> My Squad</div>
    <div class="footer-note">
      This is a computer-generated invoice. No signature required.<br/>
      For queries: support@bookmysquad.in · +91 98765 43210
    </div>
  </div>

  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, "_blank", "width=800,height=900,scrollbars=yes");
  if (!win) {
    const a = document.createElement("a");
    a.href = url; a.download = `Receipt-${txn.id}.html`; a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/* ─── Component ─────────────────────────────────────────────────── */
interface Props { role: "vendor" | "venue" | "user" }

export function PaymentTab({ role }: Props) {
  const { user } = useAuth();
  const isCustomer = role === "user";
  const plans = isCustomer ? CUSTOMER_PLANS : BUSINESS_PLANS;
  const history = isCustomer ? CUSTOMER_HISTORY : MOCK_HISTORY;
  const userName  = user?.name  ?? "Valued Customer";
  const userEmail = user?.email ?? "";

  const [billing, setBilling]           = useState<"monthly" | "annual">("monthly");
  const [currentPlan, setCurrentPlan]   = useState(isCustomer ? "guest" : "basic");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showModal, setShowModal]       = useState(false);
  const [payMethod, setPayMethod]       = useState<"card" | "upi">("card");
  const [cardNum, setCardNum]           = useState("");
  const [expiry, setExpiry]             = useState("");
  const [cvv, setCvv]                   = useState("");
  const [nameOnCard, setNameOnCard]     = useState("");
  const [upiId, setUpiId]               = useState("");
  const [payState, setPayState]         = useState<"idle" | "processing" | "success">("idle");

  const selectedPlanObj = plans.find(p => p.id === selectedPlan);

  const openPayModal = (planId: string) => {
    setSelectedPlan(planId);
    setPayState("idle");
    setCardNum(""); setExpiry(""); setCvv(""); setNameOnCard(""); setUpiId("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (payState === "processing") return;
    setShowModal(false);
    setSelectedPlan(null);
  };

  const handlePay = async () => {
    setPayState("processing");
    await new Promise(r => setTimeout(r, 2200));
    setPayState("success");
    setCurrentPlan(selectedPlan!);
    setTimeout(() => {
      setShowModal(false);
      setPayState("idle");
    }, 3500);
  };

  const canPay = payMethod === "card"
    ? cardNum.replace(/\s/g, "").length === 16 && expiry.length === 5 && cvv.length === 3 && nameOnCard.trim().length > 1
    : upiId.includes("@");

  const INPUT = "w-full bg-white/[0.05] border border-white/10 focus:border-primary/50 outline-none px-4 py-3 font-manrope text-sm text-white placeholder:text-white/25 transition-colors rounded-sm";

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div className="mb-8">
        <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/50 uppercase mb-1">
          ✦ {isCustomer ? "Membership" : "Subscription"} ✦
        </p>
        <h2 className="font-cormorant text-3xl font-light text-white">
          Plans &amp; <span className="text-primary italic font-semibold">Billing</span>
        </h2>
        <p className="font-manrope text-sm text-white/40 mt-2">
          {isCustomer
            ? "Upgrade your membership to unlock direct contact with vendors and venues."
            : "Choose a plan that grows your business on the Book My Squad platform."}
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center gap-3 mb-8">
        <span className={`font-cinzel text-[10px] tracking-[0.2em] uppercase transition-colors ${billing === "monthly" ? "text-primary" : "text-white/30"}`}>Monthly</span>
        <button
          onClick={() => setBilling(b => b === "monthly" ? "annual" : "monthly")}
          className={`relative w-11 h-6 rounded-full border transition-all duration-300 ${billing === "annual" ? "bg-primary/20 border-primary/50" : "bg-white/5 border-white/15"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all duration-300 ${billing === "annual" ? "translate-x-5 bg-primary" : "bg-white/30"}`} />
        </button>
        <span className={`font-cinzel text-[10px] tracking-[0.2em] uppercase transition-colors ${billing === "annual" ? "text-primary" : "text-white/30"}`}>Annual</span>
        {billing === "annual" && (
          <span className="font-cinzel text-[8px] tracking-[0.15em] uppercase text-green-400 bg-green-400/10 border border-green-400/25 px-2 py-0.5 rounded-sm">
            Save ~17%
          </span>
        )}
      </div>

      {/* Plan cards */}
      <div className={`grid gap-5 mb-12 ${isCustomer ? "grid-cols-1 md:grid-cols-2 max-w-3xl" : "grid-cols-1 md:grid-cols-3"}`}>
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const price = billing === "annual" ? plan.price.annual : plan.price.monthly;
          const Icon = plan.icon;

          return (
            <div
              key={plan.id}
              className="relative overflow-hidden border transition-all duration-300"
              style={{
                background: isCurrent
                  ? `linear-gradient(145deg, ${plan.accent}0d 0%, #0d0a0799 100%)`
                  : "linear-gradient(145deg, #1a150f 0%, #0d0a07 100%)",
                borderColor: isCurrent ? plan.accent + "60" : "#ffffff12",
                boxShadow: isCurrent ? `0 0 40px ${plan.accent}12, 0 8px 32px rgba(0,0,0,0.5)` : "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              {/* Top line */}
              <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${plan.accent}, transparent)` }} />

              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-3 right-3">
                  <span className="font-cinzel text-[7px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm"
                    style={{ color: plan.accent, background: `${plan.accent}15`, border: `1px solid ${plan.accent}35` }}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Icon + name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-sm flex items-center justify-center"
                    style={{ background: `${plan.accent}15`, border: `1px solid ${plan.accent}25` }}>
                    <Icon className="w-4 h-4" style={{ color: plan.accent }} />
                  </div>
                  <div>
                    <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase" style={{ color: plan.accent }}>{plan.name}</span>
                    {isCurrent && <span className="ml-2 font-cinzel text-[7px] tracking-widest uppercase text-green-400 bg-green-400/10 border border-green-400/20 px-1.5 py-0.5 rounded-sm">Active</span>}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5">
                  {price === 0 ? (
                    <div className="font-cormorant text-4xl font-semibold text-white">Free</div>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="font-cormorant text-4xl font-semibold" style={{ color: plan.accent }}>
                        {fmt(price)}
                      </span>
                      <span className="font-manrope text-xs text-white/30 mb-1.5">/{billing === "annual" ? "yr" : "mo"}</span>
                    </div>
                  )}
                  {billing === "annual" && price > 0 && (
                    <p className="font-manrope text-[11px] text-white/30 mt-0.5">{fmt(Math.round(price / 12))}/month billed annually</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: plan.accent }} />
                      <span className="font-manrope text-xs text-white/60 leading-snug">{f}</span>
                    </li>
                  ))}
                  {("missing" in plan ? plan.missing : []).map((f, i) => (
                    <li key={`m-${i}`} className="flex items-start gap-2.5 opacity-35">
                      <X className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/40" />
                      <span className="font-manrope text-xs text-white/30 leading-snug line-through">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isCurrent ? (
                  <div className="w-full py-3 border border-green-400/25 bg-green-400/5 text-center">
                    <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-green-400">✓ Current Plan</span>
                  </div>
                ) : price === 0 ? (
                  <div className="w-full py-3 border border-white/10 text-center">
                    <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-white/30">Free Plan</span>
                  </div>
                ) : (
                  <button
                    onClick={() => openPayModal(plan.id)}
                    className="w-full py-3.5 font-cinzel font-bold text-[10px] tracking-[0.2em] uppercase transition-all duration-300 rounded-sm hover:scale-[1.02]"
                    style={{
                      background: `linear-gradient(135deg, ${plan.accent} 0%, ${plan.accent}cc 100%)`,
                      color: plan.accent === "#d4af37" ? "#000" : "#fff",
                      boxShadow: `0 4px 20px ${plan.accent}30`,
                    }}
                  >
                    Upgrade to {plan.name} →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment history */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <CreditCard className="w-4 h-4 text-primary/50" />
          <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/50 uppercase">Payment History</p>
        </div>
        <div className="bg-[#1a1510] border border-white/8 overflow-hidden">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="font-manrope text-sm text-white/25">No transactions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8">
                    {["Transaction ID", "Date", "Plan", "Amount", "Method", "Status", ""].map(h => (
                      <th key={h} className="py-3 px-4 font-cinzel text-[8px] tracking-[0.2em] text-white/30 uppercase text-left whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((t, i) => (
                    <tr key={t.id} className={`border-b border-white/5 hover:bg-white/[0.02] ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
                      <td className="py-3 px-4 font-mono text-xs text-primary/60">{t.id}</td>
                      <td className="py-3 px-4 font-manrope text-xs text-white/50">{t.date}</td>
                      <td className="py-3 px-4 font-manrope text-sm text-white/70">{t.plan}</td>
                      <td className="py-3 px-4 font-cormorant text-base text-white font-semibold">
                        {t.amount === 0 ? "—" : fmt(t.amount)}
                      </td>
                      <td className="py-3 px-4 font-manrope text-xs text-white/40">{t.method}</td>
                      <td className="py-3 px-4">
                        <span className={`font-cinzel text-[7px] uppercase tracking-wider px-2 py-0.5 border rounded-sm ${
                          t.status === "success" ? "text-green-400 border-green-400/30 bg-green-400/8"
                          : t.status === "free" ? "text-white/30 border-white/15 bg-white/3"
                          : "text-red-400 border-red-400/30 bg-red-400/8"
                        }`}>{t.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        {t.amount > 0 && t.status === "success" ? (
                          <button
                            onClick={() => downloadReceipt(t, userName, userEmail)}
                            title="Download PDF receipt"
                            className="group flex items-center gap-1.5 font-cinzel text-[8px] tracking-[0.15em] uppercase text-white/25 hover:text-primary transition-colors"
                          >
                            <Download className="w-3 h-3 group-hover:translate-y-[1px] transition-transform" />
                            <span className="hidden sm:inline">Receipt</span>
                          </button>
                        ) : (
                          <span className="text-white/10 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Payment Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && selectedPlanObj && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative w-full max-w-md bg-[#0d0a07] border border-white/10 shadow-2xl overflow-hidden">
                {/* Top gold line */}
                <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${selectedPlanObj.accent}, transparent)` }} />

                {payState === "success" ? (
                  /* ── SUCCESS ── */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-10 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 16, stiffness: 260, delay: 0.15 }}
                    >
                      <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-5" />
                    </motion.div>
                    <h3 className="font-cormorant text-3xl text-white font-semibold mb-2">Payment Successful!</h3>
                    <p className="font-manrope text-sm text-white/50 mb-4">
                      Welcome to the <strong className="text-primary">{selectedPlanObj.name}</strong> plan. Your account has been upgraded.
                    </p>
                    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-primary/8 border border-primary/20 rounded-sm">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-cinzel text-[9px] tracking-[0.2em] text-primary uppercase">
                        {selectedPlanObj.id !== "guest" && selectedPlanObj.id !== "basic"
                          ? "Your Verified badge is now live"
                          : "Enjoy your upgraded experience"}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                      <div>
                        <p className="font-cinzel text-[8px] tracking-[0.25em] text-white/30 uppercase mb-0.5">Upgrade to</p>
                        <h3 className="font-cormorant text-xl text-white font-semibold">{selectedPlanObj.name} Plan</h3>
                      </div>
                      <div className="text-right">
                        <div className="font-cormorant text-2xl font-semibold" style={{ color: selectedPlanObj.accent }}>
                          {fmt(billing === "annual" ? selectedPlanObj.price.annual : selectedPlanObj.price.monthly)}
                        </div>
                        <p className="font-manrope text-[10px] text-white/30">/{billing === "annual" ? "year" : "month"}</p>
                      </div>
                      <button onClick={closeModal} className="absolute top-4 right-4 p-1.5 text-white/30 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-6 space-y-5">
                      {/* Pay method toggle */}
                      <div className="flex gap-2">
                        {(["card", "upi"] as const).map(m => (
                          <button key={m} onClick={() => setPayMethod(m)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 border font-cinzel text-[9px] tracking-[0.15em] uppercase transition-all rounded-sm ${
                              payMethod === m ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-white/35 hover:border-white/20"
                            }`}>
                            {m === "card" ? <CreditCard className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                            {m === "card" ? "Card" : "UPI"}
                          </button>
                        ))}
                      </div>

                      {/* Card form */}
                      {payMethod === "card" && (
                        <div className="space-y-3">
                          <input
                            className={INPUT}
                            placeholder="Name on card"
                            value={nameOnCard}
                            onChange={e => setNameOnCard(e.target.value)}
                          />
                          <input
                            className={INPUT + " tracking-widest"}
                            placeholder="1234 5678 9012 3456"
                            value={cardNum}
                            onChange={e => setCardNum(fmtCard(e.target.value))}
                            maxLength={19}
                          />
                          <div className="flex gap-3">
                            <input
                              className={INPUT}
                              placeholder="MM/YY"
                              value={expiry}
                              onChange={e => setExpiry(fmtExpiry(e.target.value))}
                              maxLength={5}
                            />
                            <input
                              className={INPUT}
                              placeholder="CVV"
                              value={cvv}
                              type="password"
                              onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                              maxLength={3}
                            />
                          </div>
                        </div>
                      )}

                      {/* UPI form */}
                      {payMethod === "upi" && (
                        <div className="space-y-3">
                          <input
                            className={INPUT}
                            placeholder="yourname@upi"
                            value={upiId}
                            onChange={e => setUpiId(e.target.value)}
                          />
                          <p className="font-manrope text-[11px] text-white/30">
                            Supports PhonePe, Google Pay, Paytm, BHIM and all UPI apps.
                          </p>
                          <div className="flex items-center gap-2 p-3 bg-white/[0.03] border border-white/8 rounded-sm">
                            <Smartphone className="w-4 h-4 text-primary/50" />
                            <span className="font-manrope text-xs text-white/40">
                              A payment request will be sent to your UPI app for approval.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Security note */}
                      <div className="flex items-center gap-2 py-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-400/60 shrink-0" />
                        <span className="font-manrope text-[10px] text-white/25">
                          256-bit SSL encrypted · PCI DSS compliant · Cancel anytime
                        </span>
                      </div>

                      {/* Pay button */}
                      <button
                        onClick={handlePay}
                        disabled={!canPay || payState === "processing"}
                        className="w-full py-4 font-cinzel font-bold text-[11px] tracking-[0.25em] uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
                        style={{
                          background: canPay
                            ? `linear-gradient(135deg, ${selectedPlanObj.accent} 0%, ${selectedPlanObj.accent}cc 100%)`
                            : "#ffffff15",
                          color: selectedPlanObj.accent === "#d4af37" ? "#000" : "#fff",
                          boxShadow: canPay ? `0 4px 24px ${selectedPlanObj.accent}35` : "none",
                        }}
                      >
                        {payState === "processing" ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.span
                              className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full inline-block"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                            />
                            Processing…
                          </span>
                        ) : (
                          `Pay ${fmt(billing === "annual" ? selectedPlanObj.price.annual : selectedPlanObj.price.monthly)}`
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
