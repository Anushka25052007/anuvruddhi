
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Droplet, Wind, Trees, Clock, Sparkles, Heart } from "lucide-react";
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
    color: "#0EA5E9"
  },
  {
    id: 2,
    title: "Deep Breathe",
    icon: Wind,
    duration: "5 minutes",
    points: 15,
    color: "#9b87f5"
  },
  {
    id: 3,
    title: "Connect with Nature",
    icon: Trees,
    duration: "10 minutes",
    points: 20,
    color: "#7FB069"
  },
  {
    id: 4,
    title: "Reflect",
    icon: Clock,
    duration: "5 minutes",
    points: 15,
    color: "#D946EF"
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
    <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] to-[#FEC6A1] relative overflow-hidden">
      <ParticleEffect />
      
      {/* Background animated shapes */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-[#9b87f5]/20 to-[#1EAEDB]/20 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-[#7FB069]/20 to-[#D946EF]/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -20, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-[#2D3047] mb-4 flex items-center">
              <Heart className="mr-3 h-8 w-8 text-[#D946EF]" />
              <span className="bg-gradient-to-r from-[#9b87f5] to-[#D946EF] bg-clip-text text-transparent">
                Your Daily Journey
              </span>
            </h1>
          </motion.div>
          
          <Card className="w-full max-w-md p-6 bg-white/80 backdrop-blur-sm border border-[#9b87f5]/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold bg-gradient-to-r from-[#7FB069] to-[#1EAEDB] bg-clip-text text-transparent">
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
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="transform transition-all hover:scale-[1.02]"
                >
                  <Card className={`p-4 border border-white/50 backdrop-blur-sm bg-white/70 hover:shadow-[0_0_15px_rgba(155,135,245,0.3)] transition-all duration-300`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full mr-3" style={{ backgroundColor: `${challenge.color}30` }}>
                          <challenge.icon className="h-5 w-5" style={{ color: challenge.color }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#2D3047]">{challenge.title}</h3>
                          <div className="flex items-center text-sm text-[#2D3047]/60">
                            <Clock className="h-3 w-3 mr-1" />
                            {challenge.duration}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 font-medium text-[#9b87f5]">+{challenge.points} XP</span>
                        <motion.button
                          onClick={() => handleTaskComplete(challenge.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            completedTasks.includes(challenge.id)
                              ? "bg-[#7FB069] text-white"
                              : "bg-white/50 border border-[#9b87f5]/30"
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {completedTasks.includes(challenge.id) ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              ✓
                            </motion.div>
                          ) : null}
                        </motion.button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
