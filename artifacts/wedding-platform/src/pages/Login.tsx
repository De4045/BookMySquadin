import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Mail, FileText, ExternalLink, AlertCircle } from "lucide-react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import bmsLogo from "@assets/WhatsApp_Image_2026-05-06_at_4.23.32_PM-removebg-preview_1778229042227.png";
import { useAuth } from "@/context/AuthContext";

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -24, transition: { duration: 0.35 } },
};

const fieldVariants = {
  initial: { opacity: 0, height: 0, marginBottom: 0 },
  animate: { opacity: 1, height: "auto", marginBottom: 16, transition: { duration: 0.35 } },
  exit: { opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.25 } },
};

function FloatingInput({
  id, label, type = "text", placeholder, value, onChange, required = false,
  icon: Icon, rightEl,
}: {
  id: string; label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; required?: boolean;
  icon: React.ElementType; rightEl?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block font-cinzel text-[10px] tracking-[0.3em] text-primary/70 uppercase mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
          autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : "name"}
          className={`
            w-full h-13 pl-11 pr-${rightEl ? "11" : "4"} py-3.5
            bg-white/[0.04] border border-white/10
            font-manrope text-sm text-white placeholder:text-white/25
            focus:outline-none focus:border-primary/60 focus:bg-white/[0.06]
            transition-all duration-300 rounded-sm
          `}
          style={{ paddingRight: rightEl ? "3rem" : "1rem" }}
        />
        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
        )}
      </div>
    </div>
  );
}

