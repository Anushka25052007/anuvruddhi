
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth } from "@/services/firebase";
import { useToast } from "@/hooks/use-toast";
import { getUserData, listenToUserXp } from "@/services/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParticleEffect } from "@/components/motivation/ParticleEffect";
import { LifeAvatar } from "@/components/temple/LifeAvatar";
import { SoulGemCollection } from "@/components/temple/SoulGemCollection";
import { MirrorOfGrowth } from "@/components/temple/MirrorOfGrowth";
import { LegacyJournal } from "@/components/temple/LegacyJournal";
import { PurposeQuests } from "@/components/temple/PurposeQuests";
import { LifespanPredictor } from "@/components/temple/LifespanPredictor";
import { Heart, Award, BookOpen, Compass, Zap, Sparkles, Flower2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function TempleOfYou() {
  const [userData, setUserData] = useState<any>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
          
          // Set streak days (this could come from Firebase in a real implementation)
          // For demo purposes, we'll calculate it based on the XP
          setStreakDays(Math.floor((data?.xp || 0) / 25));
          
          // Listen to XP changes
          const xpUnsubscribe = listenToUserXp(user.uid, (xp) => {
            setTotalXp(xp || 0);
          });
          
          setLoading(false);
          return () => xpUnsubscribe();
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast({
            title: "Error",
            description: "Failed to load your data. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        navigate("/");
      }
    });
    
    return () => unsubscribe();
  }, [navigate, toast]);

  const getVirtueLevel = (category: string) => {
    // Simplified logic for now - in real implementation, this would be based on 
    // specific task completions stored in Firebase
    const baseValue = Math.floor(totalXp / 50);
    
    switch(category) {
      case "peace": return baseValue + 2;
      case "strength": return baseValue + 1;
      case "compassion": return baseValue + 3;
      case "wisdom": return baseValue;
      default: return baseValue;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F1D31] to-[#1A1F2C]">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Sparkles className="h-8 w-8 text-[#9b87f5]" />
          </div>
          <p className="text-white/80">Building your temple...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1D31] to-[#1A1F2C] text-white relative overflow-hidden">
      <ParticleEffect />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#9b87f5] mb-2 flex items-center">
              <Sparkles className="mr-2 h-6 w-6" />
              Temple of You
            </h1>
            <p className="text-white/70">Your spiritual and personal growth sanctuary</p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Link to="/habits">
              <Button variant="outline" className="border-[#9b87f5]/30 text-[#9b87f5] hover:bg-[#9b87f5]/20">
                <Flower2 className="mr-2 h-4 w-4" />
                Habit Garden
              </Button>
            </Link>
            <Link to="/certificates">
              <Button variant="outline" className="border-[#9b87f5]/30 text-[#9b87f5] hover:bg-[#9b87f5]/20">
                <Award className="mr-2 h-4 w-4" />
                Certificates
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - User profile and attributes */}
          <div className="space-y-6">
            <Card className="bg-[#1A1F2C]/80 border-[#9b87f5]/30 backdrop-blur-sm text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-[#ea384c]" />
                  {userData?.fullName || "Seeker"}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {userData?.email || "unknown@email.com"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Soul Level</span>
                  <Badge variant="outline" className="bg-[#9b87f5]/20 text-[#9b87f5] border-[#9b87f5]/30">
                    {Math.floor(totalXp / 100) + 1}
                  </Badge>
                </div>
                
                <Progress value={totalXp % 100} className="h-2 bg-white/10" />
                
                <Separator className="bg-white/10" />
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-[#1E2333] rounded-md text-center">
                    <div className="font-bold text-xl text-[#9b87f5]">{getVirtueLevel("peace")}</div>
                    <div className="text-xs text-white/70">Peace</div>
                  </div>
                  <div className="p-3 bg-[#1E2333] rounded-md text-center">
                    <div className="font-bold text-xl text-[#1EAEDB]">{getVirtueLevel("strength")}</div>
                    <div className="text-xs text-white/70">Strength</div>
                  </div>
                  <div className="p-3 bg-[#1E2333] rounded-md text-center">
                    <div className="font-bold text-xl text-[#D946EF]">{getVirtueLevel("compassion")}</div>
                    <div className="text-xs text-white/70">Compassion</div>
                  </div>
                  <div className="p-3 bg-[#1E2333] rounded-md text-center">
                    <div className="font-bold text-xl text-[#7FB069]">{getVirtueLevel("wisdom")}</div>
                    <div className="text-xs text-white/70">Wisdom</div>
                  </div>
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Soul Gems</span>
                  <span className="font-medium text-[#9b87f5]">{Math.floor(totalXp / 10)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Purpose Quests</span>
                  <span className="font-medium text-[#1EAEDB]">{Math.floor(totalXp / 50)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Journal Entries</span>
                  <span className="font-medium text-[#7FB069]">{Math.floor(totalXp / 15)}</span>
                </div>
              </CardContent>
            </Card>
            
            <LifespanPredictor userData={userData} totalXp={totalXp} />
            
            <Card className="bg-[#1A1F2C]/80 border-[#9b87f5]/30 backdrop-blur-sm text-white overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Compass className="mr-2 h-5 w-5 text-[#1EAEDB]" /> 
                  Current Quest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-md bg-gradient-to-br from-[#1E2333] to-[#252A3D] border border-[#9b87f5]/10">
                  <h3 className="font-medium text-[#9b87f5] mb-2">7-Day Digital Detox</h3>
                  <p className="text-sm text-white/70 mb-3">Reduce screen time by 30% for one week to earn a rare Clarity Gem.</p>
                  <div className="flex justify-between items-center">
                    <Progress value={30} className="h-2 w-3/4 bg-white/10" />
                    <span className="text-xs text-white/70">3/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Middle column - Life Avatar */}
          <div className="flex flex-col gap-6 items-center">
            <LifeAvatar xpLevel={totalXp} streakDays={streakDays} />
            <SoulGemCollection totalXp={totalXp} />
          </div>
          
          {/* Right column - Tabs for different modules */}
          <div>
            <Tabs defaultValue="mirror" className="w-full">
              <TabsList className="bg-[#1E2333] w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="mirror" className="data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
                  Mirror
                </TabsTrigger>
                <TabsTrigger value="journal" className="data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
                  Journal
                </TabsTrigger>
                <TabsTrigger value="quests" className="data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
                  Quests
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="mirror" className="mt-0">
                <Card className="bg-[#1A1F2C]/80 border-[#9b87f5]/30 backdrop-blur-sm text-white h-[500px]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Zap className="mr-2 h-5 w-5 text-[#9b87f5]" />
                      Mirror of Growth
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Weekly insights based on your journey
                    </CardDescription>
                  </CardHeader>
                  <ScrollArea className="h-[390px]">
                    <CardContent>
                      <MirrorOfGrowth totalXp={totalXp} userData={userData} />
                    </CardContent>
                  </ScrollArea>
                </Card>
              </TabsContent>
              
              <TabsContent value="journal" className="mt-0">
                <Card className="bg-[#1A1F2C]/80 border-[#9b87f5]/30 backdrop-blur-sm text-white h-[500px]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-[#7FB069]" />
                      Legacy Journal
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Your personal growth chronicle
                    </CardDescription>
                  </CardHeader>
                  <ScrollArea className="h-[390px]">
                    <CardContent>
                      <LegacyJournal totalXp={totalXp} />
                    </CardContent>
                  </ScrollArea>
                </Card>
              </TabsContent>
              
              <TabsContent value="quests" className="mt-0">
                <Card className="bg-[#1A1F2C]/80 border-[#9b87f5]/30 backdrop-blur-sm text-white h-[500px]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Compass className="mr-2 h-5 w-5 text-[#1EAEDB]" />
                      Purpose Quests
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Weekly challenges to deepen your practice
                    </CardDescription>
                  </CardHeader>
                  <ScrollArea className="h-[390px]">
                    <CardContent>
                      <PurposeQuests totalXp={totalXp} />
                    </CardContent>
                  </ScrollArea>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
