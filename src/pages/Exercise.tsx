
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Flame, Sparkles, Heart, Timer, Camera, Check } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const exerciseCategories = [
  {
    name: "Yoga",
    icon: Heart,
    color: "#D946EF",
    exercises: [
      { name: "Sun Salutation", duration: "10 mins", level: "Beginner" },
      { name: "Warrior Sequence", duration: "15 mins", level: "Intermediate" },
      { name: "Balance Flow", duration: "20 mins", level: "Advanced" }
    ]
  },
  {
    name: "Cardio",
    icon: Flame,
    color: "#F97316",
    exercises: [
      { name: "Quick HIIT", duration: "10 mins", level: "Beginner" },
      { name: "Interval Training", duration: "20 mins", level: "Intermediate" },
      { name: "Endurance Run", duration: "30 mins", level: "Advanced" }
    ]
  },
  {
    name: "Strength",
    icon: Dumbbell,
    color: "#1EAEDB",
    exercises: [
      { name: "Bodyweight Basics", duration: "15 mins", level: "Beginner" },
      { name: "Core Power", duration: "20 mins", level: "Intermediate" },
      { name: "Full Body Strength", duration: "25 mins", level: "Advanced" }
    ]
  }
];

export default function Exercise() {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [exerciseProof, setExerciseProof] = useState<File | null>(null);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleStartTimer = (exerciseName: string, durationText: string) => {
    // Already running for this exercise
    if (timerRunning && activeExercise === exerciseName) return;
    
    // Stop previous timer if exists
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Parse duration from text (e.g. "10 mins" -> 600 seconds)
    const minutes = parseInt(durationText.split(' ')[0]);
    const seconds = minutes * 60;
    
    setActiveExercise(exerciseName);
    setTimeRemaining(seconds);
    setTimerRunning(true);
    
    // Start new timer
    timerRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Timer complete
          clearInterval(timerRef.current!);
          setTimerRunning(false);
          setShowProofDialog(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    toast.info(`Started ${exerciseName} timer for ${minutes} minutes`);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExerciseProof(file);
    }
  };

  const handleSubmitProof = () => {
    if (!exerciseProof) {
      toast.error("Please upload a proof image first");
      return;
    }
    
    if (!activeExercise) return;
    
    // Mark the exercise as completed
    setCompletedExercises(prev => [...prev, activeExercise]);
    
    // Reset states
    setShowProofDialog(false);
    setExerciseProof(null);
    setActiveExercise(null);
    
    toast.success("Exercise completed! +20 XP", {
      description: "Great job on completing your workout!"
    });
  };

  const handleSkipProof = () => {
    setShowProofDialog(false);
    setExerciseProof(null);
    
    toast.info("Exercise skipped", {
      description: "No proof uploaded, no XP awarded"
    });
  };

  // Calculate total XP
  const calculateTotalXp = () => {
    return completedExercises.length * 20;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D3E4FD] to-[#FFDEE2] relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#F97316]/10 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#D946EF]/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -15, 0],
          y: [0, 15, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <div className="container mx-auto p-6 max-w-4xl relative z-10">
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-[#2D3047] mb-2 flex items-center justify-center">
              <Flame className="mr-3 h-8 w-8 text-[#F97316]" />
              <span className="bg-gradient-to-r from-[#1EAEDB] to-[#F97316] bg-clip-text text-transparent">
                Exercise Hub
              </span>
            </h1>
            <p className="text-[#2D3047]/70">Build strength and vitality through regular exercise</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex justify-center"
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-[#9b87f5]/20 px-6 py-3 inline-flex items-center">
              <div className="flex items-center mr-6">
                <div className="p-2 rounded-full bg-[#F97316]/20 mr-2">
                  <Flame className="h-4 w-4 text-[#F97316]" />
                </div>
                <div>
                  <span className="block text-xs text-[#2D3047]/70">Completed</span>
                  <span className="font-medium">{completedExercises.length}</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-[#9b87f5]/20 mr-2">
                  <Sparkles className="h-4 w-4 text-[#9b87f5]" />
                </div>
                <div>
                  <span className="block text-xs text-[#2D3047]/70">XP Earned</span>
                  <span className="font-medium">{calculateTotalXp()}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue={exerciseCategories[0].name.toLowerCase()} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 backdrop-blur-sm bg-white/50">
            {exerciseCategories.map(category => (
              <TabsTrigger 
                key={category.name} 
                value={category.name.toLowerCase()}
                className="flex items-center gap-2 data-[state=active]:bg-white/80"
                style={{ 
                  color: category.color,
                }}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {exerciseCategories.map(category => (
            <TabsContent key={category.name} value={category.name.toLowerCase()}>
              <div className="grid gap-4">
                {category.exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 backdrop-blur-sm bg-white/70 border border-white/50 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div 
                            className="p-3 rounded-full mr-3" 
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            <category.icon className="h-5 w-5" style={{ color: category.color }} />
                          </div>
                          <div>
                            <h3 className="font-medium text-[#2D3047]">{exercise.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-[#2D3047]/60 mt-1">
                              <Timer className="h-3.5 w-3.5" />
                              <span>{exercise.duration}</span>
                              <span 
                                className="px-2 py-0.5 rounded-full text-xs"
                                style={{ backgroundColor: `${category.color}20`, color: category.color }}
                              >
                                {exercise.level}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {timerRunning && activeExercise === exercise.name ? (
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-bold mb-1" style={{ color: category.color }}>
                              {formatTime(timeRemaining)}
                            </span>
                            <span className="text-xs text-[#2D3047]/70">Timer running...</span>
                          </div>
                        ) : completedExercises.includes(exercise.name) ? (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-md text-sm font-medium text-white"
                            style={{ backgroundColor: category.color }}
                          >
                            <Check className="h-4 w-4" />
                          </motion.div>
                        ) : (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-md text-sm font-medium border text-[#2D3047]/70 border-[#2D3047]/20"
                            onClick={() => handleStartTimer(exercise.name, exercise.duration)}
                          >
                            Start Timer
                          </motion.button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <motion.div
          className="mt-8 p-5 bg-white/70 backdrop-blur-sm rounded-lg border border-[#9b87f5]/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-medium mb-3 text-[#2D3047] flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-[#9b87f5]" />
            Today's Progress
          </h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-full bg-[#2D3047]/10 h-3 rounded-full flex-1 mr-2">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-[#9b87f5] to-[#D946EF]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min((completedExercises.length / 9) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
              <span className="text-sm text-[#2D3047]/70">
                {completedExercises.length}/9
              </span>
            </div>
            <span className="font-medium text-[#D946EF]">{calculateTotalXp()} XP earned</span>
          </div>
        </motion.div>
      </div>

      {/* Exercise Proof Dialog */}
      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent className="bg-white/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2 text-[#F97316]" />
              Upload Exercise Proof
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-[#2D3047]/80 mb-4">
              Great job completing your exercise! Please upload a photo as proof to earn XP.
            </p>
            
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#9b87f5]/30 rounded-lg">
              {exerciseProof ? (
                <div className="text-center">
                  <div className="mb-2 text-[#9b87f5]">{exerciseProof.name}</div>
                  <img 
                    src={URL.createObjectURL(exerciseProof)} 
                    alt="Exercise proof" 
                    className="max-h-40 mx-auto object-contain rounded-md"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto text-[#9b87f5]/40 mb-2" />
                  <p className="text-[#2D3047]/70">Click to upload a photo</p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>
          
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleSkipProof}>
              Skip
            </Button>
            <Button 
              className="bg-gradient-to-r from-[#9b87f5] to-[#D946EF]"
              onClick={handleSubmitProof}
              disabled={!exerciseProof}
            >
              Submit Proof
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
