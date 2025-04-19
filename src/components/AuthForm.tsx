
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Lock } from "lucide-react";
import { LocationForm } from "./LocationForm";

interface AuthFormProps {
  type: "signin" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showStartJourney, setShowStartJourney] = useState(false);
  const { toast } = useToast();

  // Mock user authentication - in a real app, this would use Firebase Auth
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock successful authentication
    const mockUID = `user_${Date.now().toString(36)}`;
    
    toast({
      title: type === "signin" ? "Welcome back!" : "Account created!",
      description: type === "signin" 
        ? "Great to see you again" 
        : "Welcome to Anuvruddhi. Your wellness journey begins now.",
    });
    
    // In a real app, we would get the actual user data from Firebase
    // Store mock auth data in sessionStorage for demo purposes
    sessionStorage.setItem("authUser", JSON.stringify({
      email,
      uid: mockUID
    }));
    
    // Show location form after successful authentication
    setShowLocationForm(true);
  };
  
  const handleLocationComplete = (locationData: {
    address: string;
    country: string;
    coordinates: { lat: number; lng: number } | null;
  }) => {
    // In a real app, you would save this data to the user profile
    console.log("Location data:", locationData);
    
    toast({
      title: "Setup complete!",
      description: "Your profile has been updated with your location information.",
    });
    
    // Show the Start Journey button
    setShowStartJourney(true);
  };

  const redirectToPartTwo = () => {
    // Get the user data from sessionStorage
    const authUserStr = sessionStorage.getItem("authUser");
    if (!authUserStr) {
      toast({
        title: "Authentication error",
        description: "Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    const authUser = JSON.parse(authUserStr);
    const { email, uid } = authUser;

    // Build the URL with query parameters
    const part2URL = `https://lovable.dev/projects/c04dd057-1545-4481-9842-e874d2ca8037?email=${encodeURIComponent(email)}&uid=${encodeURIComponent(uid)}`;
    
    // Redirect to Part 2
    window.location.href = part2URL;
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
    <form onSubmit={handleSubmit} className="space-y-6 relative">
      {type === "signup" && (
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/3158e028-c2f1-420e-b641-125bd0919615.png" 
            alt="Healthy Lifestyle" 
            className="w-64 h-64 object-contain animate-fade-in"
          />
        </div>
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
