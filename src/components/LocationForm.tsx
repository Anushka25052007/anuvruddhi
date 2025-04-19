
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Flag, MapPinOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for countries
const countries = [
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { name: "Canada", code: "CA", flag: "🇨🇦" },
  { name: "Australia", code: "AU", flag: "🇦🇺" },
  { name: "India", code: "IN", flag: "🇮🇳" },
  { name: "Japan", code: "JP", flag: "🇯🇵" },
  { name: "Germany", code: "DE", flag: "🇩🇪" },
  { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "Brazil", code: "BR", flag: "🇧🇷" },
  { name: "China", code: "CN", flag: "🇨🇳" },
];

interface LocationFormProps {
  onComplete: (locationData: { 
    address: string;
    country: string;
    coordinates: { lat: number; lng: number } | null;
  }) => void;
}

export function LocationForm({ onComplete }: LocationFormProps) {
  const [step, setStep] = useState<"country" | "gps" | "manual">("country");
  const [country, setCountry] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [isLocationInputEnabled, setIsLocationInputEnabled] = useState(false);
  const { toast } = useToast();

  // Function to handle country selection
  const handleCountrySelect = (selectedCountry: string) => {
    setCountry(selectedCountry);
    setStep("gps");
    toast({
      title: "Country selected",
      description: `You've selected ${selectedCountry}. Please enable GPS to continue.`,
    });
  };

  // Function to request GPS location
  const requestLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: "Requesting location",
        description: "Please allow access to your location.",
      });
      
      navigator.geolocation.getCurrentPosition(
        () => {
          toast({
            title: "Google Maps Limit Reached",
            description: "Google Cloud services such as Google Maps have reached their free trial usage limit.",
          });
          setIsLocationInputEnabled(true);
          setStep("manual");
        },
        () => {
          toast({
            title: "Location access denied",
            description: "Please enter your address manually.",
          });
          setIsLocationInputEnabled(true);
          setStep("manual");
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Please enter your address manually.",
      });
      setIsLocationInputEnabled(true);
      setStep("manual");
    }
  };

  const handleAddressSubmit = () => {
    if (!address.trim()) {
      toast({
        title: "Address required",
        description: "Please enter your permanent address.",
        variant: "destructive",
      });
      return;
    }

    onComplete({
      address,
      country,
      coordinates: null, // Since we're not using actual GPS coordinates
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <MapPin className="mx-auto h-12 w-12 text-[#7FB069] mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Set Your Location</h2>
        <p className="text-gray-500">Please select your country and provide your address.</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Label htmlFor="country">Country</Label>
          <div className="flex items-center mt-1">
            <Input
              id="country"
              placeholder="Select your country"
              readOnly
              className="pr-12"
              value={country}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="absolute right-0 h-full px-3 py-2 rounded-l-none"
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 max-h-80 overflow-auto bg-white">
                {countries.map((c) => (
                  <DropdownMenuItem 
                    key={c.code}
                    onClick={() => handleCountrySelect(c.name)}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">{c.flag}</span>
                    {c.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {step !== "country" && (
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="address"
                placeholder={isLocationInputEnabled ? "Enter your permanent address" : "Select country first"}
                className="pl-9"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                readOnly={!isLocationInputEnabled}
                onClick={() => {
                  if (step === "gps") {
                    requestLocation();
                  }
                }}
              />
            </div>
          </div>
        )}

        {step === "manual" && (
          <Button 
            onClick={handleAddressSubmit}
            className="w-full bg-[#7FB069] hover:bg-[#6A9957]"
          >
            Confirm Address
          </Button>
        )}
      </div>
    </div>
  );
}
