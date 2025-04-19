
import React from "react";
import { motion } from "framer-motion";
import { Trees } from "lucide-react";

interface SpiritTreeProps {
  progress: number;
}

export function SpiritTree({ progress }: SpiritTreeProps) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="relative"
      >
        <Trees
          className="h-24 w-24 text-[#7FB069]"
          style={{
            filter: `brightness(${100 + progress * 50}%)`,
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 20px rgba(127, 176, 105, 0.2)",
              "0 0 40px rgba(127, 176, 105, 0.4)",
              "0 0 20px rgba(127, 176, 105, 0.2)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>
      <div className="mt-4 text-center">
        <motion.div
          className="text-sm font-medium text-[#2D3047]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Spirit Tree Growth
        </motion.div>
      </div>
    </div>
  );
}
