import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CursorGlow } from "@/components/CursorGlow";
import { ChatBot } from "@/components/ChatBot";
import { AuthProvider } from "@/context/AuthContext";
import Home from "@/pages/Home";
import Vendors from "@/pages/Vendors";
import Venues from "@/pages/Venues";
import Login from "@/pages/Login";
import Weddings from "@/pages/Weddings";
import Blog from "@/pages/Blog";
import Photos from "@/pages/Photos";
import ListYourBusiness from "@/pages/ListYourBusiness";
import NotFound from "@/pages/not-found";

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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SmoothScroll>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <CursorGlow />
              <Router />
              <ChatBot />
            </WouterRouter>
          </SmoothScroll>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
