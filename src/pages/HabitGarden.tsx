
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ParticleEffect } from "@/components/motivation/ParticleEffect";
import { HabitPlant } from "@/components/habits/HabitPlant";
import { DailyRitualCircle } from "@/components/habits/DailyRitualCircle";
import { ChainReactionPopup } from "@/components/habits/ChainReactionPopup";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, Award, Trophy } from "lucide-react";

const defaultHabits = [
  { id: 1, name: "Wake Up Early", streak: 0, type: "sunrise", xp: 10 },
  { id: 2, name: "Mindful Eating", streak: 0, type: "leaf", xp: 15 },
  { id: 3, name: "Gratitude Journal", streak: 0, type: "flower", xp: 12 },
  { id: 4, name: "Meditation", streak: 0, type: "lotus", xp: 20 },
];

const motivationalQuotes = [
  "Keep growing! Your habits are blooming beautifully!",
  "Amazing chain reaction! Your growth is unstoppable!",
  "Double the action, double the growth. Keep shining!",
  "You're creating a garden of positive change!",
];

// Milestone special tasks for approaching XP thresholds
const momentumBoostTasks = [
  { name: "Deep Breathing Session", xp: 20 },
  { name: "Write a Reflection", xp: 20 },
  { name: "Mindful Walking", xp: 20 },
  { name: "Five Minutes of Gratitude", xp: 20 },
];

