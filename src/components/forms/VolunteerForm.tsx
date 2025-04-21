
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { database, auth } from "@/services/firebase";
import { ref, set } from "firebase/database";
import { sendTelegramNotification } from "@/services/telegramService";

// Define form schemas
const baseFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  address: z.string().min(5, "Please provide a valid address"),
  phoneNo: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email"),
});

const greenSevakSchema = baseFormSchema.extend({
  familyIncome: z.string().min(1, "Please provide your family income"),
  familyMembers: z.string().min(1, "Please enter number of family members"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  photoUrl: z.string().optional(),
});

const studentVolunteerSchema = baseFormSchema.extend({
  collegeName: z.string().min(2, "Please enter your college name"),
  collegeId: z.string().min(1, "Please enter your college ID"),
  apaarId: z.string().min(1, "Please provide your APAAR ID"),
  collegeCity: z.string().min(2, "Please enter your college city"),
  previousMarksheetUrl: z.string().optional(),
});

export function VolunteerForm() {
  const [formType, setFormType] = useState<"student" | "greenSevak">("student");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Initialize forms for both types
  const studentForm = useForm<z.infer<typeof studentVolunteerSchema>>({
    resolver: zodResolver(studentVolunteerSchema),
    defaultValues: {
      fullName: "",
      address: "",
      phoneNo: "",
      email: "",
      collegeName: "",
      collegeId: "",
      apaarId: "",
      collegeCity: "",
    },
  });

  const greenSevakForm = useForm<z.infer<typeof greenSevakSchema>>({
    resolver: zodResolver(greenSevakSchema),
    defaultValues: {
      fullName: "",
      address: "",
      phoneNo: "",
      email: "",
      familyIncome: "",
      familyMembers: "",
      paymentMethod: "",
    },
  });

  // Handle file upload (mock implementation)
  const handleFileUpload = (file: File, formType: "student" | "greenSevak", fieldName: string) => {
    setIsUploading(true);
    
    // Mock file upload - in a real app, you would upload to Firebase Storage
    setTimeout(() => {
      const mockUrl = `https://example.com/uploads/${file.name}`;
      
      if (formType === "student") {
        studentForm.setValue(fieldName as any, mockUrl);
      } else {
        greenSevakForm.setValue(fieldName as any, mockUrl);
      }
      
      setIsUploading(false);
      
      toast({
        title: "File uploaded",
        description: "Your document has been uploaded successfully",
      });
    }, 1500);
  };

  // Submit handlers
  const onSubmitStudent = async (data: z.infer<typeof studentVolunteerSchema>) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit your application",
          variant: "destructive",
        });
        return;
      }
      
      // Save to Firebase
      await set(ref(database, `volunteers/students/${user.uid}`), {
        ...data,
        submittedAt: new Date().toISOString(),
      });
      
      // Send Telegram notification
      await sendTelegramNotification(`New student volunteer application submitted by ${data.fullName} from ${data.collegeName}!`);
      
      toast({
        title: "Application submitted!",
        description: "Your student volunteer application has been received. We'll contact you soon.",
      });
      
      // Reset form
      studentForm.reset();
      
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  };

  const onSubmitGreenSevak = async (data: z.infer<typeof greenSevakSchema>) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit your application",
          variant: "destructive",
        });
        return;
      }
      
      // Save to Firebase
      await set(ref(database, `volunteers/greenSevaks/${user.uid}`), {
        ...data,
        submittedAt: new Date().toISOString(),
      });
      
      // Send Telegram notification
      await sendTelegramNotification(`New Green Sevak application submitted by ${data.fullName}!`);
      
      toast({
        title: "Application submitted!",
        description: "Your Green Sevak application has been received. We'll contact you soon.",
      });
      
      // Reset form
      greenSevakForm.reset();
      
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 shadow-lg bg-gradient-to-br from-[#0F1D31] to-[#1A1F2C] text-white">
      <div className="mb-6 text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#1EAEDB] to-[#9b87f5] bg-clip-text text-transparent">
          Volunteer Registration
        </h2>
        <p className="text-white/70">
          Join our mission to make the world a better place
        </p>
      </div>
      
      <Tabs value={formType} onValueChange={(value) => setFormType(value as "student" | "greenSevak")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#252A3D]">
          <TabsTrigger value="student">Student Volunteer</TabsTrigger>
          <TabsTrigger value="greenSevak">Green Sevak</TabsTrigger>
        </TabsList>
        
        <TabsContent value="student" className="space-y-6">
          <Form {...studentForm}>
            <form onSubmit={studentForm.handleSubmit(onSubmitStudent)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={studentForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} className="bg-[#252A3D] border-[#9b87f5]/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={studentForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" type="email" {...field} className="bg-[#252A3D] border-[#9b87f5]/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={studentForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your address" {...field} className="bg-[#252A3D] border-[#9b87f5]/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={studentForm.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} className="bg-[#252A3D] border-[#9b87f5]/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={studentForm.control}
                  name="collegeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your college name" {...field} className="bg-[#252A3D] border-[#9b87f5]/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={studentForm.control}
                  name="collegeCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your college city" {...field} className="bg-[#252A3D] border-[#9b87f5]/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={studentForm.control}
                  name="collegeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your college ID" {...field} className="bg-[#252A3D] border-[#9b87f5]/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={studentForm.control}
                  name="apaarId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>APAAR ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your APAAR ID" {...field} className="bg-[#252A3D] border-[#9b87f5]/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel>Previous Year Marksheet</FormLabel>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0], "student", "previousMarksheetUrl");
                    }
                  }}
                  className="bg-[#252A3D] border-[#9b87f5]/30"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isUploading} 
                className="w-full bg-gradient-to-r from-[#7FB069] to-[#9b87f5] hover:opacity-90"
              >
                {isUploading ? "Uploading..." : "Submit Application"}
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="greenSevak" className="space-y-6">
          <Form {...greenSevakForm}>
            <form onSubmit={greenSevakForm.handleSubmit(onSubmitGreenSevak)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={greenSevakForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} className="bg-[#252A3D] border-[#9b87f5]/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={greenSevakForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" type="email" {...field} className="bg-[#252A3D] border-[#9b87f5]/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={greenSevakForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your address" {...field} className="bg-[#252A3D] border-[#9b87f5]/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={greenSevakForm.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} className="bg-[#252A3D] border-[#9b87f5]/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={greenSevakForm.control}
                  name="familyIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family Income</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your family income" {...field} className="bg-[#252A3D] border-[#9b87f5]/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={greenSevakForm.control}
                  name="familyMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Family Members</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter number of family members" {...field} className="bg-[#252A3D] border-[#9b87f5]/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={greenSevakForm.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#252A3D] border-[#9b87f5]/30">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#252A3D] border-[#9b87f5]/30">
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel>Profile Photo</FormLabel>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0], "greenSevak", "photoUrl");
                    }
                  }}
                  className="bg-[#252A3D] border-[#9b87f5]/30"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isUploading} 
                className="w-full bg-gradient-to-r from-[#1EAEDB] to-[#9b87f5] hover:opacity-90"
              >
                {isUploading ? "Uploading..." : "Submit Application"}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
