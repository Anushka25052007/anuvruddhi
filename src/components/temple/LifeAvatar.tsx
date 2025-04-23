
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Flame, Zap } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface LifeAvatarProps {
  xpLevel: number;
  userImage?: string;
  streakDays?: number;
}

export function LifeAvatar({ xpLevel, userImage, streakDays = 0 }: LifeAvatarProps) {
  const [isBeating, setIsBeating] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);

  // Determine avatar stage based on XP level
  const getAvatarStage = () => {
    if (xpLevel >= 300) return "enlightened";
    if (xpLevel >= 200) return "elevated";
    if (xpLevel >= 100) return "growing";
    return "beginning";
  };

  // Get appropriate aura color based on avatar stage and streak
  const getAuraColor = () => {
    const stage = getAvatarStage();
    // Enhance aura based on streak days
    const streakBoost = Math.min(streakDays / 10, 1); // Max boost at 10 days
    
    switch (stage) {
      case "enlightened": return `from-[#9b87f5] via-[${streakBoost > 0.5 ? '#cc6ff8' : '#af87f5'}] to-transparent`;
      case "elevated": return `from-[#1EAEDB] via-[${streakBoost > 0.5 ? '#2CD3F5' : '#1EAEDB'}] to-transparent`;
      case "growing": return `from-[#7FB069] via-[${streakBoost > 0.5 ? '#92D672' : '#7FB069'}] to-transparent`;
      default: return `from-[#D946EF] via-[${streakBoost > 0.5 ? '#F766FF' : '#D946EF'}] to-transparent`;
    }
  };

  // Get energy level based on XP and streaks
  const getEnergyLevel = () => {
    const baseEnergy = Math.min((xpLevel / 300) * 100, 100);
    const streakBonus = Math.min(streakDays * 2, 20); // Max 20% bonus from streaks
    return Math.min(baseEnergy + streakBonus, 100);
  };
  
  // Heart beat animation every few seconds
  useEffect(() => {
    const beatIntervalId = setInterval(() => {
      setIsBeating(true);
      setTimeout(() => setIsBeating(false), 1000);
    }, 3000);
    
    const glowIntervalId = setInterval(() => {
      setIsGlowing(true);
      setTimeout(() => setIsGlowing(false), 1500);
    }, 5000);
    
    return () => {
      clearInterval(beatIntervalId);
      clearInterval(glowIntervalId);
    };
  }, []);

  // Get dynamic stage description based on XP level and streaks
  const getStageDescription = () => {
    const stage = getAvatarStage();
    if (streakDays >= 21) {
      return stage === "enlightened" ? "Transcendent Master" : 
             stage === "elevated" ? "Disciplined Cultivator" : 
             stage === "growing" ? "Consistent Practitioner" : "Dedicated Beginner";
    }
    
    return stage === "enlightened" ? "Enlightened Soul" :
           stage === "elevated" ? "Elevated Being" :
           stage === "growing" ? "Growing Spirit" : "Awakening Seeker";
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative"
        animate={{
          scale: isBeating ? [1, 1.1, 1] : 1
        }}
        transition={{ 
          duration: 1,
          ease: "easeInOut"
        }}
      >
        {/* Background aura effect */}
        <motion.div 
          className={`absolute -inset-8 rounded-full bg-gradient-radial ${getAuraColor()} opacity-50 blur-md z-0`}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Inner glow */}
        <motion.div 
          className={`absolute -inset-4 rounded-full bg-[#ea384c]/20 blur-md ${isGlowing ? 'opacity-60' : 'opacity-20'}`}
          animate={{
            opacity: isGlowing ? [0.2, 0.6, 0.2] : [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* User image if available, otherwise heart image */}
        <motion.div
          className="relative z-10 w-44 h-44 flex items-center justify-center"
          animate={{
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {userImage ? (
            <Avatar className="w-40 h-40 border-4 border-white/30">
              <AvatarImage src={userImage} alt="User Avatar" className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-[#0F1D31] to-[#1A1F2C] text-white text-4xl">
                <Heart className="h-20 w-20 text-[#ea384c]" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <img 
              src="/lovable-uploads/85e3e25b-b915-4033-a741-10ddb41d6a49.png" 
              alt="Life Avatar Heart" 
              className="w-full h-full object-contain"
            />
          )}
        </motion.div>
        
        {/* Energy level indicators */}
        <motion.div 
          className="absolute top-0 right-0 mt-2 mr-2 z-20 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Flame className="h-3 w-3 mr-1 text-orange-400" />
          <span>{Math.round(getEnergyLevel())}%</span>
        </motion.div>
        
        {/* Streak indicator */}
        {streakDays > 0 && (
          <motion.div 
            className="absolute top-0 left-0 mt-2 ml-2 z-20 bg-[#9b87f5]/30 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Zap className="h-3 w-3 mr-1 text-yellow-300" />
            <span>{streakDays} days</span>
          </motion.div>
        )}
        
        {/* Surrounding particles for advanced stages */}
        {getAvatarStage() !== "beginning" && (
          <div className="absolute inset-0 z-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${
                  getAvatarStage() === "enlightened" ? "bg-[#9b87f5]" : 
                  getAvatarStage() === "elevated" ? "bg-[#1EAEDB]" : "bg-[#7FB069]"
                }`}
                style={{
                  top: `${50 + 40 * Math.sin(i * (Math.PI / 4))}%`,
                  left: `${50 + 40 * Math.cos(i * (Math.PI / 4))}%`
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2 + i * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
      
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-medium text-white mb-1">Life Avatar</h2>
        <p className="text-[#9b87f5] font-medium">
          {getStageDescription()}
        </p>
        
        {/* XP level indicator */}
        <div className="mt-2 flex items-center justify-center space-x-1">
          <Sparkles className="h-4 w-4 text-yellow-300" />
          <span className="text-white/80 text-sm">Level: {Math.floor(xpLevel / 100) + 1}</span>
        </div>
      </motion.div>
    </div>
  );
}
