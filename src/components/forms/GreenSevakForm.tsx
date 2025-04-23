
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { TreePine, Check } from "lucide-react";

export function GreenSevakForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    experience: "",
    treesPlanted: "",
    availability: {
      weekdays: false,
      weekends: false,
      evenings: false,
    },
    commitment: "",
    reason: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: keyof typeof formData.availability) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [field]: !prev.availability[field],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log("Green Sevak form submitted:", formData);
    
    // Show success message
    toast({
      title: "Application Submitted!",
      description: "Thank you for applying to become a Green Sevak. We'll review your application soon.",
    });
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-[#7FB069]/20 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-[#7FB069]" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Application Received!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your interest in becoming a Green Sevak. Our team will review your
          application and contact you soon.
        </p>
        <Button
          onClick={() => window.location.href = "/"}
          className="bg-[#7FB069] hover:bg-[#6A9957]"
        >
          Return to Homepage
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TreePine className="h-6 w-6 text-[#7FB069]" />
        <h2 className="text-2xl font-semibold">Green Sevak Application</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Join our team of dedicated Green Sevaks who lead tree planting initiatives and
        inspire communities to take environmental action.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="fullName">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="treesPlanted">
              Trees Planted So Far
            </label>
            <Input
              id="treesPlanted"
              name="treesPlanted"
              type="number"
              min="0"
              value={formData.treesPlanted}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="address">
            Address
          </label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="experience">
            Prior Environmental Experience
          </label>
          <Textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Please describe any relevant experience you have..."
            className="min-h-[100px]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Availability
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="weekdays"
                checked={formData.availability.weekdays}
                onCheckedChange={() => handleCheckboxChange("weekdays")}
              />
              <label
                htmlFor="weekdays"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Weekdays
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="weekends"
                checked={formData.availability.weekends}
                onCheckedChange={() => handleCheckboxChange("weekends")}
              />
              <label
                htmlFor="weekends"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Weekends
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="evenings"
                checked={formData.availability.evenings}
                onCheckedChange={() => handleCheckboxChange("evenings")}
              />
              <label
                htmlFor="evenings"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Evenings
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="commitment">
            Time Commitment (hours per week)
          </label>
          <Input
            id="commitment"
            name="commitment"
            type="number"
            min="1"
            value={formData.commitment}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="reason">
            Why do you want to be a Green Sevak?
          </label>
          <Textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Share your motivation for joining our initiative..."
            className="min-h-[100px]"
            required
          />
        </div>
        
        <Button type="submit" className="w-full bg-[#7FB069] hover:bg-[#6A9957]">
          Submit Application
        </Button>
      </form>
    </Card>
  );
}
