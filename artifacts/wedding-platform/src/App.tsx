import { useState, lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ChatBot } from "@/components/ChatBot";
import { SplashScreen } from "@/components/SplashScreen";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { PageTransition } from "@/components/PageTransition";
import { AuthProvider } from "@/context/AuthContext";
import { ShortlistProvider } from "@/context/ShortlistContext";
import { ComparisonProvider } from "@/context/ComparisonContext";
import { NotificationProvider } from "@/context/NotificationContext";

import Home from "@/pages/Home";

const Vendors          = lazy(() => import("@/pages/Vendors"));
const Venues           = lazy(() => import("@/pages/Venues"));
const Login            = lazy(() => import("@/pages/Login"));
const Weddings         = lazy(() => import("@/pages/Weddings"));
const Blog             = lazy(() => import("@/pages/Blog"));
const Photos           = lazy(() => import("@/pages/Photos"));
const ListYourBusiness = lazy(() => import("@/pages/ListYourBusiness"));
const WhyChooseUs      = lazy(() => import("@/pages/WhyChooseUs"));
const PrivacyPolicy    = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService   = lazy(() => import("@/pages/TermsOfService"));
const CookiePolicy     = lazy(() => import("@/pages/CookiePolicy"));
const ContactUs        = lazy(() => import("@/pages/ContactUs"));
const Support          = lazy(() => import("@/pages/Support"));
const RefundPolicy     = lazy(() => import("@/pages/RefundPolicy"));
const CityLanding      = lazy(() => import("@/pages/CityLanding"));
const EventPortfolio   = lazy(() => import("@/pages/EventPortfolio"));
const CaseStudy        = lazy(() => import("@/pages/CaseStudy"));
const VendorPortalDemo = lazy(() => import("@/pages/demos/VendorPortalDemo"));
const BookingPaymentDemo = lazy(() => import("@/pages/demos/BookingPaymentDemo"));
const NotFound         = lazy(() => import("@/pages/not-found"));
const AdminPortal      = lazy(() => import("@/pages/portal/AdminPortal"));
const VendorPortal     = lazy(() => import("@/pages/portal/VendorPortal"));
const VenuePortal      = lazy(() => import("@/pages/portal/VenuePortal"));
const Profile          = lazy(() => import("@/pages/portal/Profile"));
const SavedFavorites   = lazy(() => import("@/pages/portal/SavedFavorites"));
const Checklist        = lazy(() => import("@/pages/Checklist"));

function PageLoader() {
  return <div className="fixed inset-0 bg-[#080604]" />;
}

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
      <Route path="/list-your-business" component={ListYourBusiness} />
      <Route path="/why-choose-us" component={WhyChooseUs} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/contact-us" component={ContactUs} />
      <Route path="/support" component={Support} />
      <Route path="/contact" component={Support} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/portal/admin" component={AdminPortal} />
      <Route path="/portal/vendor" component={VendorPortal} />
      <Route path="/portal/venue" component={VenuePortal} />
      <Route path="/portal/profile" component={Profile} />
      <Route path="/portal/saved" component={SavedFavorites} />
      <Route path="/events" component={EventPortfolio} />
      <Route path="/events/:slug" component={CaseStudy} />
      <Route path="/checklist" component={Checklist} />
      <Route path="/vendors/:city" component={CityLanding} />
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
                    <PageTransition />
                    <Suspense fallback={<PageLoader />}>
                      <Router />
                    </Suspense>
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
