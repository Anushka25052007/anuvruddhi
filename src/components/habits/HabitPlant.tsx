
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flower2, Sun, Leaf, BookOpen, Timer, Music, Dumbbell } from "lucide-react";

interface HabitPlantProps {
  name: string;
  xp: number;
  completed: boolean;
  onClick: () => void;
}

export function HabitPlant({ name, xp, completed, onClick }: HabitPlantProps) {
  // Simplified version to match the props being passed in HabitGarden.tsx
  const type = "leaf"; // Default type for now
  const streak = completed ? 1 : 0; // Simple determination based on completion status
  
  const getGrowthStage = (streak: number) => {
    if (streak >= 7) return "blooming";
    if (streak >= 3) return "growing";
    if (streak >= 1) return "sprouting";
    return "seed";
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "sunrise":
        return Sun;
      case "leaf":
        return Leaf;
      case "flower":
        return Flower2;
      case "lotus":
        return Flower2;
      case "study":
        return BookOpen;
      case "timer":
        return Timer;
      case "music":
        return Music;
      case "exercise":
        return Dumbbell;
      default:
        return Leaf;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case "sunrise":
        return "from-[#FDE1D3] to-[#F97316]";
      case "leaf":
        return "from-[#F2FCE2] to-[#7FB069]";
      case "flower":
        return "from-[#E5DEFF] to-[#8B5CF6]";
      case "lotus":
        return "from-[#FFDEE2] to-[#D946EF]";
      case "study":
        return "from-[#D3E4FD] to-[#1EAEDB]";
      case "timer":
        return "from-[#FEF7CD] to-[#FBBF24]";
      case "music":
        return "from-[#FEC6A1] to-[#F97316]";
      case "exercise":
        return "from-[#FEC6A1] to-[#ea384c]";
      default:
        return "from-[#E5DEFF] to-[#8B5CF6]";
    }
  };

  const Icon = getIcon(type);
  const stage = getGrowthStage(streak);
  const gradient = getGradient(type);

  return (
    <Card className={`p-4 bg-white/80 backdrop-blur-sm border-2 ${completed ? 'border-[#7FB069]' : 'hover:border-[#7FB069]'} transition-all overflow-hidden`}>
      <div className="flex items-center justify-between relative">
        {/* Background effect based on habit type */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br opacity-5 -translate-y-1/2 translate-x-1/2 blur-md" />
        
        <div className="flex items-center space-x-4 z-10">
          <motion.div
            className={`p-3 rounded-full bg-gradient-to-br ${gradient} ${
              stage === "blooming" ? "shadow-lg" : ""
            }`}
            animate={{
              scale: [1, 1.1, 1],
              rotate: stage === "blooming" ? [0, 360] : 0,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Icon className="h-6 w-6 text-white" />
          </motion.div>
          
          <div>
            <h3 className="font-semibold text-lg text-[#2D3047]">
              {name}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center space-x-2">
                <div className="relative w-24 h-2">
                  <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${gradient}`}
                    style={{ width: `${completed ? 100 : 0}%` }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${completed ? 100 : 0}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-sm text-[#8E9196] whitespace-nowrap">
                  {completed ? "Completed" : "Not started"}
                </span>
              </div>
              <span className="text-sm font-medium bg-gradient-to-br bg-clip-text text-transparent whitespace-nowrap ${gradient}">
                +{xp} XP
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={onClick}
          variant="outline"
          className={`bg-gradient-to-r ${gradient} text-white border-none hover:opacity-90 z-10`}
        >
          {completed ? "Completed" : "Complete"}
        </Button>
      </div>
    </Card>
  );
}
