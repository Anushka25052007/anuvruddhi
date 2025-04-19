
import React from "react";
import { motion } from "framer-motion";

interface ForestWheelProps {
  isSpinning: boolean;
}

export function ForestWheel({ isSpinning }: ForestWheelProps) {
  const segments = 6;
  const segmentAngle = 360 / segments;
  
  return (
    <div className="relative w-72 h-72 sm:w-96 sm:h-96">
      <motion.div
        className="relative w-full h-full"
        animate={isSpinning ? {
          rotate: 360 * 5 + Math.random() * 360
        } : undefined}
        transition={isSpinning ? {
          duration: 3,
          ease: "easeOut"
        } : undefined}
      >
        <div className="absolute inset-0 rounded-full border-8 border-[#7FB069] bg-[#F2FCE2]/80 backdrop-blur-sm shadow-xl overflow-hidden">
          {Array.from({ length: segments }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1/2 h-[2px] bg-[#7FB069] origin-left"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${i * segmentAngle}deg)`,
              }}
            >
              <motion.div
                className="absolute -right-3 -top-3 w-6 h-6"
                initial={false}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-full text-[#7FB069]"
                >
                  <path
                    fill="currentColor"
                    d="M12 2L14.8 8.5L22 9.4L17 14.3L18.2 21.5L12 18.1L5.8 21.5L7 14.3L2 9.4L9.2 8.5L12 2Z"
                  />
                </svg>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 rounded-full bg-[#7FB069] shadow-lg"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </motion.div>
      
      <motion.div
        className="absolute inset-0"
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
    </div>
  );
}
