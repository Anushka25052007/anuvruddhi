
import React from "react";
import { motion } from "framer-motion";

export function ParticleEffect() {
  const particles = Array.from({ length: 20 });

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 bg-[#FEC6A1] rounded-full"
          initial={{
            opacity: 0,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -200],
            x: (Math.random() - 0.5) * 100,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
