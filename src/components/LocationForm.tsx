
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Flag, MapPinOff, GpsFixed, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for countries - in a real application, this would come from an API
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
  const [step, setStep] = useState<"country" | "gps" | "map" | "confirm">("country");
  const [country, setCountry] = useState<string | null>(null);
  const [address, setAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isGpsEnabled, setIsGpsEnabled] = useState<boolean | null>(null);
  const [isPermanentAddress, setIsPermanentAddress] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Function to request GPS location
  const requestLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: "Requesting location",
        description: "Please allow access to your location.",
      });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsGpsEnabled(true);
          // In a real app, we would reverse geocode to get the address
          setAddress("Your current location");
          setStep("confirm");
          toast({
            title: "Location found",
            description: "We've detected your current location.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsGpsEnabled(false);
          toast({
            title: "Location access denied",
            description: "Please enable location access or select manually.",
            variant: "destructive",
          });
          setStep("map");
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setIsGpsEnabled(false);
      setStep("map");
    }
  };

  // Function to handle country selection
  const handleCountrySelect = (selectedCountry: string) => {
    setCountry(selectedCountry);
    setStep("gps");
    toast({
      title: "Country selected",
      description: `You've selected ${selectedCountry}.`,
    });
  };

  // Function to handle address confirmation
  const handleAddressConfirm = (isPermanent: boolean) => {
    setIsPermanentAddress(isPermanent);
    
    if (isPermanent) {
      // Proceed with the permanent address
      onComplete({
        address,
        country: country || "",
        coordinates,
      });
      
      toast({
        title: "Address confirmed",
        description: "Your permanent address has been saved.",
      });
    } else {
      // Allow manual selection on the map
      setStep("map");
      toast({
        title: "Select your address",
        description: "Please select your permanent address on the map.",
      });
    }
  };

  // Function to simulate selecting location from map
  const handleMapSelection = () => {
    // In a real app, this would get coordinates from the map
    const mockCoordinates = { lat: 40.7128, lng: -74.006 };
    setCoordinates(mockCoordinates);
    setAddress("Selected address from map");
    
    onComplete({
      address: "Selected address from map",
      country: country || "",
      coordinates: mockCoordinates,
    });
    
    toast({
      title: "Address selected",
      description: "Your permanent address has been saved.",
    });
  };

  // Render based on current step
  const renderStepContent = () => {
    switch (step) {
      case "country":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-[#7FB069] mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Select Your Country</h2>
              <p className="text-gray-500">Please select your country before proceeding.</p>
            </div>
            
            <div className="relative">
              <Label htmlFor="country">Country</Label>
              <div className="flex items-center mt-1">
                <Input
                  id="country"
                  placeholder="Select your country"
                  readOnly
                  className="pr-12"
                  value={country ? countries.find(c => c.name === country)?.name || "" : ""}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="absolute right-0 h-full px-3 py-2 rounded-l-none"
                      aria-label="Select country"
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white w-64 max-h-80 overflow-auto">
                    {countries.map((country) => (
                      <DropdownMenuItem 
                        key={country.code}
                        onClick={() => handleCountrySelect(country.name)}
                        className="cursor-pointer"
                      >
                        <span className="mr-2">{country.flag}</span>
                        {country.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        );
        
      case "gps":
        return (
          <div className="space-y-6 text-center">
            <GpsFixed className="mx-auto h-12 w-12 text-[#7FB069] mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Location Access</h2>
            <p className="text-gray-500 mb-4">
              We need your location to provide better service. 
              Please allow location access.
            </p>
            
            <Button 
              onClick={requestLocation}
              className="w-full bg-[#7FB069] hover:bg-[#6A9957]"
            >
              <GpsFixed className="mr-2 h-4 w-4" />
              Use My Current Location
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setStep("map")}
              className="w-full mt-2"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Select on Map
            </Button>
          </div>
        );
        
      case "confirm":
        return (
          <div className="space-y-6 text-center">
            <MapPin className="mx-auto h-12 w-12 text-[#7FB069] mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Confirm Your Address</h2>
            <p className="text-gray-500 mb-4">
              Is this your permanent address?
            </p>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="font-medium">{address}</p>
              <p className="text-sm text-gray-500">{country}</p>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={() => handleAddressConfirm(true)}
                className="flex-1 bg-[#7FB069] hover:bg-[#6A9957]"
              >
                <Check className="mr-2 h-4 w-4" />
                Yes, This is My Address
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => handleAddressConfirm(false)}
                className="flex-1"
              >
                <MapPinOff className="mr-2 h-4 w-4" />
                No, Select Different
              </Button>
            </div>
          </div>
        );
        
      case "map":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-[#7FB069] mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Select on Map</h2>
              <p className="text-gray-500 mb-4">
                Please select your permanent address on the map.
              </p>
            </div>
            
            {/* Mock Map - In a real app, this would be an actual map component */}
            <div className="w-full h-56 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map would be displayed here</p>
            </div>
            
            <Button
              onClick={handleMapSelection}
              className="w-full bg-[#7FB069] hover:bg-[#6A9957]"
            >
              <Check className="mr-2 h-4 w-4" />
              Confirm This Location
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderStepContent()}
    </div>
  );
}
