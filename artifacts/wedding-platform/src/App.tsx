import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CursorGlow } from "@/components/CursorGlow";
import Home from "@/pages/Home";
import Vendors from "@/pages/Vendors";
import Venues from "@/pages/Venues";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/venues" component={Venues} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SmoothScroll>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <CursorGlow />
            <Router />
          </WouterRouter>
        </SmoothScroll>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;