export default function Login() {
  const [, navigate] = useLocation();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "vendor" | "venue">("user");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successName, setSuccessName] = useState("");
  const [gstin, setGstin] = useState("");
  const [gstinValid, setGstinValid] = useState<null | boolean>(null);

  const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const GSTIN_PORTAL = "https://services.gst.gov.in/services/searchtp";

  const handleGstinChange = (v: string) => {
    const upper = v.toUpperCase();
    setGstin(upper);
    setGstinValid(upper.length === 0 ? null : GSTIN_REGEX.test(upper));
  };

  const isSignUp = tab === "signup";

  const pwdChecks = useMemo(() => [
    { label: "8+ characters",      pass: password.length >= 8 },
    { label: "Uppercase letter",    pass: /[A-Z]/.test(password) },
    { label: "Number",              pass: /\d/.test(password) },
    { label: "Special character",   pass: /[!@#$%^&*()\-_=+[\]{}|;:,.<>?/~`]/.test(password) },
  ], [password]);

  const pwdStrength = pwdChecks.filter((c) => c.pass).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let userData;
      if (isSignUp) {
        if (!pwdChecks.every((c) => c.pass)) {
          throw new Error("Please meet all password requirements before continuing.");
        }
        userData = await register(name.trim(), email.trim(), password, role);
      } else {
        userData = await login(email.trim(), password);
      }
      setSuccessName(userData.name.split(" ")[0]);
      setSuccess(true);
      const redirectTo =
        userData.role === "admin"  ? "/portal/admin" :
        userData.role === "vendor" ? "/portal/vendor" :
        userData.role === "venue"  ? "/portal/venue"  : "/";
      setTimeout(() => navigate(redirectTo), 2000);
    } catch (err) {
      toast({
        title: isSignUp ? "Registration Failed" : "Sign In Failed",
        description: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ── Success Screen ── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080604] font-sans overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_65%)]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center px-8 relative z-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
            className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/50 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(212,175,55,0.25)]"
          >
            <CheckCircle className="w-12 h-12 text-primary" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4">✦ Welcome ✦</p>
            <div className="w-12 h-px bg-primary/40 mx-auto mb-6" />
            <h2 className="font-cormorant text-5xl md:text-6xl text-white font-light mb-3">
              Namaste, <span className="text-primary italic font-semibold capitalize">{successName}</span>!
            </h2>
            <p className="font-manrope text-white/45 text-sm mt-4 mb-8">Taking you to your dashboard...</p>
            <div className="w-48 h-0.5 bg-white/8 mx-auto rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary/60 to-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "linear" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  /* ── Login/Register Form ── */
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen flex font-sans bg-[#080604] overflow-hidden"
    >
      {/* LEFT — cinematic image panel */}
      <div className="hidden lg:flex lg:w-[48%] relative items-end justify-start bg-[#050403] overflow-hidden">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4 }}
          src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&q=90"
          alt="Wedding"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050403] via-[#050403]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080604]/60" />
        {/* Gold top strip */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent" />

        {/* Content */}
        <div className="relative z-10 px-12 pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
            <p className="font-cinzel text-[9px] tracking-[0.5em] text-primary/60 uppercase mb-3">✦ Premium Platform ✦</p>
            <div className="w-10 h-px bg-primary/50 mb-5" />
            <h1 className="font-cormorant text-4xl xl:text-5xl text-white font-light leading-[1.15] mb-5">
              India's Finest<br />
              <span className="text-primary italic font-semibold">Wedding Planning</span><br />
              Platform
            </h1>
            <p className="font-manrope text-white/45 text-sm leading-relaxed max-w-xs mb-10">
              Access 436+ curated venues, 255+ verified vendors, and your complete wedding planning toolkit.
            </p>

            <div className="flex gap-10">
              {[["436+", "Venues"], ["255+", "Vendors"], ["24+", "Cities"]].map(([n, l]) => (
                <div key={l}>
                  <div className="font-cormorant text-2xl text-primary font-semibold">{n}</div>
                  <div className="font-manrope text-[9px] text-white/35 uppercase tracking-wider mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-12 relative">
        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-primary/[0.04] rounded-full blur-3xl pointer-events-none" />

        {/* Back to home — mobile */}
        <Link
          href="/"
          className="absolute top-5 left-5 flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.2em] text-white/40 hover:text-primary transition-colors uppercase lg:hidden"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo — desktop back link */}
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <img
              src={bmsLogo}
              alt="Book My Squad"
              className="h-12 w-12 object-contain transition-transform group-hover:scale-105"
              style={{ mixBlendMode: "screen", filter: "brightness(1.3) saturate(1.2)" }}
            />
            <span className="font-cormorant text-2xl text-white font-semibold">
              <span className="text-primary italic">Book</span> My Squad
            </span>
          </Link>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mb-8"
            >
              <h2 className="font-cormorant text-4xl text-white font-light mb-1">
                {isSignUp ? (
                  <>Create <span className="text-primary italic font-semibold">Account</span></>
                ) : (
                  <>Welcome <span className="text-primary italic font-semibold">Back</span></>
                )}
              </h2>
              <p className="font-manrope text-white/40 text-sm">
                {isSignUp
                  ? "Join thousands of couples planning their dream wedding."
                  : "Sign in to access your wedding planning dashboard."}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Tab switcher */}
          <div className="flex rounded-sm bg-white/[0.04] border border-white/8 p-1 mb-8 gap-1">
            {(["signin", "signup"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 font-cinzel text-[10px] tracking-[0.2em] uppercase rounded-sm transition-all duration-300 ${
                  tab === t
                    ? "bg-primary text-black font-bold shadow-sm"
                    : "text-white/45 hover:text-white/70"
                }`}
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {isSignUp && (
                <motion.div key="name-field" variants={fieldVariants} initial="initial" animate="animate" exit="exit">
                  <FloatingInput
                    id="name" label="Full Name" type="text"
                    placeholder="Your full name"
                    value={name} onChange={setName}
                    icon={User} required={isSignUp}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isSignUp && (
                <motion.div key="role-field" variants={fieldVariants} initial="initial" animate="animate" exit="exit">
                  <label className="block font-cinzel text-[10px] tracking-[0.3em] text-primary/70 uppercase mb-3">
                    I am a…
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: "user",   label: "Couple",       sub: "Planning a wedding" },
                      { value: "vendor", label: "Vendor",       sub: "Photographer, makeup…" },
                      { value: "venue",  label: "Venue Manager",sub: "Hotel, resort, hall…" },
                    ] as const).map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRole(opt.value)}
                        className={`flex flex-col items-center text-center px-2 py-3 border rounded-sm transition-all duration-200 ${
                          role === opt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-white/10 bg-white/[0.03] text-white/45 hover:border-primary/30 hover:text-white/65"
                        }`}
                      >
                        <span className="font-cinzel text-[9px] tracking-[0.15em] uppercase leading-tight">{opt.label}</span>
                        <span className="font-manrope text-[9px] text-white/30 mt-1 leading-tight">{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isSignUp && role === "vendor" && (
                <motion.div key="gstin-field" variants={fieldVariants} initial="initial" animate="animate" exit="exit">
                  <div className="space-y-3 p-4 bg-primary/5 border border-primary/20 rounded-sm">
                    <div className="flex items-center justify-between">
                      <label className="block font-cinzel text-[10px] tracking-[0.3em] text-primary/80 uppercase">
                        GSTIN — GST Identification Number
                      </label>
                      <a
                        href="https://services.gst.gov.in/services/searchtp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 font-cinzel text-[8px] tracking-[0.15em] uppercase text-primary/70 hover:text-primary border border-primary/25 hover:border-primary/50 px-2 py-1 transition-all"
                      >
                        Verify Status <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. 27AAPFU0939F1ZV"
                        maxLength={15}
                        value={gstin}
                        onChange={e => handleGstinChange(e.target.value)}
                        className={`
                          w-full h-13 pl-11 pr-4 py-3.5
                          bg-white/[0.04] border font-mono tracking-widest uppercase
                          font-manrope text-sm text-white placeholder:text-white/25
                          focus:outline-none focus:bg-white/[0.06] transition-all duration-300 rounded-sm
                          ${gstin.length > 0
                            ? gstinValid === true
                              ? "border-green-500/50 focus:border-green-500/70"
                              : gstinValid === false
                              ? "border-red-500/50 focus:border-red-500/70"
                              : "border-white/10"
                            : "border-white/10 focus:border-primary/60"}
                        `}
                      />
                    </div>
                    {gstin.length > 0 && (
                      <p className={`font-manrope text-[11px] flex items-center gap-1.5 ${gstinValid ? "text-green-400/80" : "text-red-400/80"}`}>
                        {gstinValid === true ? (
                          <><CheckCircle className="w-3 h-3 shrink-0" /> Valid format — verify Active status on the GST portal</>
                        ) : (
                          <><AlertCircle className="w-3 h-3 shrink-0" /> Must be exactly 15 alphanumeric characters</>
                        )}
                      </p>
                    )}
                    <p className="font-manrope text-[11px] text-white/35 leading-snug flex items-start gap-1.5">
                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5 text-primary/40" />
                      Only vendors with an <strong className="text-white/55">Active GST status</strong> will receive a Verified badge. You can enter this later, but early submission speeds up approval.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <FloatingInput
              id="email" label="Email Address" type="email"
              placeholder="you@example.com"
              value={email} onChange={setEmail}
              icon={Mail} required
            />

            <FloatingInput
              id="password" label="Password"
              type={showPwd ? "text" : "password"}
              placeholder={isSignUp ? "Minimum 8 characters" : "Enter your password"}
              value={password} onChange={setPassword}
              icon={Lock} required
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  className="text-white/30 hover:text-white/60 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {isSignUp && password.length > 0 && (
              <div className="space-y-2.5 -mt-1">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                        i < pwdStrength
                          ? pwdStrength === 1 ? "bg-red-500"
                          : pwdStrength === 2 ? "bg-orange-400"
                          : pwdStrength === 3 ? "bg-yellow-400"
                          : "bg-green-400"
                          : "bg-white/12"
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {pwdChecks.map((c) => (
                    <div
                      key={c.label}
                      className={`flex items-center gap-1.5 font-manrope text-[10px] transition-colors duration-200 ${
                        c.pass ? "text-green-400" : "text-white/30"
                      }`}
                    >
                      {c.pass ? (
                        <CheckCircle className="w-2.5 h-2.5 shrink-0" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full border border-white/25 shrink-0" />
                      )}
                      {c.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  className="font-manrope text-xs text-primary/70 hover:text-primary transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              className="w-full h-13 py-4 bg-primary text-black font-cinzel font-bold text-[11px] tracking-[0.25em] uppercase hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-sm shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.35)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <motion.span
                    className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full inline-block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                  />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </span>
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#080604] px-4 font-cinzel text-[9px] tracking-[0.3em] text-white/25 uppercase">or continue with</span>
            </div>
          </div>

          {/* Social buttons */}
          <div className="flex gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => toast({ title: "Coming Soon", description: "Facebook sign-in will be available soon. Please use email to continue." })}
              className="flex-1 h-11 flex items-center justify-center gap-2.5 bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:border-white/25 hover:bg-white/[0.07] transition-all duration-300 rounded-sm font-manrope text-sm"
            >
              <FaFacebook className="w-4 h-4 text-[#4267B2]" />
              Facebook
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => toast({ title: "Coming Soon", description: "Google sign-in will be available soon. Please use email to continue." })}
              className="flex-1 h-11 flex items-center justify-center gap-2.5 bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:border-white/25 hover:bg-white/[0.07] transition-all duration-300 rounded-sm font-manrope text-sm"
            >
              <FaGoogle className="w-4 h-4 text-[#EA4335]" />
              Google
            </motion.button>
          </div>

          {/* Vendor CTA */}
          <motion.div
            whileHover={{ borderColor: "rgba(212,175,55,0.25)" }}
            className="mt-7 p-5 border border-white/8 bg-white/[0.02] rounded-sm text-center transition-colors duration-300"
          >
            <p className="font-manrope text-sm text-white/40 mb-2">Are you a vendor or event planner?</p>
            <Link
              href="/list-your-business"
              className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-primary hover:text-primary/70 transition-colors"
            >
              Register your business →
            </Link>
          </motion.div>

          <p className="mt-6 text-center font-manrope text-xs text-white/25">
            By continuing, you agree to our{" "}
            <Link href="/terms-of-service" className="text-primary/60 hover:text-primary transition-colors">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="text-primary/60 hover:text-primary transition-colors">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
