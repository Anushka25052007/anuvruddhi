
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ParticleEffect } from "@/components/motivation/ParticleEffect";
import { HabitPlant } from "@/components/habits/HabitPlant";
import { DailyRitualCircle } from "@/components/habits/DailyRitualCircle";
import { ChainReactionPopup } from "@/components/habits/ChainReactionPopup";

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

export default function HabitGarden() {
  const [habits, setHabits] = useState(defaultHabits);
  const [lastCompletedId, setLastCompletedId] = useState<number | null>(null);
  const [showChainReaction, setShowChainReaction] = useState(false);
  const [totalXp, setTotalXp] = useState(0);

  const getRandomQuote = () => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  };

  const updateStreak = useCallback((habitId: number) => {
    const currentHabit = habits.find(h => h.id === habitId);
    
    if (!currentHabit) return;

    // Check for chain reaction
    const isChainReaction = lastCompletedId !== null && lastCompletedId !== habitId;
    const bonusXp = isChainReaction ? 20 : 0;
    const totalEarnedXp = currentHabit.xp + bonusXp;

    setHabits(habits.map(habit =>
      habit.id === habitId 
        ? { ...habit, streak: habit.streak + 1 }
        : habit
    ));

    setTotalXp(prev => prev + totalEarnedXp);
    
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
    }

    setLastCompletedId(habitId);
  }, [habits, lastCompletedId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDE1D3] to-[#E5DEFF] relative overflow-hidden">
      <ParticleEffect />
      
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
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[#7FB069] font-semibold"
          >
            Total XP: {totalXp}
          </motion.div>
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
                    habit={habit}
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
