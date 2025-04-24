
import { useState, useEffect } from "react";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter
} from "@/components/ui/drawer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Menu, Upload, User, UserCheck, Users, X, PlusCircle } from "lucide-react";
import { ref, set, get, update } from "firebase/database";
import { auth, database } from "@/services/firebase";
import { useToast } from "@/hooks/use-toast";

type UserRole = "guest" | "volunteer" | "green_sevak" | null;

type UserProfileData = {
  name: string;
  phoneNumber: string;
  email: string;
  age: string;
  photoURL: string;
  role: UserRole;
  roleLockDate?: string;
};

export function UserProfileDrawer() {
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: "",
    phoneNumber: "",
    email: "",
    age: "",
    photoURL: "",
    role: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "role">("profile");
  const [admissionProof, setAdmissionProof] = useState<File | null>(null);
  const [marksheetProof, setMarksheetProof] = useState<File | null>(null);
  const [abcId, setAbcId] = useState("");
  const [school, setSchool] = useState("");
  const [location, setLocation] = useState("");
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [showGreenSevakForm, setShowGreenSevakForm] = useState(false);
  const [familyMembers, setFamilyMembers] = useState("");
  const [incomeProof, setIncomeProof] = useState<File | null>(null);

  const { toast } = useToast();
  
  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setProfileData({
              name: userData.name || "",
              phoneNumber: userData.phoneNumber || "",
              email: userData.email || user.email || "",
              age: userData.age || "",
              photoURL: userData.photoURL || "",
              role: userData.role || null,
              roleLockDate: userData.roleLockDate || null
            });
            setSelectedRole(userData.role || null);
          } else {
            // Initialize with current user email
            setProfileData(prev => ({
              ...prev,
              email: user.email || "",
              photoURL: user.photoURL || ""
            }));
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load user profile data"
          });
        }
      }
      setIsLoading(false);
    };

    if (open) {
      loadUserData();
    }
  }, [open, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload this to Firebase Storage
      // For now, we'll just create a data URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, photoURL: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const saveProfileData = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You need to be logged in to save your profile"
      });
      return;
    }
    
    try {
      await update(ref(database, `users/${user.uid}`), {
        name: profileData.name,
        phoneNumber: profileData.phoneNumber,
        email: profileData.email,
        age: profileData.age,
        photoURL: profileData.photoURL,
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved"
      });
    } catch (error) {
      console.error("Error saving profile data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your profile data"
      });
    }
  };
  
  const handleRoleSelect = async (role: UserRole) => {
    // Check if user already has a role
    if (profileData.role && profileData.roleLockDate) {
      // Calculate if 5 days have passed since role selection
      const lockDate = new Date(profileData.roleLockDate);
      const currentDate = new Date();
      const daysPassed = Math.floor((currentDate.getTime() - lockDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysPassed < 5) {
        toast({
          variant: "destructive",
          title: "Role Change Not Allowed",
          description: `You can change your role after ${5 - daysPassed} more days`
        });
        return;
      }
    }
    
    setSelectedRole(role);
    
    if (role === "volunteer") {
      setShowVolunteerForm(true);
      setShowGreenSevakForm(false);
    } else if (role === "green_sevak") {
      setShowVolunteerForm(false);
      setShowGreenSevakForm(true);
    } else {
      // For guest role, directly set it
      applyAsGuest();
    }
  };
  
  const applyAsGuest = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      await update(ref(database, `users/${user.uid}`), {
        role: "guest",
        roleLockDate: new Date().toISOString()
      });
      
      setProfileData(prev => ({
        ...prev,
        role: "guest",
        roleLockDate: new Date().toISOString()
      }));
      
      toast({
        title: "Welcome Guest!",
        description: "You've joined as a guest user"
      });
      
      setActiveTab("profile");
    } catch (error) {
      console.error("Error setting guest role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set your role as guest"
      });
    }
  };
  
  const submitVolunteerApplication = async () => {
    if (!abcId || abcId.length !== 12 || !school || !location) {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill in all required fields. ABC ID must be 12 digits."
      });
      return;
    }
    
    if (!admissionProof || !marksheetProof) {
      toast({
        variant: "destructive",
        title: "Missing Documents",
        description: "Please upload all required documents"
      });
      return;
    }
    
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      // In a real app, you would upload files to Firebase Storage
      // Here we just log the filenames
      console.log("Admission proof:", admissionProof.name);
      console.log("Marksheet proof:", marksheetProof.name);
      
      // Save volunteer application data
      await update(ref(database, `users/${user.uid}`), {
        role: "volunteer",
        roleLockDate: new Date().toISOString(),
        volunteerDetails: {
          abcId,
          school,
          location,
          applicationDate: new Date().toISOString(),
          status: "approved" // Auto-approved for demo
        }
      });
      
      setProfileData(prev => ({
        ...prev,
        role: "volunteer",
        roleLockDate: new Date().toISOString()
      }));
      
      toast({
        title: "Application Approved!",
        description: "Your volunteer registration is confirmed!"
      });
      
      setActiveTab("profile");
      setShowVolunteerForm(false);
    } catch (error) {
      console.error("Error submitting volunteer application:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your volunteer application"
      });
    }
  };
  
  const submitGreenSevakApplication = async () => {
    if (!familyMembers) {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill in all required fields"
      });
      return;
    }
    
    if (!incomeProof) {
      toast({
        variant: "destructive",
        title: "Missing Documents",
        description: "Please upload income proof document"
      });
      return;
    }
    
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      // In a real app, you would upload files to Firebase Storage
      console.log("Income proof:", incomeProof.name);
      
      // Save green sevak application data
      await update(ref(database, `users/${user.uid}`), {
        role: "green_sevak",
        roleLockDate: new Date().toISOString(),
        greenSevakDetails: {
          familyMembers,
          applicationDate: new Date().toISOString(),
          status: "pending"
        }
      });
      
      setProfileData(prev => ({
        ...prev,
        role: "green_sevak",
        roleLockDate: new Date().toISOString()
      }));
      
      toast({
        title: "Application Submitted",
        description: "Your Green Sevak application is under review. You can use the app as a guest until approval."
      });
      
      setActiveTab("profile");
      setShowGreenSevakForm(false);
    } catch (error) {
      console.error("Error submitting green sevak application:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your Green Sevak application"
      });
    }
  };
  
  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const getRoleBadge = () => {
    if (!profileData.role) return null;
    
    const badgeStyles = {
      volunteer: "bg-[#9b87f5] hover:bg-[#9b87f5]/80",
      green_sevak: "bg-[#7FB069] hover:bg-[#7FB069]/80",
      guest: "bg-[#FEC6A1] hover:bg-[#FEC6A1]/80"
    };
    
    const roleText = {
      volunteer: "Volunteer",
      green_sevak: "Green Sevak",
      guest: "Guest"
    };
    
    return (
      <Badge className={badgeStyles[profileData.role]}>
        {roleText[profileData.role]}
      </Badge>
    );
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50">
          <Menu className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle className="flex items-center justify-between">
            <span>Your Profile</span> 
            {getRoleBadge()}
          </DrawerTitle>
        </DrawerHeader>
        
        {isLoading ? (
          <div className="flex justify-center p-6">Loading profile...</div>
        ) : (
          <div className="px-4 pb-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "profile" | "role")}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="role">Role Selection</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-2 border-[#9b87f5]">
                      {profileData.photoURL ? (
                        <AvatarImage src={profileData.photoURL} alt={profileData.name || "User"} />
                      ) : (
                        <AvatarFallback>
                          <User className="h-12 w-12 text-[#9b87f5]" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <label 
                      htmlFor="profile-photo-upload" 
                      className="absolute bottom-0 right-0 bg-[#9b87f5] rounded-full p-1 cursor-pointer"
                    >
                      <Upload className="h-4 w-4 text-white" />
                    </label>
                    <input
                      id="profile-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      value={profileData.age}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="Enter your age"
                    />
                  </div>
                  
                  <Button 
                    onClick={saveProfileData}
                    className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
                  >
                    Save Profile
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="role">
                {profileData.role ? (
                  <Card>
                    <CardHeader>
                      <div className="text-lg font-medium">Current Role: {profileData.role.replace("_", " ").charAt(0).toUpperCase() + profileData.role.replace("_", " ").slice(1)}</div>
                    </CardHeader>
                    <CardContent>
                      {profileData.roleLockDate && (
                        <p className="text-sm text-muted-foreground mb-4">
                          Role selected on: {new Date(profileData.roleLockDate).toLocaleDateString()}. 
                          You can change your role after 5 days from selection.
                        </p>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setActiveTab("profile")}
                        >
                          Back to Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground">
                        Please select one of the following roles. You can only select one role and it will be locked for 5 days.
                      </p>
                    </div>
                    
                    {!showVolunteerForm && !showGreenSevakForm ? (
                      <div className="grid gap-4">
                        <Card 
                          className={`cursor-pointer hover:border-[#9b87f5] transition-all ${selectedRole === 'volunteer' ? 'border-[#9b87f5] bg-[#9b87f5]/10' : ''}`}
                          onClick={() => handleRoleSelect('volunteer')}
                        >
                          <CardContent className="flex items-center gap-4 pt-6">
                            <div className="p-2 rounded-full bg-[#9b87f5]/20">
                              <UserCheck className="h-6 w-6 text-[#9b87f5]" />
                            </div>
                            <div>
                              <h3 className="font-medium">Register as Volunteer</h3>
                              <p className="text-sm text-muted-foreground">For students and active community members</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer hover:border-[#7FB069] transition-all ${selectedRole === 'green_sevak' ? 'border-[#7FB069] bg-[#7FB069]/10' : ''}`}
                          onClick={() => handleRoleSelect('green_sevak')}
                        >
                          <CardContent className="flex items-center gap-4 pt-6">
                            <div className="p-2 rounded-full bg-[#7FB069]/20">
                              <Users className="h-6 w-6 text-[#7FB069]" />
                            </div>
                            <div>
                              <h3 className="font-medium">Register as Green Sevak</h3>
                              <p className="text-sm text-muted-foreground">For plant care takers and nature enthusiasts</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer hover:border-[#FEC6A1] transition-all ${selectedRole === 'guest' ? 'border-[#FEC6A1] bg-[#FEC6A1]/10' : ''}`}
                          onClick={() => handleRoleSelect('guest')}
                        >
                          <CardContent className="flex items-center gap-4 pt-6">
                            <div className="p-2 rounded-full bg-[#FEC6A1]/20">
                              <User className="h-6 w-6 text-[#FEC6A1]" />
                            </div>
                            <div>
                              <h3 className="font-medium">Start Journey as Guest</h3>
                              <p className="text-sm text-muted-foreground">Explore the app without additional responsibilities</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : showVolunteerForm ? (
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div className="text-lg font-medium">Volunteer Registration</div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setShowVolunteerForm(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="abcId">ABC ID (12 digits)</Label>
                              <Input
                                id="abcId"
                                value={abcId}
                                onChange={(e) => setAbcId(e.target.value)}
                                maxLength={12}
                                placeholder="Enter your 12 digit ABC ID"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="school">College/University/School Name</Label>
                              <Input
                                id="school"
                                value={school}
                                onChange={(e) => setSchool(e.target.value)}
                                placeholder="Enter your institution name"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="location">Institution Location</Label>
                              <Input
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter institution location"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="admissionProof">Current Year Admission Proof</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Button 
                                  variant="outline" 
                                  onClick={() => document.getElementById('admissionProof')?.click()}
                                  className="flex-1"
                                >
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  {admissionProof ? admissionProof.name : "Upload Admission Proof"}
                                </Button>
                                <input
                                  id="admissionProof"
                                  type="file"
                                  onChange={handleFileChange(setAdmissionProof)}
                                  className="hidden"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="marksheetProof">Previous Year Marksheet</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Button 
                                  variant="outline" 
                                  onClick={() => document.getElementById('marksheetProof')?.click()}
                                  className="flex-1"
                                >
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  {marksheetProof ? marksheetProof.name : "Upload Marksheet"}
                                </Button>
                                <input
                                  id="marksheetProof"
                                  type="file"
                                  onChange={handleFileChange(setMarksheetProof)}
                                  className="hidden"
                                />
                              </div>
                            </div>
                            
                            <Button 
                              onClick={submitVolunteerApplication}
                              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
                            >
                              Submit Application
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div className="text-lg font-medium">Green Sevak Registration</div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setShowGreenSevakForm(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4 p-3 bg-[#7FB069]/10 rounded-md">
                            <p className="text-sm">
                              <strong>Plant Care Taker Criteria:</strong> As a Green Sevak, you'll be responsible for nurturing trees in your community. 
                              Only one member per family can apply for this role.
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="familyMembers">Number of Family Members</Label>
                              <Input
                                id="familyMembers"
                                value={familyMembers}
                                onChange={(e) => setFamilyMembers(e.target.value)}
                                placeholder="Enter number of family members"
                                type="number"
                              />
                            </div>
                                                        
                            <div>
                              <Label htmlFor="incomeProof">Income Proof</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Button 
                                  variant="outline" 
                                  onClick={() => document.getElementById('incomeProof')?.click()}
                                  className="flex-1"
                                >
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  {incomeProof ? incomeProof.name : "Upload Income Proof"}
                                </Button>
                                <input
                                  id="incomeProof"
                                  type="file"
                                  onChange={handleFileChange(setIncomeProof)}
                                  className="hidden"
                                />
                              </div>
                            </div>
                            
                            <Button 
                              onClick={submitGreenSevakApplication}
                              className="w-full bg-[#7FB069] hover:bg-[#6A9957]"
                            >
                              Submit Application
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        <DrawerFooter>
          <Button 
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
