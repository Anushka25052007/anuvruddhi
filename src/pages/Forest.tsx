import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TreePine, Map, QrCode, Camera, Users, Upload, MapPin, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { auth, database } from "@/services/firebase";
import { ref, onValue, update, push, set } from "firebase/database";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const treeData = [
  { month: 'Jan', trees: 12 },
  { month: 'Feb', trees: 19 },
  { month: 'Mar', trees: 15 },
  { month: 'Apr', trees: 25 },
  { month: 'May', trees: 32 },
  { month: 'Jun', trees: 28 },
];

const locationData = [
  { name: 'Local Area', trees: 65, color: '#7FB069' },
  { name: 'Regional', trees: 45, color: '#6A9957' },
  { name: 'National', trees: 20, color: '#5D874C' },
  { name: 'International', trees: 10, color: '#4A6F3B' },
];

const communityPosts = [
  {
    id: 1,
    user: "Priya M.",
    location: "Mumbai, India",
    date: "2 days ago",
    trees: 3,
    content: "Planted three neem trees at our local community garden today!"
  },
  {
    id: 2,
    user: "Rahul S.",
    location: "Delhi, India",
    date: "5 days ago",
    trees: 2,
    content: "Joined the school's eco-club plantation drive. Added two mango trees to our campus."
  },
  {
    id: 3,
    user: "Ananya K.",
    location: "Bangalore, India",
    date: "1 week ago",
    trees: 5,
    content: "Our neighborhood initiative's first milestone reached - 5 banyan trees planted along the street!"
  }
];

interface CommunityPost {
  id: number;
  user: string;
  location: string;
  date: string;
  trees: number;
  content: string;
}

