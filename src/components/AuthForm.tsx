
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Lock } from "lucide-react";
import { LocationForm } from "./LocationForm";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, database } from "@/services/firebase";
import { ref, set, get } from "firebase/database";

interface AuthFormProps {
  type: "signin" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showStartJourney, setShowStartJourney] = useState(false);
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let user;
      
      if (type === "signup") {
        // Create the user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        
        // Save additional user data to Realtime DB
        await set(ref(database, `users/${user.uid}`), {
          email: user.email,
          xp: 0,
          dateJoined: new Date().toISOString()
        });
        
        // Send Telegram notification for new user
        await sendTelegramNotification(`New user has just registered on Anuvruddhi!`);
        
        toast({
          title: "Account created!",
          description: "Welcome to Anuvruddhi. Your wellness journey begins now.",
        });
      } else {
        // Sign in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        
        toast({
          title: "Welcome back!",
          description: "Great to see you again",
        });
      }
      
      // Save auth state to localStorage for persistence
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userId", user.uid);
      
      // Show location form after successful authentication
      setShowLocationForm(true);
      
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleLocationComplete = async (locationData: {
    address: string;
    country: string;
    coordinates: { lat: number; lng: number } | null;
  }) => {
    try {
      // Get current user
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Update user profile with location data
      await set(ref(database, `users/${user.uid}/location`), locationData);
      
      toast({
        title: "Setup complete!",
        description: "Your profile has been updated with your location information.",
      });
      
      // Show the Start Journey button
      setShowStartJourney(true);
    } catch (error) {
      console.error("Error updating location data:", error);
      toast({
        title: "Error updating profile",
        description: "We couldn't save your location. Please try again.",
        variant: "destructive",
      });
    }
  };

  const redirectToPartTwo = () => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Authentication error",
        description: "Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    // Redirect to the main application
    window.location.href = "/arena";
  };
  
  const sendTelegramNotification = async (message: string) => {
    try {
      const encodedMessage = encodeURIComponent(message);
      const telegramUrl = `https://api.telegram.org/bot7870937947:AAHJY3kj7_P1YUFpqGMWRI2Dx-YfBRfBaHI/sendMessage?chat_id=7010295728&text=${encodedMessage}`;
      
      await fetch(telegramUrl);
      console.log("Telegram notification sent successfully");
    } catch (error) {
      console.error("Failed to send Telegram notification:", error);
      // Don't show toast for this as it's a background operation
    }
  };

  if (showStartJourney) {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-semibold">Ready to Begin Your Journey?</h2>
        <p className="text-gray-600">Your profile is all set up. Click the button below to start your wellness journey.</p>
        <Button 
          onClick={redirectToPartTwo}
          className="w-full bg-[#7FB069] hover:bg-[#6A9957] transition-colors text-lg py-6"
        >
          Start Your Journey
        </Button>
      </div>
    );
  }

  if (showLocationForm) {
    return <LocationForm onComplete={handleLocationComplete} />;
  }

  return (
    <form onSubmit={handleEmailAuth} className="space-y-6 relative">
      {type === "signup" && (
        <>
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/3158e028-c2f1-420e-b641-125bd0919615.png" 
              alt="Healthy Lifestyle" 
              className="w-64 h-64 object-contain animate-fade-in"
            />
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="pl-9"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="pl-9"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#7FB069] hover:bg-[#6A9957] transition-colors"
      >
        {type === "signin" ? "Sign In" : "Sign Up"}
      </Button>
    </form>
  );
}
