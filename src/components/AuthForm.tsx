
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Lock, User, Phone } from "lucide-react";
import { LocationForm } from "./LocationForm";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, database } from "@/services/firebase";
import { ref, set, get } from "firebase/database";

interface AuthFormProps {
  type: "signin" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showStartJourney, setShowStartJourney] = useState(false);
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let user;
      
      if (type === "signup") {
        if (!fullName.trim()) {
          toast({
            title: "Missing information",
            description: "Please enter your full name",
            variant: "destructive",
          });
          return;
        }
        
        // Create the user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        
        // Update profile with display name
        await updateProfile(user, { displayName: fullName });
        
        // Save additional user data to Realtime DB
        await set(ref(database, `users/${user.uid}`), {
          email: user.email,
          fullName,
          phoneNo: phoneNo || "",
          xp: 0,
          dateJoined: new Date().toISOString()
        });
        
        // Send Telegram notification for new user
        await sendTelegramNotification(`New user ${fullName} has just registered on Anuvruddhi!`);
        
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
  
  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if this is a new user
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // New user, save to database
        await set(userRef, {
          email: user.email,
          fullName: user.displayName || "",
          phoneNo: user.phoneNumber || "",
          photoURL: user.photoURL || "",
          xp: 0,
          dateJoined: new Date().toISOString()
        });
        
        // Send Telegram notification for new Google user
        await sendTelegramNotification(`New user ${user.displayName || "Anonymous"} has just registered on Anuvruddhi via Google!`);
        
        toast({
          title: "Account created!",
          description: "Welcome to Anuvruddhi. Your wellness journey begins now.",
        });
      } else {
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
      console.error("Google authentication error:", error);
      toast({
        title: "Authentication failed",
        description: error.message || "Google sign-in failed. Please try again.",
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
  
  // Helper function to send Telegram notifications
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
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className="pl-9"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNo">Phone Number (Optional)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phoneNo"
                type="tel"
                placeholder="Enter your phone number"
                className="pl-9"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </div>
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
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <Button
        type="button"
        onClick={handleGoogleAuth}
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
      >
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
        Sign {type === "signin" ? "in" : "up"} with Google
      </Button>
    </form>
  );
}
