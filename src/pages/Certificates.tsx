import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, Download, Star, Trophy } from "lucide-react";
import { CertificateModal } from "@/components/certificates/CertificateModal";
import { ParticleEffect } from "@/components/motivation/ParticleEffect";
import { auth } from "@/services/firebase";
import { getUserData, listenToCertifiedTasks, listenToUserXp } from "@/services/firebase";
import { toast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

export default function Certificates() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [certifiedTasks, setCertifiedTasks] = useState<any[]>([]);
  const [xpLevel, setXpLevel] = useState(0);
  const [xpCertificateShown, setXpCertificateShown] = useState(false);
  
  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const data = await getUserData(user.uid);
        if (data) {
          setUserData({
            fullName: data.fullName || user.displayName || "User",
            email: data.email || user.email || "",
            location: data.location || "",
            phoneNo: data.phoneNo || "",
            age: data.age || ""
          });
          
          // Listen for XP changes
          const unsubscribeXp = listenToUserXp(user.uid, (xp) => {
            setXpLevel(xp);
            
            // Show certificate if XP milestone reached but not shown yet
            if (xp >= 100 && !xpCertificateShown) {
              toast({
                title: "🏆 Achievement Unlocked!",
                description: "You've reached 100 XP! View your certificate.",
                duration: 5000,
              });
              setXpCertificateShown(true);
            }
          });
          
          // Listen for certified tasks
          const unsubscribeTasks = listenToCertifiedTasks(user.uid, (tasks) => {
            setCertifiedTasks(tasks);
            
            // Show notification if new certified task is completed
            if (tasks.length > certifiedTasks.length && certifiedTasks.length > 0) {
              const newTask = tasks[tasks.length - 1];
              toast({
                title: "🌟 New Achievement!",
                description: `You've earned a certificate for: ${newTask.name}`,
                duration: 5000,
              });
            }
          });
          
          return () => {
            unsubscribeXp();
            unsubscribeTasks();
          };
        }
      } else {
        // Mock data for development/preview
        setUserData({
          fullName: "Anushka Sharma",
          email: "anushka@example.com",
          location: "Mumbai, India",
          phoneNo: "+91 98765 43210",
          age: "28"
        });
        
        setCertifiedTasks([
          {
            id: "1",
            name: "30 Days Meditation Challenge",
            completed: true,
            certified: true,
            date: new Date().toLocaleDateString()
          },
          {
            id: "2",
            name: "Daily Gratitude Journal - 15 Day Streak",
            completed: true,
            certified: true,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
          }
        ]);
        
        setXpLevel(125);
      }
    };
    
    loadUserData();
  }, []);
  
  const handleShowCertificate = (achievement: any) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };
  
  const handleShowXpCertificate = () => {
    const xpAchievement = {
      name: "Reaching 100 XP Milestone",
      xpLevel: xpLevel,
      date: new Date().toLocaleDateString()
    };
    
    setSelectedAchievement(xpAchievement);
    setIsModalOpen(true);
  };

  const canViewCertificates = xpLevel >= 75000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1D31] to-[#1A1F2C] text-white relative overflow-hidden">
      <ParticleEffect />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {canViewCertificates ? (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-[#E2D1C3] mb-2">
                Your Achievements
              </h1>
              <p className="text-[#9F9EA1] mb-6">
                View and download certificates for your accomplishments
              </p>
            </motion.div>
            
            <Tabs defaultValue="achievements" className="max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-2 mb-8 bg-[#1A1F2C] border border-[#9b87f5]/30">
                <TabsTrigger value="achievements" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-[#0F1D31]">
                  <Trophy className="mr-2 h-4 w-4" />
                  Achievements
                </TabsTrigger>
                <TabsTrigger value="milestones" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-[#0F1D31]">
                  <Star className="mr-2 h-4 w-4" />
                  XP Milestones
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="achievements" className="space-y-4">
                {certifiedTasks.length > 0 ? (
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certifiedTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="bg-[#222]/50 border-[#9b87f5]/30 backdrop-blur-md overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                              <div className="w-full h-full bg-[url('/lovable-uploads/a1f630c9-1610-45af-8613-37fe87fdfb8b.png')] bg-contain bg-no-repeat" />
                            </div>
                            
                            <CardContent className="p-6">
                              <div className="flex items-start mb-4">
                                <div className="mr-4">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] flex items-center justify-center">
                                    <Award className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-semibold text-[#E2D1C3] mb-1">
                                    {task.name}
                                  </h3>
                                  <p className="text-sm text-[#9F9EA1] mb-4">
                                    Completed on: {task.date}
                                  </p>
                                  <Button 
                                    onClick={() => handleShowCertificate({
                                      name: task.name,
                                      xpLevel: xpLevel,
                                      date: task.date
                                    })}
                                    className="bg-[#9b87f5] text-[#0F1D31] hover:bg-[#7E69AB]"
                                    size="sm"
                                  >
                                    <Download className="mr-2 h-4 w-4" />
                                    View Certificate
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Award className="h-16 w-16 text-[#9b87f5]/40 mb-4" />
                    <h3 className="text-xl font-semibold text-[#E2D1C3] mb-2">
                      No Achievements Yet
                    </h3>
                    <p className="text-[#9F9EA1] max-w-md">
                      Complete certified tasks to earn certificates that will appear here
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="milestones">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`${xpLevel >= 100 ? 'bg-gradient-to-br from-[#222]/70 to-[#333]/70' : 'bg-[#222]/30'} border-[#9b87f5]/30 backdrop-blur-md overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                        <div className="w-full h-full bg-[url('/lovable-uploads/a1f630c9-1610-45af-8613-37fe87fdfb8b.png')] bg-contain bg-no-repeat" />
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-start mb-4">
                          <div className="mr-4">
                            <div className={`w-12 h-12 rounded-full ${xpLevel >= 100 ? 'bg-gradient-to-br from-[#9b87f5] to-[#7E69AB]' : 'bg-[#333]'} flex items-center justify-center`}>
                              <Star className={`h-6 w-6 ${xpLevel >= 100 ? 'text-white' : 'text-[#9F9EA1]'}`} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-[#E2D1C3] mb-1">
                              100 XP Milestone
                            </h3>
                            <p className="text-sm text-[#9F9EA1] mb-2">
                              {xpLevel >= 100 ? 'Achieved!' : `Progress: ${xpLevel}/100 XP`}
                            </p>
                            <div className="w-full bg-[#333] h-2 rounded-full mb-4">
                              <div 
                                className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] h-full rounded-full"
                                style={{ width: `${Math.min(xpLevel, 100)}%` }}
                              ></div>
                            </div>
                            {xpLevel >= 100 ? (
                              <Button 
                                onClick={handleShowXpCertificate}
                                className="bg-[#9b87f5] text-[#0F1D31] hover:bg-[#7E69AB]"
                                size="sm"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                View Certificate
                              </Button>
                            ) : (
                              <Button 
                                disabled
                                variant="outline" 
                                className="text-[#9F9EA1] border-[#333]"
                                size="sm"
                              >
                                <Lock className="mr-2 h-4 w-4" />
                                Locked
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Card className={`bg-[#222]/30 border-[#9b87f5]/30 backdrop-blur-md overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                        <div className="w-full h-full bg-[url('/lovable-uploads/a1f630c9-1610-45af-8613-37fe87fdfb8b.png')] bg-contain bg-no-repeat" />
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-start mb-4">
                          <div className="mr-4">
                            <div className={`w-12 h-12 rounded-full ${xpLevel >= 200 ? 'bg-gradient-to-br from-[#9b87f5] to-[#7E69AB]' : 'bg-[#333]'} flex items-center justify-center`}>
                              <Star className={`h-6 w-6 ${xpLevel >= 200 ? 'text-white' : 'text-[#9F9EA1]'}`} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-[#E2D1C3] mb-1">
                              200 XP Milestone
                            </h3>
                            <p className="text-sm text-[#9F9EA1] mb-2">
                              {xpLevel >= 200 ? 'Achieved!' : `Progress: ${xpLevel}/200 XP`}
                            </p>
                            <div className="w-full bg-[#333] h-2 rounded-full mb-4">
                              <div 
                                className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] h-full rounded-full"
                                style={{ width: `${Math.min(xpLevel / 2, 100)}%` }}
                              ></div>
                            </div>
                            {xpLevel >= 200 ? (
                              <Button 
                                onClick={() => handleShowCertificate({
                                  name: "Reaching 200 XP Milestone",
                                  xpLevel: xpLevel,
                                  date: new Date().toLocaleDateString()
                                })}
                                className="bg-[#9b87f5] text-[#0F1D31] hover:bg-[#7E69AB]"
                                size="sm"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                View Certificate
                              </Button>
                            ) : (
                              <Button 
                                disabled
                                variant="outline" 
                                className="text-[#9F9EA1] border-[#333]"
                                size="sm"
                              >
                                <Lock className="mr-2 h-4 w-4" />
                                Locked
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <h2 className="text-3xl font-bold text-[#E2D1C3]">
                Certificate Access Locked
              </h2>
              <p className="text-[#9F9EA1] max-w-md mx-auto">
                Certificates become available when you reach 75,000 XP.
                Current XP: {xpLevel}
              </p>
              <div className="w-full max-w-md bg-[#252A3D] h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]"
                  style={{ width: `${Math.min((xpLevel / 75000) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-[#9F9EA1]">
                {Math.max(75000 - xpLevel, 0)} XP needed to unlock
              </p>
            </motion.div>
          </div>
        )}
      </div>
      
      {userData && selectedAchievement && (
        <CertificateModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          userData={userData}
          achievement={selectedAchievement}
        />
      )}
    </div>
  );
}
