import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import bmsLogo from "@assets/WhatsApp_Image_2026-05-06_at_4.23.32_PM-removebg-preview_1778229042227.png";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [, navigate] = useLocation();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successName, setSuccessName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const userData = await register(name.trim(), email.trim(), password);
        setSuccessName(userData.name.split(" ")[0]);
      } else {
        const userData = await login(email.trim(), password);
        setSuccessName(userData.name.split(" ")[0]);
      }
      setSuccess(true);
      setTimeout(() => navigate("/"), 1800);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080604] font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center px-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-primary" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-3">✦ Welcome ✦</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light mb-3">
              Namaste, <span className="text-primary italic font-semibold capitalize">{successName}</span>!
            </h2>
            <p className="font-manrope text-white/50 text-sm">Taking you to your dashboard...</p>
            <div className="mt-6 w-32 h-0.5 bg-primary/30 mx-auto relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "linear" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left Split — cinematic image */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-[#080604] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85"
          alt="Wedding"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080604]/80 via-[#080604]/30 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/40" />

        <div className="relative z-10 px-14 text-left">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <img
              src={bmsLogo}
              alt="BMS"
              className="h-12 w-12 object-contain"
              style={{ mixBlendMode: "screen", filter: "brightness(1.3) saturate(1.2)" }}
            />
            <span className="font-cormorant text-2xl text-white font-semibold">
              <span className="text-primary italic">Book</span> My Squad
            </span>
          </Link>

          <div className="gold-line w-12 mb-8" />
          <p className="font-cinzel text-[10px] tracking-[0.4em] text-primary/70 uppercase mb-5">✦ Premium Platform ✦</p>
          <h1 className="font-cormorant text-4xl md:text-5xl text-white font-light leading-tight mb-6">
            India's Finest<br />
            <span className="text-primary italic font-semibold">Wedding Planning</span><br />
            Platform
          </h1>
          <p className="font-manrope text-white/50 text-sm leading-relaxed max-w-xs">
            Access 436+ curated venues, 255+ verified vendors, and your complete wedding planning toolkit.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {[["436+", "Venues"], ["255+", "Vendors"], ["24+", "Cities"]].map(([n, l]) => (
              <div key={l}>
                <div className="font-cormorant text-2xl text-primary font-semibold">{n}</div>
                <div className="font-manrope text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Split — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white relative">
        <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors group lg:hidden">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>

        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer mb-8 lg:hidden">
            <img src={bmsLogo} alt="Book My Squad" className="h-10 w-10 object-contain" />
            <span className="font-cormorant text-2xl font-semibold text-foreground">
              <span className="text-primary italic">Book</span> My Squad
            </span>
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-1.5">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-slate-500 text-sm">
              {isSignUp
                ? "Join thousands of couples planning their dream wedding."
                : "Sign in to access your wedding planning dashboard."}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-lg bg-slate-100 p-1 mb-7">
            {["Sign In", "Sign Up"].map((tab, i) => (
              <button
                key={tab}
                type="button"
                onClick={() => setIsSignUp(i === 1)}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                  (i === 1) === isSignUp
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <Label htmlFor="name" className="text-slate-700 font-medium text-sm">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      className="pl-10 h-12 border-slate-200 focus:border-primary focus:ring-primary/20"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignUp}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700 font-medium text-sm">Email Address</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-12 border-slate-200 focus:border-primary focus:ring-primary/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-slate-700 font-medium text-sm">Password</Label>
                {!isSignUp && (
                  <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder={isSignUp ? "Min. 8 characters" : "Enter your password"}
                  className="pl-10 pr-10 h-12 border-slate-200 focus:border-primary focus:ring-primary/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-sm font-bold bg-primary hover:bg-primary/90 text-black rounded-md tracking-wide mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </span>
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 uppercase tracking-wider">or continue with</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-11 border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 text-sm">
              <FaFacebook className="w-4 h-4 text-[#1877F2]" /> Facebook
            </Button>
            <Button variant="outline" className="flex-1 h-11 border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 text-sm">
              <FaGoogle className="w-4 h-4 text-[#DB4437]" /> Google
            </Button>
          </div>

          <div className="mt-8 p-5 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <p className="text-sm text-slate-500 mb-2">Are you a vendor or event planner?</p>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); }}
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Register your business →
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to our{" "}
            <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
