
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ParticleEffect } from "@/components/motivation/ParticleEffect";
import { HabitPlant } from "@/components/habits/HabitPlant";
import { DailyRitualCircle } from "@/components/habits/DailyRitualCircle";

const defaultHabits = [
  { id: 1, name: "Wake Up Early", streak: 0, type: "sunrise" },
  { id: 2, name: "Mindful Eating", streak: 0, type: "leaf" },
  { id: 3, name: "Gratitude Journal", streak: 0, type: "flower" },
  { id: 4, name: "Meditation", streak: 0, type: "lotus" },
];

export default function HabitGarden() {
  const [habits, setHabits] = useState(defaultHabits);

  const updateStreak = (habitId: number) => {
    setHabits(habits.map(habit =>
      habit.id === habitId 
        ? { ...habit, streak: habit.streak + 1 }
        : habit
    ));
  };

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
          <p className="text-[#8E9196]">Watch your habits grow into beautiful plants</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-[#2D3047] mb-4">Daily Rituals</h2>
            <DailyRitualCircle />
          </Card>

          <div className="space-y-4">
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: habit.id * 0.1 }}
              >
                <HabitPlant
                  habit={habit}
                  onComplete={() => updateStreak(habit.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
