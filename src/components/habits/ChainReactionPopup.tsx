
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function ChainReactionPopup() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.2, 1],
        opacity: 1,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
    >
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#F97316] rounded-full opacity-20 blur-xl"
        />
        <motion.div
          className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full shadow-xl border-2 border-[#7FB069] flex items-center gap-3"
        >
          <Sparkles className="text-[#F97316] h-6 w-6" />
          <span className="text-xl font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#F97316] text-transparent bg-clip-text">
            Chain Reaction!
          </span>
          <Sparkles className="text-[#8B5CF6] h-6 w-6" />
        </motion.div>
      </div>
    </motion.div>
  );
}