export default function HabitGarden() {
  const [habits, setHabits] = useState(defaultHabits);
  const [lastCompletedId, setLastCompletedId] = useState<number | null>(null);
  const [showChainReaction, setShowChainReaction] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const [showLevelUpMessage, setShowLevelUpMessage] = useState(false);
  const [previousXpTier, setPreviousXpTier] = useState(0);
  const [showMilestoneApproaching, setShowMilestoneApproaching] = useState(false);
  const [specialTask, setSpecialTask] = useState(momentumBoostTasks[0]);
  const [milestoneGlowing, setMilestoneGlowing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const getRandomQuote = () => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  };

  const getXpMultiplier = (xp: number) => {
    if (xp >= 200) return 0.2; // 20% of original XP value
    if (xp >= 100) return 0.5; // 50% of original XP value
    return 1; // Full XP value
  };

  const getCurrentXpTier = (xp: number) => {
    if (xp >= 200) return 2;
    if (xp >= 100) return 1;
    return 0;
  };

  const getProgressPercentage = (xp: number) => {
    if (xp >= 200) return ((xp - 200) / 200) * 100;
    if (xp >= 100) return ((xp - 100) / 100) * 100;
    return (xp / 100) * 100;
  };

  const getTierMessage = (tier: number) => {
    switch (tier) {
      case 0: return "Beginner Gardener";
      case 1: return "Growing Gardener";
      case 2: return "Master Gardener";
      default: return "Gardener";
    }
  };

  // Calculate next milestone based on XP
  const getNextMilestone = (xp: number) => {
    if (xp < 100) return 100;
    if (xp < 200) return 200;
    return Math.ceil(xp / 100) * 100;
  };

  // Check if approaching milestone (80% towards next milestone)
  const isApproachingMilestone = (xp: number) => {
    const nextMilestone = getNextMilestone(xp);
    const previousMilestone = nextMilestone - 100;
    const threshold = previousMilestone + 80; // 80% of the way
    return xp >= threshold && xp < nextMilestone;
  };

  // Get a random special task for milestone boost
  const getRandomSpecialTask = () => {
    return momentumBoostTasks[Math.floor(Math.random() * momentumBoostTasks.length)];
  };

  // Check milestone approach on XP changes
  useEffect(() => {
    const approaching = isApproachingMilestone(totalXp);
    
    if (approaching && !showMilestoneApproaching) {
      setShowMilestoneApproaching(true);
      setSpecialTask(getRandomSpecialTask());
      setMilestoneGlowing(true);
      
      toast({
        title: "🌟 You're almost there!",
        description: `Complete a special task for extra XP: ${specialTask.name}`,
        duration: 5000,
      });
    } else if (!approaching) {
      setShowMilestoneApproaching(false);
      setMilestoneGlowing(false);
    }
  }, [totalXp]);

  // Check for milestone achievement
  useEffect(() => {
    const currentTier = getCurrentXpTier(totalXp);
    const previousTier = getCurrentXpTier(totalXp - 1);
    
    if (currentTier > previousTier) {
      setShowConfetti(true);
      
      toast({
        title: "🏆 Milestone Achieved!",
        description: "You've reached a new level of growth!",
        duration: 5000,
      });
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  }, [totalXp]);

  const completeSpecialTask = () => {
    // Apply the special task XP
    setTotalXp(prev => prev + specialTask.xp);
    
    toast({
      title: "✨ Momentum Boost!",
      description: `You gained +${specialTask.xp}XP from completing ${specialTask.name}!`,
      duration: 3000,
    });
    
    // Get a new special task for next time
    setSpecialTask(getRandomSpecialTask());
  };

  const updateStreak = useCallback((habitId: number) => {
    const currentHabit = habits.find(h => h.id === habitId);
    
    if (!currentHabit) return;

    // Check for chain reaction
    const isChainReaction = lastCompletedId !== null && lastCompletedId !== habitId;
    const bonusXp = isChainReaction ? 20 : 0;
    
    // Apply XP multiplier based on current total XP
    const multiplier = getXpMultiplier(totalXp);
    const baseXp = Math.round(currentHabit.xp * multiplier);
    const totalEarnedXp = baseXp + bonusXp;

    const currentTier = getCurrentXpTier(totalXp);
    const newTotalXp = totalXp + totalEarnedXp;
    const newTier = getCurrentXpTier(newTotalXp);

    // Check if user has moved to a new XP tier
    if (newTier > currentTier) {
      setPreviousXpTier(currentTier);
      setShowLevelUpMessage(true);
      toast({
        title: "🌟 Level Up!",
        description: `You're now a ${getTierMessage(newTier)}! Tasks will be more challenging but more rewarding!`,
        duration: 5000,
      });
      
      // Hide level up message after delay
      setTimeout(() => {
        setShowLevelUpMessage(false);
      }, 5000);
    }

    setHabits(habits.map(habit =>
      habit.id === habitId 
        ? { ...habit, streak: habit.streak + 1 }
        : habit
    ));

    setTotalXp(newTotalXp);
    
    if (isChainReaction) {
      setShowChainReaction(true);
      toast({
        title: "🌟 Chain Reaction Activated!",
        description: `${getRandomQuote()} +${bonusXp}XP bonus!`,
        duration: 3000,
      });

      // Reset chain after a short delay
      setTimeout(() => {
        setShowChainReaction(false);
      }, 2000);
    } else {
      // Show regular XP toast when no chain reaction
      toast({
        title: "✅ Task Completed!",
        description: `+${baseXp}XP earned${multiplier < 1 ? " (reduced due to your level)" : ""}`,
        duration: 2000,
      });
    }

    setLastCompletedId(habitId);
  }, [habits, lastCompletedId, totalXp]);

  const currentTier = getCurrentXpTier(totalXp);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDE1D3] to-[#E5DEFF] relative overflow-hidden">
      <ParticleEffect />
      
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="text-4xl font-bold text-center text-[#7FB069]"
            >
              <Trophy className="h-20 w-20 text-[#F97316] mx-auto mb-4" />
              You've reached a new level of growth!
            </motion.div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-[#2D3047] mb-2">
            Your Habit Garden
          </h1>
          <p className="text-[#8E9196] mb-4">Watch your habits grow into beautiful plants</p>
          
          {/* XP Display with Tooltip */}
          <div className="max-w-md mx-auto mb-4 bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-[#7FB069]/30">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[#7FB069] font-semibold mr-2"
                >
                  {getTierMessage(currentTier)}
                </motion.div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-[#7FB069]" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>As you level up, tasks become more challenging with reduced XP rewards:</p>
                      <ul className="list-disc pl-4 mt-1">
                        <li>Beginner (0-99 XP): Full rewards</li>
                        <li>Growing (100-199 XP): 50% rewards</li>
                        <li>Master (200+ XP): 20% rewards</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <motion.div
                animate={{ scale: milestoneGlowing ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 1, repeat: milestoneGlowing ? Infinity : 0 }}
                className={`text-[#7FB069] font-semibold ${milestoneGlowing ? 'text-[#F97316]' : ''}`}
              >
                Total XP: {totalXp}
              </motion.div>
            </div>
            
            {/* XP Progress Bar */}
            <div className="relative">
              <Progress 
                value={getProgressPercentage(totalXp)}
                className={`h-3 bg-[#E5DEFF] ${milestoneGlowing ? 'animate-pulse' : ''}`}
              />
              <motion.div 
                className={`absolute top-0 left-0 right-0 bottom-0 rounded-full ${milestoneGlowing ? 'bg-[#F97316]/20' : 'bg-transparent'}`}
                animate={{ opacity: milestoneGlowing ? [0, 0.5, 0] : 0 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute top-0 left-0 right-0 h-full flex justify-between items-center px-2 pointer-events-none">
                <div className={`text-xs font-medium ${currentTier > 0 ? 'text-[#7FB069]' : 'text-gray-500'}`}>0</div>
                <div className={`text-xs font-medium ${currentTier > 1 ? 'text-[#7FB069]' : 'text-gray-500'}`}>100</div>
                <div className="text-xs font-medium text-gray-500">200+</div>
              </div>
            </div>
          </div>

          {/* Special Task for Milestone Approach */}
          <AnimatePresence>
            {showMilestoneApproaching && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto mb-4 bg-gradient-to-r from-[#F97316]/30 to-[#FBBF24]/30 rounded-lg p-4 border border-[#F97316]/50 shadow-lg"
              >
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 text-[#F97316] mr-2" />
                  <h3 className="font-bold text-[#2D3047]">You're almost there!</h3>
                </div>
                
                <p className="text-sm text-[#2D3047] mb-3">
                  Complete this special task for a momentum boost:
                </p>
                
                <div className="flex items-center justify-between bg-white/50 p-3 rounded-md">
                  <span className="font-medium">{specialTask.name}</span>
                  <button 
                    onClick={completeSpecialTask}
                    className="px-3 py-1 bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-full text-sm font-medium"
                  >
                    +{specialTask.xp} XP
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Level Up Message */}
          <AnimatePresence>
            {showLevelUpMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto mb-4 bg-gradient-to-r from-[#8B5CF6] to-[#F97316] rounded-lg p-3 text-white font-medium"
              >
                You leveled up! Keep pushing yourself for greater challenges!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-[#2D3047] mb-4">Daily Rituals</h2>
            <DailyRitualCircle />
          </Card>

          <div className="space-y-4">
            <AnimatePresence>
              {habits.map((habit) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: habit.id * 0.1 }}
                >
                  <HabitPlant
                    habit={{
                      ...habit,
                      // Display adjusted XP value based on level
                      xp: Math.round(habit.xp * getXpMultiplier(totalXp))
                    }}
                    onComplete={() => updateStreak(habit.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showChainReaction && (
          <ChainReactionPopup />
        )}
      </AnimatePresence>
    </div>
  );
}
