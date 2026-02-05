import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/BottomNav";

import Home from "@/pages/Home";
import LoveMode from "@/pages/LoveMode";
import MarriageMode from "@/pages/MarriageMode";
import FamilyMode from "@/pages/FamilyMode";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="bg-background min-h-screen text-foreground font-sans">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/love" component={LoveMode} />
        <Route path="/marriage" component={MarriageMode} />
        <Route path="/family" component={FamilyMode} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
