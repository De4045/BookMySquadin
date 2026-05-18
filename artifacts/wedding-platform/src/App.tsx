import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CursorGlow } from "@/components/CursorGlow";
import { ChatBot } from "@/components/ChatBot";
import { SplashScreen } from "@/components/SplashScreen";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AuthProvider } from "@/context/AuthContext";
import { ShortlistProvider } from "@/context/ShortlistContext";
import { ComparisonProvider } from "@/context/ComparisonContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Home from "@/pages/Home";
import Vendors from "@/pages/Vendors";
import Venues from "@/pages/Venues";
import Login from "@/pages/Login";
import Weddings from "@/pages/Weddings";
import Blog from "@/pages/Blog";
import Photos from "@/pages/Photos";
import ListYourBusiness from "@/pages/ListYourBusiness";
import WhyChooseUs from "@/pages/WhyChooseUs";
import Checklist from "@/pages/Checklist";
import VendorPortalDemo from "@/pages/demos/VendorPortalDemo";
import BookingPaymentDemo from "@/pages/demos/BookingPaymentDemo";
import NotFound from "@/pages/not-found";
import AdminPortal from "@/pages/portal/AdminPortal";
import VendorPortal from "@/pages/portal/VendorPortal";
import VenuePortal from "@/pages/portal/VenuePortal";
import Profile from "@/pages/portal/Profile";
import SavedFavorites from "@/pages/portal/SavedFavorites";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/venues" component={Venues} />
      <Route path="/login" component={Login} />
      <Route path="/weddings" component={Weddings} />
      <Route path="/real-weddings" component={Weddings} />
      <Route path="/blog" component={Blog} />
      <Route path="/photos" component={Photos} />
      <Route path="/checklist" component={Checklist} />
      <Route path="/list-your-business" component={ListYourBusiness} />
      <Route path="/why-choose-us" component={WhyChooseUs} />
      <Route path="/portal/admin" component={AdminPortal} />
      <Route path="/portal/vendor" component={VendorPortal} />
      <Route path="/portal/venue" component={VenuePortal} />
      <Route path="/portal/profile" component={Profile} />
      <Route path="/portal/saved" component={SavedFavorites} />
      <Route path="/demo/vendor-portal" component={VendorPortalDemo} />
      <Route path="/demo/booking-payment" component={BookingPaymentDemo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [splashDone, setSplashDone] = useState<boolean>(() => {
    try { return sessionStorage.getItem("bms_splash") === "1"; }
    catch { return false; }
  });

  const handleSplashComplete = () => {
    try { sessionStorage.setItem("bms_splash", "1"); } catch { /* noop */ }
    setSplashDone(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NotificationProvider>
            <ComparisonProvider>
              <ShortlistProvider>
                {/* Logo splash — shown once per session */}
                {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

                <SmoothScroll>
                  <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                    <CursorGlow />
                    <Router />
                    <ChatBot />
                    <MobileBottomNav />
                  </WouterRouter>
                </SmoothScroll>
              </ShortlistProvider>
            </ComparisonProvider>
          </NotificationProvider>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