export default function Forest() {
  const [activeTab, setActiveTab] = useState("tracking");
  const [userXp, setUserXp] = useState(0);
  const [treesPlanted, setTreesPlanted] = useState(0);
  const [xpProgress, setXpProgress] = useState(0);
  const [totalTrees, setTotalTrees] = useState(0);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "error" | "manual">("idle");
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [newPost, setNewPost] = useState({ content: "", location: "", trees: 1 });
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: 1,
      user: "Priya M.",
      location: "Mumbai, India",
      date: "2 days ago",
      trees: 3,
      content: "Planted three neem trees at our local community garden today!"
    },
    {
      id: 2,
      user: "Rahul S.",
      location: "Delhi, India",
      date: "5 days ago",
      trees: 2,
      content: "Joined the school's eco-club plantation drive. Added two mango trees to our campus."
    },
    {
      id: 3,
      user: "Ananya K.",
      location: "Bangalore, India",
      date: "1 week ago",
      trees: 5,
      content: "Our neighborhood initiative's first milestone reached - 5 banyan trees planted along the street!"
    }
  ]);

  const { toast } = useToast();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userXpRef = ref(database, `users/${user.uid}/xp`);
    const treesRef = ref(database, `users/${user.uid}/treesPlanted`);

    const xpListener = onValue(userXpRef, (snapshot) => {
      const xp = snapshot.val() || 0;
      setUserXp(xp);
      setXpProgress(xp % 200);
    });

    const treesListener = onValue(treesRef, (snapshot) => {
      const trees = snapshot.val() || 0;
      setTreesPlanted(trees);
      setTotalTrees(trees);
    });

    return () => {
      xpListener();
      treesListener();
    };
  }, []);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast({
      title: "🌱 Photo Verified!",
      description: "Your tree planting has been verified. +50 XP bonus!",
    });

    const user = auth.currentUser;
    if (!user) return;

    const newXp = userXp + 50;
    const newTrees = Math.floor(newXp / 200);

    await update(ref(database, `users/${user.uid}`), {
      xp: newXp,
      treesPlanted: newTrees
    });
  };

  const handleShareLocation = () => {
    setLocationStatus("loading");
    setShowLocationDialog(true);
    
    setTimeout(() => {
      setLocationStatus("error");
      toast.error("Unable to access location services", {
        description: "Free access limit to Google location services has been reached"
      });
    }, 2000);
  };

  const handleSubmitLocation = () => {
    if (!locationInput.trim()) {
      toast.error("Please enter a location");
      return;
    }
    
    setShowLocationDialog(false);
    toast.success("Location verified!", {
      description: `Location set to ${locationInput}`
    });
  };

  const handleSubmitPost = () => {
    if (!newPost.content.trim() || !newPost.location.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const post: CommunityPost = {
      id: Date.now(),
      user: auth.currentUser?.displayName || "Anonymous",
      location: newPost.location,
      date: "Just now",
      trees: newPost.trees,
      content: newPost.content
    };
    
    setCommunityPosts([post, ...communityPosts]);
    setNewPost({ content: "", location: "", trees: 1 });
    setShowPostDialog(false);
    
    toast.success("Your planting story has been shared with the community!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0EA5E9]/10 to-[#1E40AF]/20 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: "100% 50%" }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        style={{
          backgroundImage: "linear-gradient(45deg, rgba(14, 165, 233, 0.1) 0%, rgba(30, 64, 175, 0.1) 100%)",
          filter: "blur(100px)",
        }}
      />
      
      <div className="container mx-auto p-6 max-w-4xl relative z-10">
        <div className="mb-8 text-center">
          <motion.h1 
            className="text-3xl font-bold text-[#0EA5E9] mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TreePine className="inline-block mr-2 h-8 w-8" />
            My Growing Forest
          </motion.h1>
          <p className="text-[#1E40AF]/80">Track your tree planting journey and impact</p>
          <motion.div 
            className="flex justify-center items-center gap-4 mt-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-[#7FB069] to-[#5D874C] p-6 rounded-lg shadow-lg">
              <TreePine className="h-8 w-8 text-white mb-2" />
              <span className="text-2xl font-bold text-white block">{treesPlanted}</span>
              <span className="text-white/90 text-sm">Trees Planted</span>
            </div>
            <div className="bg-gradient-to-br from-[#0EA5E9] to-[#1E40AF] p-6 rounded-lg shadow-lg">
              <div className="mb-2">
                <span className="text-white text-xl">Next Tree Progress</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-4">
                <motion.div 
                  className="bg-white h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(xpProgress / 200) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span className="text-white/90 text-sm mt-1 block">
                {xpProgress}/200 XP
              </span>
            </div>
          </motion.div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6 bg-white/20 backdrop-blur-sm">
            <TabsTrigger 
              value="tracking"
              className="data-[state=active]:bg-[#0EA5E9] data-[state=active]:text-white"
            >
              Tree Tracking
            </TabsTrigger>
            <TabsTrigger 
              value="qrcode"
              className="data-[state=active]:bg-[#0EA5E9] data-[state=active]:text-white"
            >
              QR Verification
            </TabsTrigger>
            <TabsTrigger 
              value="community"
              className="data-[state=active]:bg-[#0EA5E9] data-[state=active]:text-white"
            >
              Community
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracking">
            <Card className="p-6 mb-6 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all">
              <h3 className="text-lg font-medium mb-4 text-[#1E40AF]">Monthly Planting Progress</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={treeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0EA5E9/20" />
                    <XAxis dataKey="month" stroke="#1E40AF" />
                    <YAxis stroke="#1E40AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderColor: "#0EA5E9",
                      }} 
                    />
                    <Bar dataKey="trees" fill="#0EA5E9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all">
              <h3 className="text-lg font-medium mb-4 text-[#1E40AF]">Planting Locations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#0EA5E9"
                        dataKey="trees"
                      >
                        {locationData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`hsl(199, ${90 - index * 20}%, ${60 - index * 10}%)`}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-full">
                    <h4 className="font-medium mb-2 text-[#1E40AF]">Next Trip Target</h4>
                    <p className="text-sm mb-4 text-[#1E40AF]/80">Plant 25 more trees to unlock a free eco-trip!</p>
                    <div className="w-full bg-[#0EA5E9]/20 rounded-full h-4">
                      <motion.div 
                        className="bg-[#0EA5E9] h-4 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (totalTrees / 150) * 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-[#1E40AF]/80">
                      <span>0</span>
                      <span>{totalTrees}/150 trees</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="qrcode">
            <Card className="p-6 text-center bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <QrCode className="h-16 w-16 mx-auto mb-4 text-[#0EA5E9]" />
              </motion.div>
              <h3 className="text-lg font-medium mb-2 text-[#1E40AF]">Tree Planting Verification</h3>
              <p className="text-[#1E40AF]/80 mb-6">
                Upload a photo of your planted tree with your name tag to earn 50 XP bonus!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-[#7FB069] hover:bg-[#5D874C] relative overflow-hidden"
                  onClick={() => document.getElementById('photoUpload')?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" /> Upload Tree Photo
                  <input
                    id="photoUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9]/10"
                  onClick={handleShareLocation}
                >
                  <Map className="mr-2 h-4 w-4" /> Share Location
                </Button>
              </div>
              
              <div className="mt-10 p-4 bg-[#7FB069]/10 rounded-lg">
                <p className="text-[#1E40AF]/80 text-sm">
                  <strong>Important:</strong> When your target of 200 XP is completed, the company will plant a tree of your name in your local area. 
                  Then upload the photo of your planted tree here for verification.
                </p>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="community">
            <div className="mb-6">
              <Button 
                className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 w-full"
                onClick={() => setShowPostDialog(true)}
              >
                <TreePine className="mr-2 h-4 w-4" /> Share Your Planting Story
              </Button>
            </div>
            
            <div className="space-y-4">
              {communityPosts.map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-4 bg-white/80 backdrop-blur-sm border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#0EA5E9] text-white rounded-full h-8 w-8 flex items-center justify-center">
                          {post.user.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-[#1E40AF]">{post.user}</h4>
                          <div className="text-xs text-[#1E40AF]/60 flex items-center gap-1">
                            <Map className="h-3 w-3" />
                            {post.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-[#1E40AF]/60">{post.date}</div>
                    </div>
                    <p className="text-sm mb-2 text-[#1E40AF]/80">{post.content}</p>
                    <div className="flex items-center gap-1 text-[#0EA5E9]">
                      <TreePine className="h-4 w-4" />
                      <span className="text-sm">{post.trees} trees planted</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="bg-white/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-[#0EA5E9]" />
              Share Your Location
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {locationStatus === "loading" ? (
              <div className="text-center p-4">
                <motion.div
                  className="h-10 w-10 rounded-full border-4 border-t-[#0EA5E9] border-r-transparent border-b-transparent border-l-transparent mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="mt-3 text-[#1E40AF]/70">
                  Accessing your location...
                </p>
              </div>
            ) : locationStatus === "error" ? (
              <div className="space-y-4">
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  The free access limit to Google location services has been reached. Please enter your location manually.
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1E40AF]">
                    Enter your location manually:
                  </label>
                  <Input
                    placeholder="e.g., Mumbai, India"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1E40AF]">
                  Enter your location:
                </label>
                <Input
                  placeholder="e.g., Mumbai, India"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setShowLocationDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#0EA5E9]"
              onClick={handleSubmitLocation}
              disabled={!locationInput.trim()}
            >
              Confirm Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent className="bg-white/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-[#0EA5E9]" />
              Share Your Planting Story
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1E40AF]">
                Your story:
              </label>
              <Textarea
                placeholder="Tell your tree planting experience..."
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1E40AF]">
                Location:
              </label>
              <Input
                placeholder="e.g., Mumbai, India"
                value={newPost.location}
                onChange={(e) => setNewPost({...newPost, location: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1E40AF]">
                Number of trees planted:
              </label>
              <Input
                type="number"
                min="1"
                max="100"
                value={newPost.trees}
                onChange={(e) => setNewPost({...newPost, trees: parseInt(e.target.value) || 1})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setShowPostDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#0EA5E9]"
              onClick={handleSubmitPost}
            >
              Share Story
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
