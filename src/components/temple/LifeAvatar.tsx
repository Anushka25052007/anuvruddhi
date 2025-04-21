
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface LifeAvatarProps {
  xpLevel: number;
}

export function LifeAvatar({ xpLevel }: LifeAvatarProps) {
  const [isBeating, setIsBeating] = useState(false);

  // Determine avatar stage based on XP level
  const getAvatarStage = () => {
    if (xpLevel >= 300) return "enlightened";
    if (xpLevel >= 200) return "elevated";
    if (xpLevel >= 100) return "growing";
    return "beginning";
  };

  // Get appropriate aura color based on avatar stage
  const getAuraColor = () => {
    switch (getAvatarStage()) {
      case "enlightened": return "from-[#9b87f5] to-transparent";
      case "elevated": return "from-[#1EAEDB] to-transparent";
      case "growing": return "from-[#7FB069] to-transparent";
      default: return "from-[#D946EF] to-transparent";
    }
  };
  
  // Heart beat animation every few seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsBeating(true);
      setTimeout(() => setIsBeating(false), 1000);
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);

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
          className="absolute -inset-4 rounded-full bg-[#ea384c]/20 blur-md"
          animate={{
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Heart image */}
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
          <img 
            src="/lovable-uploads/85e3e25b-b915-4033-a741-10ddb41d6a49.png" 
            alt="Life Avatar Heart" 
            className="w-full h-full object-contain"
          />
        </motion.div>
        
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
          {getAvatarStage() === "enlightened" ? "Enlightened Soul" :
           getAvatarStage() === "elevated" ? "Elevated Being" :
           getAvatarStage() === "growing" ? "Growing Spirit" : "Awakening Seeker"}
        </p>
      </motion.div>
    </div>
  );
}
