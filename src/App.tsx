
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TrendingDashboard from "./pages/TrendingDashboard";
import AllTwitterTrends from "./pages/AllTwitterTrends";
import AllWalletActivity from "./pages/AllWalletActivity";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TrendingDashboard />} />
          <Route path="/welcome" element={<Index />} />
          <Route path="/trending" element={<TrendingDashboard />} />
          <Route path="/twitter-trends" element={<AllTwitterTrends />} />
          <Route path="/wallet-activity" element={<AllWalletActivity />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
