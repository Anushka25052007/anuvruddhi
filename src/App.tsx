
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MotivationArena from "./pages/MotivationArena";
import DailyWheel from "./pages/DailyWheel";
import HabitGarden from "./pages/HabitGarden";
import Certificates from "./pages/Certificates";
import TempleOfYou from "./pages/TempleOfYou";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/arena" element={<MotivationArena />} />
          <Route path="/wheel" element={<DailyWheel />} />
          <Route path="/habits" element={<HabitGarden />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/temple" element={<TempleOfYou />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
