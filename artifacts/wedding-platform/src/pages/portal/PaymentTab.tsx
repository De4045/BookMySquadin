import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, CreditCard, Zap, Crown, X, Smartphone,
  CheckCircle2, Star, BadgeCheck, ShieldCheck, Sparkles,
} from "lucide-react";

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

/* ─── Component ─────────────────────────────────────────────────── */
interface Props { role: "vendor" | "venue" | "user" }

export function PaymentTab({ role }: Props) {
  const isCustomer = role === "user";
  const plans = isCustomer ? CUSTOMER_PLANS : BUSINESS_PLANS;
  const history = isCustomer ? CUSTOMER_HISTORY : MOCK_HISTORY;

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
                    {["Transaction ID", "Date", "Plan", "Amount", "Method", "Status"].map(h => (
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
