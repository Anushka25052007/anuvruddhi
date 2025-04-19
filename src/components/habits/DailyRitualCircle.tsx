
import React from "react";
import { motion } from "framer-motion";

export function DailyRitualCircle() {
  return (
    <div className="relative w-full aspect-square">
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-dashed border-[#7FB069]/30"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-[#F2FCE2]/50 to-[#7FB069]/20 backdrop-blur-sm"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[#2D3047] font-medium">Drop habits here</span>
        </div>
      </motion.div>
    </div>
  );
}
