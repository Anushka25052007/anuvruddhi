
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MotivationArena from "./pages/MotivationArena";
import DailyWheel from "./pages/DailyWheel";
import HabitGarden from "./pages/HabitGarden";
import Certificates from "./pages/Certificates";
import TempleOfYou from "./pages/TempleOfYou";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return authenticated ? <>{children}</> : <Navigate to="/" />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/arena" element={
              <ProtectedRoute>
                <MotivationArena />
              </ProtectedRoute>
            } />
            <Route path="/wheel" element={
              <ProtectedRoute>
                <DailyWheel />
              </ProtectedRoute>
            } />
            <Route path="/habits" element={
              <ProtectedRoute>
                <HabitGarden />
              </ProtectedRoute>
            } />
            <Route path="/certificates" element={
              <ProtectedRoute>
                <Certificates />
              </ProtectedRoute>
            } />
            <Route path="/temple" element={
              <ProtectedRoute>
                <TempleOfYou />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
