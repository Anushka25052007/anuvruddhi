
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/AuthForm";
import { Bike, Heart, Leaf } from "lucide-react";
import SplashScreen from "@/components/SplashScreen";
import { auth } from "@/services/firebase";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    // Check if user is already authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthChecked(true);
      
      if (user) {
        // User is signed in, redirect to main app
        navigate("/arena");
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [navigate]);

  if (showSplash) {
    return <SplashScreen />;
  }
  
  if (!authChecked) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FDF8F4] to-[#F5E6E0]">
      <div className="w-full max-w-lg space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="flex justify-center space-x-2 mb-6">
            <Heart className="h-8 w-8 text-[#FEC6A1]" />
            <Bike className="h-8 w-8 text-[#7FB069]" />
            <Leaf className="h-8 w-8 text-[#FEC6A1]" />
          </div>
          <h1 className="text-4xl font-semibold text-[#2D3047]">
            Welcome to Anuvruddhi
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Your journey to a healthier, happier you begins here
          </p>
          <p className="text-[#7FB069] italic mt-4">"Flourish with Nature. Rise with Purpose."</p>
        </div>

        <Card className="p-6 shadow-lg bg-white/80 backdrop-blur-sm">
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="signin">Sign In</TabsTrigger>
            </TabsList>
            <TabsContent value="signup">
              <AuthForm type="signup" />
            </TabsContent>
            <TabsContent value="signin">
              <AuthForm type="signin" />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
