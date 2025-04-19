
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Droplet, Wind, Tree, Clock, Sparkles } from "lucide-react";
import { TaskTile } from "@/components/motivation/TaskTile";
import { SpiritTree } from "@/components/motivation/SpiritTree";
import { ParticleEffect } from "@/components/motivation/ParticleEffect";

const challenges = [
  {
    id: 1,
    title: "Drink Water",
    icon: Droplet,
    duration: "2 minutes",
    points: 10,
  },
  {
    id: 2,
    title: "Deep Breathe",
    icon: Wind,
    duration: "5 minutes",
    points: 15,
  },
  {
    id: 3,
    title: "Connect with Nature",
    icon: Tree,
    duration: "10 minutes",
    points: 20,
  },
  {
    id: 4,
    title: "Reflect",
    icon: Clock,
    duration: "5 minutes",
    points: 15,
  },
];

export default function MotivationArena() {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  
  const handleTaskComplete = (taskId: number) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#E5DEFF] relative overflow-hidden">
      <ParticleEffect />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-[#2D3047] mb-4">
              Today's Forest Journey
            </h1>
          </motion.div>
          
          <Card className="w-full max-w-md p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-[#7FB069]">
                Progress: {completedTasks.length}/{challenges.length}
              </span>
              <Sparkles className="h-6 w-6 text-[#FEC6A1]" />
            </div>
            
            <SpiritTree progress={completedTasks.length / challenges.length} />
          </Card>
        </div>

        <ScrollArea className="h-[60vh] w-full max-w-2xl mx-auto rounded-lg">
          <div className="space-y-4 p-4">
            <AnimatePresence>
              {challenges.map((challenge, index) => (
                <TaskTile
                  key={challenge.id}
                  challenge={challenge}
                  isCompleted={completedTasks.includes(challenge.id)}
                  onComplete={() => handleTaskComplete(challenge.id)}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
