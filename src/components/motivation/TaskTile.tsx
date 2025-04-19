
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface TaskTileProps {
  challenge: {
    id: number;
    title: string;
    icon: LucideIcon;
    duration: string;
    points: number;
  };
  isCompleted: boolean;
  onComplete: () => void;
  index: number;
}

export function TaskTile({ challenge, isCompleted, onComplete, index }: TaskTileProps) {
  const Icon = challenge.icon;

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        className={`p-4 ${
          isCompleted
            ? "bg-[#F2FCE2] border-[#7FB069]"
            : "bg-white/80 hover:bg-white/90"
        } backdrop-blur-sm transition-all duration-300 border-2`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`p-3 rounded-full ${
                isCompleted ? "bg-[#7FB069]" : "bg-[#E5DEFF]"
              }`}
            >
              <Icon className={`h-6 w-6 ${
                isCompleted ? "text-white" : "text-[#7FB069]"
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[#2D3047]">
                {challenge.title}
              </h3>
              <p className="text-sm text-gray-500">
                {challenge.duration} • {challenge.points} points
              </p>
            </div>
          </div>
          <Button
            onClick={onComplete}
            disabled={isCompleted}
            variant={isCompleted ? "ghost" : "default"}
            className={`${
              isCompleted
                ? "bg-[#7FB069]/20 text-[#7FB069]"
                : "bg-[#7FB069] hover:bg-[#6A9957]"
            }`}
          >
            {isCompleted ? "Completed!" : "Start"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
