
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/AuthForm";
import { Bike, Heart, Leaf } from "lucide-react";
import SplashScreen from "@/components/SplashScreen";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#0A2342] to-[#13315C]">
      {/* Diamond background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-32 h-32 bg-white/10 transform rotate-45 rounded-lg blur-2xl opacity-30"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/15 transform rotate-45 rounded-lg blur-3xl opacity-20"></div>
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-white/5 transform rotate-45 rounded-lg blur-xl opacity-25"></div>
        <div className="absolute bottom-1/3 right-1/3 w-36 h-36 bg-white/10 transform rotate-45 rounded-lg blur-2xl opacity-20"></div>
      </div>

      <div className="w-full max-w-lg space-y-8 animate-fade-in relative z-10">
        <div className="text-center space-y-2">
          <div className="flex justify-center space-x-2 mb-6">
            <Heart className="h-8 w-8 text-[#FEC6A1]" />
            <Bike className="h-8 w-8 text-[#7FB069]" />
            <Leaf className="h-8 w-8 text-[#FEC6A1]" />
          </div>
          <h1 className="text-4xl font-semibold text-white">
            Welcome to Anuvruddhi
          </h1>
          <p className="text-lg text-gray-300 max-w-md mx-auto">
            Your journey to a healthier, happier you begins here
          </p>
        </div>

        <Card className="p-6 shadow-2xl bg-white/10 backdrop-blur-lg border border-white/10">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10 backdrop-blur-md">
              <TabsTrigger value="signin" className="text-white hover:bg-white/10">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-white hover:bg-white/10">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <AuthForm type="signin" />
            </TabsContent>
            <TabsContent value="signup">
              <AuthForm type="signup" />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

