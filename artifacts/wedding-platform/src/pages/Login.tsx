import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock } from "lucide-react";
import { FaFacebook, FaGoogle } from "react-icons/fa";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: isSignUp ? "Account created successfully!" : "Signed in successfully!",
    });
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left Split */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-black">
        <img 
          src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80" 
          alt="Wedding Couple" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 px-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold leading-tight">
            India's Favourite Wedding Planning Platform
          </h1>
        </div>
      </div>

      {/* Right Split */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-foreground flex items-center gap-1 cursor-pointer mb-8">
              <span className="text-primary italic">B</span>MS
            </Link>
            <h2 className="text-3xl font-bold text-foreground mb-2">Sign In / Sign Up</h2>
            <p className="text-muted-foreground text-sm">
              {isSignUp ? "Create an account to save your favorite vendors." : "Welcome back! Please enter your details."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input 
                    id="name"
                    type="text" 
                    placeholder="Enter your name" 
                    className="pl-10 h-12"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="emailOrMobile">{isSignUp ? "Email" : "Email or Mobile Number"}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  id="emailOrMobile"
                  type="text" 
                  placeholder={isSignUp ? "Enter email address" : "Enter email or mobile number"} 
                  className="pl-10 h-12"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  id="password"
                  type="password" 
                  placeholder="Enter password" 
                  className="pl-10 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {!isSignUp && (
              <div className="flex justify-end">
                <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-md font-semibold bg-primary hover:bg-primary/90 text-white rounded-md">
              {isSignUp ? "Create Account" : "Continue"}
            </Button>

            <div className="text-center text-sm">
              <button 
                type="button" 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {isSignUp ? "Already have an account? Sign in" : "New here? Create account"}
              </button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-muted-foreground">OR</span>
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-sm font-medium text-foreground mb-4">Continue With</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="flex-1 h-12 border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2]/5">
                <FaFacebook className="w-5 h-5 mr-2" /> Facebook
              </Button>
              <Button variant="outline" className="flex-1 h-12 border-[#DB4437] text-[#DB4437] hover:bg-[#DB4437]/5">
                <FaGoogle className="w-5 h-5 mr-2" /> Google
              </Button>
            </div>
          </div>

          <div className="mt-12 text-center p-6 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-sm text-muted-foreground mb-3">Are you a vendor?</p>
            <Button variant="link" className="text-blue-600 font-semibold p-0 h-auto hover:text-blue-700">
              Business Sign In →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}