
import React from "react";
import { motion } from "framer-motion";
import { Diamond } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SoulGemCollectionProps {
  totalXp: number;
}

export function SoulGemCollection({ totalXp }: SoulGemCollectionProps) {
  // Calculate how many gems the user has earned (1 per 10 XP)
  const totalGems = Math.floor(totalXp / 10);
  
  // Different gem types
  const gemTypes = [
    { name: "Peace", color: "bg-gradient-to-br from-[#9b87f5] to-[#7366B9]", count: Math.floor(totalGems * 0.25) },
    { name: "Wisdom", color: "bg-gradient-to-br from-[#1EAEDB] to-[#1A8CB0]", count: Math.floor(totalGems * 0.25) },
    { name: "Strength", color: "bg-gradient-to-br from-[#7FB069] to-[#5C8149]", count: Math.floor(totalGems * 0.25) },
    { name: "Love", color: "bg-gradient-to-br from-[#D946EF] to-[#BA39CC]", count: totalGems - Math.floor(totalGems * 0.75) },
  ];
  
  // Rare gems (unlocked at specific XP thresholds)
  const rareGems = [
    { name: "Clarity", threshold: 100, color: "bg-gradient-to-br from-[#FFF] to-[#E1E1E1]" },
    { name: "Focus", threshold: 200, color: "bg-gradient-to-br from-[#FBB03B] to-[#D69531]" },
    { name: "Resolve", threshold: 300, color: "bg-gradient-to-br from-[#F15A24] to-[#C7481E]" },
  ].filter(gem => totalXp >= gem.threshold);

  return (
    <Card className="w-full bg-[#1A1F2C]/80 border-[#9b87f5]/30 backdrop-blur-sm text-white p-4">
      <h3 className="text-lg font-medium text-center mb-4 flex items-center justify-center">
        <Diamond className="mr-2 h-5 w-5 text-[#9b87f5]" />
        Soul Gem Collection
      </h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {gemTypes.map((gem, i) => (
          <div key={i} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <motion.div
                className={`w-8 h-8 ${gem.color} rounded-md rotate-45 relative overflow-hidden`}
                whileHover={{ scale: 1.1 }}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-white/30"
                  animate={{
                    left: ["100%", "-100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2.5,
                  }}
                  style={{
                    width: "50%",
                    transform: "skewX(-20deg)",
                  }}
                />
              </motion.div>
              <span className="ml-2 text-white/70">
                {gem.name}: <span className="font-medium text-white">{gem.count}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {rareGems.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-[#9b87f5] mb-3">Rare Gems</h4>
          <div className="flex justify-center space-x-4">
            {rareGems.map((gem, i) => (
              <motion.div
                key={i}
                className={`w-10 h-10 ${gem.color} rounded-md rotate-45 relative overflow-hidden`}
                whileHover={{ scale: 1.15, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Diamond shine effect */}
                <div className="shine-effect"></div>
                
                {/* Gem name label */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center rotate-45 opacity-0"
                  whileHover={{ opacity: 1 }}
                >
                  <span className="text-[0.6rem] font-bold text-gray-900">{gem.name}</span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
