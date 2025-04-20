
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flower2, Sun, Leaf } from "lucide-react";

interface HabitPlantProps {
  habit: {
    id: number;
    name: string;
    streak: number;
    type: string;
    xp: number;
  };
  onComplete: () => void;
}

export function HabitPlant({ habit, onComplete }: HabitPlantProps) {
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
      default:
        return Leaf;
    }
  };

  const Icon = getIcon(habit.type);
  const stage = getGrowthStage(habit.streak);

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-2 hover:border-[#7FB069] transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.div
            className={`p-3 rounded-full ${
              stage === "blooming" ? "bg-[#F2FCE2]" : "bg-[#E5DEFF]"
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
            <Icon className={`h-6 w-6 ${
              stage === "blooming" ? "text-[#7FB069]" : "text-[#6B5B95]"
            }`} />
          </motion.div>
          
          <div>
            <h3 className="font-semibold text-lg text-[#2D3047]">
              {habit.name}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center space-x-2">
                <motion.div
                  className="h-1 rounded-full bg-[#7FB069] transition-all"
                  style={{ width: `${Math.min(habit.streak * 14, 100)}%` }}
                />
                <span className="text-sm text-[#8E9196]">
                  {habit.streak} day{habit.streak !== 1 ? "s" : ""}
                </span>
              </div>
              <span className="text-sm font-medium text-[#7FB069]">
                +{habit.xp} XP
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={onComplete}
          variant="outline"
          className="bg-[#F2FCE2] border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069] hover:text-white"
        >
          Complete
        </Button>
      </div>
    </Card>
  );
}
